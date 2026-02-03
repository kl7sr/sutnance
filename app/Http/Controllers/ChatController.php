<?php

namespace App\Http\Controllers;

use App\Http\Controllers\MessageController;
use App\Models\Message;
use App\Models\Conversation;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ChatController extends Controller
{
    private function messageCanEdit(Message $message): bool
    {
        if ($message->content === MessageController::DELETED_PLACEHOLDER) {
            return false;
        }
        $user = auth()->user();
        if ($message->user_id !== $user->id) {
            return false;
        }
        return $message->created_at->diffInMinutes(now(), false) <= MessageController::EDIT_WINDOW_MINUTES;
    }

    private function messageCanDeleteForEveryone(Message $message): bool
    {
        $user = auth()->user();
        if ($user->role === 'admin') {
            return true;
        }
        if ($message->user_id !== $user->id) {
            return false;
        }
        return $message->created_at->diffInMinutes(now(), false) <= MessageController::DELETE_FOR_EVERYONE_WINDOW_MINUTES;
    }

    /** Check if user has "deleted" (soft-deleted) this private chat via pivot. */
    private function userHasDeletedConversation(User $user, Conversation $conversation): bool
    {
        return DB::table('conversation_user')
            ->where('conversation_id', $conversation->id)
            ->where('user_id', $user->id)
            ->whereNotNull('deleted_at')
            ->exists();
    }
    public function unreadCount()
    {
        return response()->json([
            'count' => auth()->user()->unreadMessagesCount(),
        ]);
    }

    public function index(Conversation $conversation = null): Response {
        $user = auth()->user();
        
        // Get all conversations with pivot (last_read_at) and add unread_count per conversation
        $conversations = $user->conversations()
            ->withPivot('last_read_at')
            ->with(['users' => function ($q) use ($user) {
                $q->where('users.id', '!=', $user->id)
                    ->select('users.id', 'users.name', 'users.profile_photo', 'users.last_seen', 'users.role');
            }])
            ->latest('updated_at')
            ->get()
            ->map(function ($conv) use ($user) {
                $lastReadAt = $conv->pivot->last_read_at ?? null;
                $conv->unread_count = (int) $conv->messages()
                    ->where('user_id', '!=', $user->id)
                    ->when($lastReadAt, fn ($q) => $q->where('created_at', '>', $lastReadAt))
                    ->count();
                return $conv;
            });

        $messages = [];
        $messagesLastReadAt = null;

        if ($conversation) {
            // AUTHORIZATION CHECK: must be participant and must not have deleted the chat
            if (!$conversation->users->contains($user->id)) {
                abort(403);
            }
            if ($this->userHasDeletedConversation($user, $conversation)) {
                abort(403, 'Cette conversation a été supprimée.');
            }

            // Capture last_read_at BEFORE marking as read (for "New" indicator on messages)
            $pivot = DB::table('conversation_user')
                ->where('conversation_id', $conversation->id)
                ->where('user_id', $user->id)
                ->first();
            $messagesLastReadAt = $pivot && $pivot->last_read_at ? \Carbon\Carbon::parse($pivot->last_read_at)->toIso8601String() : null;

            // Mark conversation as read for current user (update pivot directly; user's conversations() excludes deleted)
            DB::table('conversation_user')
                ->where('conversation_id', $conversation->id)
                ->where('user_id', $user->id)
                ->update(['last_read_at' => now()]);

            // Load users for groups (needed for group info sidebar)
            $conversation->load(['users' => fn ($q) => $q->select('users.id', 'users.name', 'users.profile_photo', 'users.last_seen', 'users.role')]);

            // Mark as active and get messages (exclude "deleted for me", eager-load user)
            $messagesCollection = $conversation->messages()
                ->whereDoesntHave('deletedByUsers', fn ($q) => $q->where('message_user.user_id', $user->id))
                ->with(['user' => fn ($q) => $q->select('users.id', 'users.name', 'users.profile_photo', 'users.last_seen')])
                ->latest()
                ->take(50)
                ->get()
                ->reverse()
                ->values();

            $messages = $messagesCollection->map(function ($msg) use ($user) {
                $arr = $msg->toArray();
                $arr['can_edit'] = $this->messageCanEdit($msg);
                $arr['can_delete_for_everyone'] = $this->messageCanDeleteForEveryone($msg);
                $arr['can_delete_for_me'] = $msg->user_id === $user->id || $user->role === 'admin';
                $arr['is_deleted_for_everyone'] = $msg->content === \App\Http\Controllers\MessageController::DELETED_PLACEHOLDER;
                return $arr;
            })->toArray();
        }

        // For creating groups (Admin only)
        $allUsers = User::where('id', '!=', $user->id)->orderBy('name')->get();

        // Users available to add to group (excludes current members) - only relevant when viewing a group
        $usersToAdd = [];
        if ($conversation && $conversation->type === 'group' && $user->role === 'admin') {
            $memberIds = $conversation->users->pluck('id')->toArray();
            $usersToAdd = User::whereNotIn('id', $memberIds)
                ->where('id', '!=', $user->id)
                ->orderBy('name')
                ->get();
        }

        return Inertia::render('Chat', [
            'conversations' => $conversations,
            'conversation' => $conversation,
            'messages' => $messages,
            'messagesLastReadAt' => $messagesLastReadAt,
            'allUsers' => $allUsers,
            'usersToAdd' => $usersToAdd,
        ]);
    }

    public function send(Request $request, Conversation $conversation) {
        $user = auth()->user();
        if (!$conversation->users->contains($user->id)) {
            abort(403);
        }
        if ($this->userHasDeletedConversation($user, $conversation)) {
            abort(403, 'Cette conversation a été supprimée.');
        }

        $request->validate([
            'content' => 'required_without:attachment',
            'attachment' => 'nullable|file|max:10240'
        ]);

        $path = null;
        if ($request->hasFile('attachment')) {
            $path = $request->file('attachment')->store('conversations/' . $conversation->id, 'public');
        }

        $conversation->messages()->create([
            'user_id' => auth()->id(),
            'content' => $request->content ?? '',
            'attachment' => $path,
        ]);

        // Restore on new message: clear deleted_at for all participants so chat reappears
        DB::table('conversation_user')
            ->where('conversation_id', $conversation->id)
            ->update(['deleted_at' => null]);

        // Update conversation timestamp to bump it to top
        $conversation->touch();

        return back();
    }

    public function download(Message $message)
    {
        $user = auth()->user();
        if (!$message->conversation->users->contains($user->id)) {
            abort(403);
        }
        if ($this->userHasDeletedConversation($user, $message->conversation)) {
            abort(403, 'Cette conversation a été supprimée.');
        }

        if (! $message->attachment) {
            abort(404);
        }

        if (! Storage::disk('public')->exists($message->attachment)) {
            abort(404);
        }

        return Storage::disk('public')->download($message->attachment);
    }

    public function dm(User $user)
    {
        $me = auth()->user();
        if ($me->id === $user->id) {
            return back(); // Cannot DM yourself
        }

        // Find existing private conversation (even if one user has soft-deleted it)
        $conversation = Conversation::where('type', 'private')
            ->whereHas('users', fn($q) => $q->where('users.id', $me->id))
            ->whereHas('users', fn($q) => $q->where('users.id', $user->id))
            ->first();

        if (!$conversation) {
            $conversation = Conversation::create(['type' => 'private']);
            $conversation->users()->attach([$me->id, $user->id]);
        } else {
            // Restore visibility for both users (clear deleted_at) so no 403 / "Conversation deleted"
            DB::table('conversation_user')
                ->where('conversation_id', $conversation->id)
                ->whereIn('user_id', [$me->id, $user->id])
                ->update(['deleted_at' => null]);
        }

        return redirect()->route('chat.index', $conversation);
    }

    public function createGroup(Request $request) {
        $user = auth()->user();

        // Check Admin
        if ($user->role !== 'admin') {
            abort(403, 'Unauthorized');
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'image' => 'nullable|image|max:2048',
            'participants' => 'required|array|min:1',
            'participants.*' => 'exists:users,id'
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('conversations/avatars', 'public');
        }

        // Create Group
        $conversation = Conversation::create([
            'name' => $request->name,
            'type' => 'group',
            'image' => $imagePath,
        ]);

        // Add creator and participants
        $participants = $request->participants;
        $participants[] = $user->id; // Add self

        $conversation->users()->attach(array_unique($participants));

        return redirect()->route('chat.index', $conversation);
    }

    public function addMembers(Request $request, Conversation $conversation)
    {
        $user = auth()->user();

        if ($user->role !== 'admin') {
            abort(403, 'Unauthorized');
        }

        if ($conversation->type !== 'group') {
            abort(400, 'Can only add members to groups');
        }

        if (!$conversation->users->contains($user->id)) {
            abort(403, 'You must be a member of this group');
        }

        $request->validate([
            'user_ids' => 'required|array|min:1',
            'user_ids.*' => 'exists:users,id',
        ]);

        $existingIds = $conversation->users->pluck('id')->toArray();
        $newIds = array_diff($request->user_ids, $existingIds);

        if (!empty($newIds)) {
            $conversation->users()->attach($newIds);
        }

        return redirect()->route('chat.index', $conversation);
    }

    public function removeMember(Conversation $conversation, User $user)
    {
        $authUser = auth()->user();

        if ($authUser->role !== 'admin') {
            abort(403, 'Unauthorized');
        }

        if ($conversation->type !== 'group') {
            abort(400, 'Can only remove members from groups');
        }

        if (!$conversation->users->contains($authUser->id)) {
            abort(403, 'You must be a member of this group');
        }

        // Cannot remove yourself
        if ($user->id === $authUser->id) {
            abort(400, 'You cannot remove yourself. Use "Supprimer le groupe" to leave.');
        }

        $conversation->users()->detach($user->id);

        return redirect()->route('chat.index', $conversation);
    }

    public function updateGroup(Request $request, Conversation $conversation)
    {
        if (auth()->user()->role !== 'admin') {
            abort(403, 'Unauthorized');
        }

        $request->validate([
            'name' => 'nullable|string|max:255',
            'image' => 'nullable|image|max:2048',
        ]);

        if ($request->filled('name')) {
            $conversation->name = $request->name;
        }

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('conversations/avatars', 'public');
            $conversation->image = $path;
        }

        $conversation->save();

        return redirect()->route('chat.index', $conversation);
    }

    public function destroy(Conversation $conversation)
    {
        $user = auth()->user();

        // Groups: only admin can delete
        if ($conversation->type === 'group') {
            if ($user->role !== 'admin') {
                abort(403, 'Seuls les administrateurs peuvent supprimer un groupe.');
            }
        } else {
            // Private chat: participant can delete
            if (!$conversation->users->contains($user->id)) {
                abort(403);
            }
        }

        $conversation->users()->detach();
        $conversation->messages()->delete();
        $conversation->delete();

        return redirect()->route('chat.index');
    }

    /**
     * Leave a private conversation (delete for current user only).
     * Sets deleted_at on the conversation_user pivot; the other participant still sees the chat.
     */
    public function leaveConversation(Conversation $conversation)
    {
        $user = auth()->user();

        if ($conversation->type !== 'private') {
            abort(400, 'Use the group delete option for groups.');
        }

        if (!$conversation->users->contains($user->id)) {
            abort(403);
        }

        DB::table('conversation_user')
            ->where('conversation_id', $conversation->id)
            ->where('user_id', $user->id)
            ->update(['deleted_at' => now()]);

        return redirect()->route('chat.index');
    }
}
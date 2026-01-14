<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\Conversation;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ChatController extends Controller
{
    public function index(Conversation $conversation = null) {
        $user = auth()->user();
        
        // Get all conversations for this user
        $conversations = $user->conversations()
            ->with(['users' => function($q) use ($user) {
                $q->where('users.id', '!=', $user->id); // Get other participants
            }])
            ->latest('updated_at')
            ->get();

        $messages = collect();

        if ($conversation) {
            // AUTHORIZATION CHECK
            if (!$conversation->users->contains($user->id)) {
                abort(403);
            }
            
            // Mark as active and get messages
            $messages = $conversation->messages()
                ->with('user')
                ->latest()
                ->take(50)
                ->get()
                ->reverse();
        }

        // For creating groups (Admin only)
        $allUsers = User::where('id', '!=', $user->id)->orderBy('name')->get();

        return view('chat', compact('conversations', 'conversation', 'messages', 'allUsers'));
    }

    public function send(Request $request, Conversation $conversation) {
        // Authorization
        if (!$conversation->users->contains(auth()->id())) {
            abort(403);
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

        // Update conversation timestamp to bump it to top
        $conversation->touch();

        return back();
    }

    public function download(Message $message)
    {
        // Simple auth check: user must be in the conversation of this message
        if (!$message->conversation->users->contains(auth()->id())) {
            abort(403);
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

        // Check for existing private conversation
        // We look for a conversation of type 'private' where both users are participants
        // This query requires a bit of logic: find convs where I am a participant AND the other user is a participant
        
        $conversation = Conversation::where('type', 'private')
            ->whereHas('users', fn($q) => $q->where('users.id', $me->id))
            ->whereHas('users', fn($q) => $q->where('users.id', $user->id))
            ->first();

        if (!$conversation) {
            $conversation = Conversation::create(['type' => 'private']);
            $conversation->users()->attach([$me->id, $user->id]);
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

    public function updateGroup(Request $request, Conversation $conversation)
    {
        if (auth()->user()->role !== 'admin') {
            abort(403, 'Unauthorized');
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'image' => 'nullable|image|max:2048',
        ]);

        $conversation->name = $request->name;

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('conversations/avatars', 'public');
            $conversation->image = $path;
        }

        $conversation->save();

        return redirect()->route('chat.index', $conversation);
    }

    public function destroy(Conversation $conversation)
    {
         // Allow deletion if admin OR participant
         // For now, let's keep it simple: Admins can delete any, Users can delete private ones?
         // User requested "delete chat". If I delete it, it's gone for everyone in this simple model.
         
         $user = auth()->user();
         if ($user->role !== 'admin' && !$conversation->users->contains($user->id)) {
             abort(403);
         }

         // In a real app complexity: "Deleting" for me vs "Deleting" the record.
         // Assuming simple full delete for now as requested.
         
         $conversation->delete(); // Cascading delete? Need pivot cleanup but model events or DB references usually handle it. 
         // Since I stick to Laravel conventions:
         $conversation->users()->detach();
         $conversation->messages()->delete();
         $conversation->delete();

         return redirect()->route('chat.index');
    }
}
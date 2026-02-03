<?php

namespace App\Http\Controllers;

use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MessageController extends Controller
{
    public const DELETED_PLACEHOLDER = 'Cette personne a supprimé ce message';

    public const EDIT_WINDOW_MINUTES = 5;

    public const DELETE_FOR_EVERYONE_WINDOW_MINUTES = 10;

    private function ensureUserInConversation(Message $message): void
    {
        $user = auth()->user();
        if (! $message->conversation->users->contains($user->id)) {
            abort(403, 'Vous n\'êtes pas dans cette conversation.');
        }
    }

    private function canEdit(Message $message): bool
    {
        $user = auth()->user();
        if ($message->user_id !== $user->id) {
            return false;
        }
        $minutesAgo = $message->created_at->diffInMinutes(now(), false);
        return $minutesAgo <= self::EDIT_WINDOW_MINUTES;
    }

    private function canDeleteForEveryone(Message $message): bool
    {
        $user = auth()->user();
        if ($user->role === 'admin') {
            return true;
        }
        if ($message->user_id !== $user->id) {
            return false;
        }
        $minutesAgo = $message->created_at->diffInMinutes(now(), false);
        return $minutesAgo <= self::DELETE_FOR_EVERYONE_WINDOW_MINUTES;
    }

    private function isDeletedForEveryone(Message $message): bool
    {
        return $message->content === self::DELETED_PLACEHOLDER;
    }

    public function update(Request $request, Message $message)
    {
        $this->ensureUserInConversation($message);

        if ($this->isDeletedForEveryone($message)) {
            abort(403, 'Ce message a été supprimé.');
        }
        if (! $this->canEdit($message)) {
            abort(403, 'Vous ne pouvez pas modifier ce message (délai dépassé ou message d\'un autre utilisateur).');
        }

        $request->validate([
            'content' => 'required|string|max:65535',
        ]);

        $message->update([
            'content' => $request->content,
            'edited_at' => now(),
        ]);

        return back();
    }

    public function destroy(Request $request, Message $message)
    {
        $this->ensureUserInConversation($message);

        $user = auth()->user();
        $forEveryone = $request->boolean('for_everyone') || $request->query('for_everyone') === '1' || $request->query('for_everyone') === 'true';

        if ($forEveryone) {
            if (! $this->canDeleteForEveryone($message)) {
                abort(403, 'Vous ne pouvez pas supprimer ce message pour tout le monde (délai dépassé ou message d\'un autre utilisateur).');
            }
            if ($this->isDeletedForEveryone($message)) {
                abort(400, 'Ce message a déjà été supprimé.');
            }
            $message->update([
                'content' => self::DELETED_PLACEHOLDER,
                'attachment' => null,
            ]);
        } else {
            // Delete for me only
            if ($message->user_id !== $user->id && $user->role !== 'admin') {
                abort(403, 'Vous ne pouvez supprimer que vos propres messages pour vous.');
            }
            DB::table('message_user')->updateOrInsert(
                ['message_id' => $message->id, 'user_id' => $user->id],
                ['deleted_at' => now(), 'updated_at' => now(), 'created_at' => now()]
            );
        }

        return back();
    }
}

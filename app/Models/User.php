<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Models\Announcement;
use App\Models\Message;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\DB;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'profile_photo',
        'settings',
        'last_seen',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $appends = ['is_online'];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'last_seen' => 'datetime',
            'password' => 'hashed',
            'settings' => 'array',
        ];
    }

    public function getIsOnlineAttribute(): bool
    {
        if (! $this->last_seen) {
            return false;
        }

        return $this->last_seen->gt(now()->subMinutes(5));
    }
    public function conversations()
    {
        return $this->belongsToMany(Conversation::class, 'conversation_user')
            ->withPivot('last_read_at', 'deleted_at')
            ->using(ConversationUser::class)
            ->wherePivotNull('deleted_at')
            ->withTimestamps();
    }

    /**
     * Announcements the user has explicitly hidden (deleted from their view).
     * Only includes rows where hidden_at is NOT NULL.
     */
    public function hiddenAnnouncements()
    {
        return $this->belongsToMany(Announcement::class, 'announcement_user')
            ->withPivot('hidden_at', 'read_at')
            ->wherePivotNotNull('hidden_at')
            ->withTimestamps();
    }

    /**
     * Announcements the user has read or hidden (pivot: read_at, hidden_at).
     */
    public function announcementUserPivots()
    {
        return $this->belongsToMany(Announcement::class, 'announcement_user')
            ->withPivot('hidden_at', 'read_at')
            ->withTimestamps();
    }

    /**
     * Count unread announcements for the current user.
     * Unread = announcements that exist, are not hidden, and user has not read (no read_at).
     */
    public function unreadAnnouncementsCount(): int
    {
        $hiddenIds = $this->hiddenAnnouncements()->pluck('announcements.id')->toArray();
        $readIds = DB::table('announcement_user')
            ->where('user_id', $this->id)
            ->whereNotNull('read_at')
            ->pluck('announcement_id')
            ->toArray();

        return (int) Announcement::query()
            ->when(!empty($hiddenIds), fn ($q) => $q->whereNotIn('id', $hiddenIds))
            ->whereNotIn('id', $readIds)
            ->count();
    }

    /**
     * Mark announcements as read for the current user.
     */
    public function markAnnouncementsAsRead(array $announcementIds = []): void
    {
        if (empty($announcementIds)) {
            $announcementIds = Announcement::pluck('id')->toArray();
        }
        $now = now();
        foreach ($announcementIds as $id) {
            DB::table('announcement_user')->upsert(
                [
                    ['announcement_id' => $id, 'user_id' => $this->id, 'read_at' => $now, 'created_at' => $now, 'updated_at' => $now],
                ],
                ['announcement_id', 'user_id'],
                ['read_at', 'updated_at']
            );
        }
    }

    /**
     * Get last 5 notifications (unread messages + unread announcements) for Notification Center.
     * Returns array of { type, id, title, link, created_at, conversation_id?, announcement_id? }.
     */
    public function recentNotifications(int $limit = 5): array
    {
        $notifications = [];
        $hiddenIds = $this->hiddenAnnouncements()->pluck('announcements.id')->toArray();
        $readAnnouncementIds = DB::table('announcement_user')
            ->where('user_id', $this->id)
            ->whereNotNull('read_at')
            ->pluck('announcement_id')
            ->toArray();

        // Unread announcements (not hidden, not read)
        $announcements = Announcement::query()
            ->when(!empty($hiddenIds), fn ($q) => $q->whereNotIn('id', $hiddenIds))
            ->whereNotIn('id', $readAnnouncementIds)
            ->latest()
            ->take($limit)
            ->get();

        foreach ($announcements as $a) {
            $notifications[] = [
                'type' => 'announcement',
                'id' => $a->id,
                'announcement_id' => $a->id,
                'title' => $a->title,
                'link' => '/announcements',
                'created_at' => $a->created_at->toIso8601String(),
            ];
        }

        // Unread messages (from others, after last_read_at)
        $remaining = $limit - count($notifications);
        if ($remaining > 0) {
            $unreadMessages = Message::query()
                ->join('conversation_user', 'messages.conversation_id', '=', 'conversation_user.conversation_id')
                ->where('conversation_user.user_id', $this->id)
                ->whereNull('conversation_user.deleted_at')
                ->where('messages.user_id', '!=', $this->id)
                ->where(function ($q) {
                    $q->whereNull('conversation_user.last_read_at')
                        ->orWhereColumn('messages.created_at', '>', 'conversation_user.last_read_at');
                })
                ->select('messages.id', 'messages.content', 'messages.conversation_id', 'messages.user_id', 'messages.created_at')
                ->with(['user:id,name', 'conversation:id,name,type'])
                ->orderByDesc('messages.created_at')
                ->limit($remaining)
                ->get();

            foreach ($unreadMessages as $m) {
                $sender = $m->user?->name ?? 'Utilisateur';
                $preview = $m->content ? (strlen($m->content) > 40 ? substr($m->content, 0, 40) . '…' : $m->content) : '(pièce jointe)';
                $title = $m->conversation?->type === 'group'
                    ? "{$m->conversation->name}: {$sender}"
                    : $sender;
                $notifications[] = [
                    'type' => 'message',
                    'id' => $m->id,
                    'conversation_id' => $m->conversation_id,
                    'title' => $title,
                    'preview' => $preview,
                    'link' => "/chat/{$m->conversation_id}",
                    'created_at' => $m->created_at->toIso8601String(),
                ];
            }
        }

        // Sort by created_at desc and take limit
        usort($notifications, fn ($a, $b) => strcmp($b['created_at'], $a['created_at']));

        return array_slice($notifications, 0, $limit);
    }

    /**
     * Count unread messages for the current user across all conversations.
     * A message is unread if: from another user, and created after last_read_at (or last_read_at is null).
     * Excludes conversations the user has "deleted" (deleted_at set on pivot).
     */
    public function unreadMessagesCount(): int
    {
        return (int) Message::query()
            ->join('conversation_user', 'messages.conversation_id', '=', 'conversation_user.conversation_id')
            ->where('conversation_user.user_id', $this->id)
            ->whereNull('conversation_user.deleted_at')
            ->where('messages.user_id', '!=', $this->id)
            ->where(function ($q) {
                $q->whereNull('conversation_user.last_read_at')
                    ->orWhereColumn('messages.created_at', '>', 'conversation_user.last_read_at');
            })
            ->count();
    }
}

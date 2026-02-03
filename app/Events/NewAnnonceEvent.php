<?php

namespace App\Events;

use App\Models\Announcement;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NewAnnonceEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public Announcement $annonce
    ) {}

    public function broadcastOn(): array
    {
        return [
            new Channel('announcements-channel'),
        ];
    }

    public function broadcastAs(): string
    {
        return 'announcement.created';
    }

    public function broadcastWith(): array
    {
        return [
            'id' => $this->annonce->id,
            'title' => $this->annonce->title,
            'created_at' => $this->annonce->created_at->toIso8601String(),
        ];
    }
}

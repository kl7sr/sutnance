<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $fillable = ['user_id', 'content', 'attachment', 'conversation_id', 'edited_at'];

    protected $casts = [
        'edited_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function conversation()
    {
        return $this->belongsTo(Conversation::class);
    }

    /** Users who have "deleted for me" this message */
    public function deletedByUsers()
    {
        return $this->belongsToMany(User::class, 'message_user')
            ->withPivot('deleted_at')
            ->wherePivotNotNull('deleted_at');
    }
}
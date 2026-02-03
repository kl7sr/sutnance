<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class ConversationUser extends Pivot
{
    protected $casts = [
        'last_read_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];
}

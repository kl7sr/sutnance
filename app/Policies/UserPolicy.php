<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    /**
     * Determine if the user is an admin.
     */
    public function isAdmin(?User $user)
    {
        return $user && $user->role === 'admin';
    }
}

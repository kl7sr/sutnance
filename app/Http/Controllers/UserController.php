<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class UserController extends Controller
{
    use AuthorizesRequests;
    /**
     * Show the form for creating a new user (admin only).
     */
    public function create()
    {
        if (auth()->user()->role !== 'admin') {
            abort(403, 'Unauthorized');
        }
        return view('users.create');
    }

    /**
     * Store a newly created user in storage (admin only).
     */
    public function store(Request $request)
    {
        if (auth()->user()->role !== 'admin') {
            abort(403, 'Unauthorized');
        }
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:user,admin',
            'profile_photo' => 'nullable|image|max:2048',
        ]);

        $data = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
        ];

        if ($request->hasFile('profile_photo')) {
            $path = $request->file('profile_photo')->store('profile_photos', 'public');
            $data['profile_photo'] = $path;
        }

        User::create($data);

        return redirect()->route('dashboard')->with('success', 'Utilisateur créé avec succès!');
    }

    /**
     * Display a listing of all users (admin only).
     */
    public function index()
    {
        if (auth()->user()->role !== 'admin') {
            abort(403, 'Unauthorized');
        }
        $users = User::all();
        return view('users.user-list', compact('users'));
    }

    /**
     * Show the form for editing the specified user (admin only).
     */
    public function edit(User $user)
    {
        if (auth()->user()->role !== 'admin') {
            abort(403, 'Unauthorized');
        }

        return view('users.edit', compact('user'));
    }

    /**
     * Update the specified user in storage (admin only).
     */
    public function update(Request $request, User $user)
    {
        if (auth()->user()->role !== 'admin') {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'role' => 'required|in:user,admin',
            'profile_photo' => 'nullable|image|max:2048',
        ]);

        $user->name = $validated['name'];
        $user->email = $validated['email'];
        $user->role = $validated['role'];

        if ($request->hasFile('profile_photo')) {
            // delete old photo if exists
            if ($user->profile_photo && Storage::disk('public')->exists($user->profile_photo)) {
                Storage::disk('public')->delete($user->profile_photo);
            }
            $path = $request->file('profile_photo')->store('profile_photos', 'public');
            $user->profile_photo = $path;
        }

        $user->save();

        return redirect()->route('users.index')->with('success', 'Utilisateur mis à jour.');
    }

    /**
     * Remove the specified user from storage (admin only).
     */
    public function destroy(User $user)
    {
        if (auth()->user()->role !== 'admin') {
            abort(403, 'Unauthorized');
        }

        // Prevent admin from deleting themselves
        if (auth()->id() === $user->id) {
            return redirect()->route('users.index')->with('error', "Vous ne pouvez pas supprimer votre propre compte.");
        }

        $user->delete();

        return redirect()->route('users.index')->with('success', 'Utilisateur supprimé.');
    }

    public function show(User $user)
    {
        return view('users.show', compact('user'));
    }
}

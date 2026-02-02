<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    /**
     * Display the settings page.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        
        // Get user settings (if stored in JSON column)
        $settings = $user->settings ?? [
            'email_notifications' => true,
            'browser_notifications' => false,
        ];

        return Inertia::render('Settings', [
            'user' => $user,
            'settings' => $settings,
        ]);
    }

    /**
     * Update user profile (name, email, avatar).
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'profile_photo' => 'nullable|image|max:2048',
        ]);

        $user->name = $validated['name'];
        $user->email = $validated['email'];

        // Handle profile photo upload
        if ($request->hasFile('profile_photo')) {
            // Delete old photo if exists
            if ($user->profile_photo && Storage::disk('public')->exists($user->profile_photo)) {
                Storage::disk('public')->delete($user->profile_photo);
            }
            $path = $request->file('profile_photo')->store('profile_photos', 'public');
            $user->profile_photo = $path;
        }

        // Reset email verification if email changed
        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        return back()->with('success', 'Profil mis à jour avec succès!');
    }

    /**
     * Update user password.
     */
    public function updatePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', Password::defaults(), 'confirmed'],
        ]);

        $request->user()->update([
            'password' => Hash::make($validated['password']),
        ]);

        return back()->with('success', 'Mot de passe mis à jour avec succès!');
    }

    /**
     * Update notification preferences.
     */
    public function updateNotifications(Request $request)
    {
        $validated = $request->validate([
            'email_notifications' => 'boolean',
            'browser_notifications' => 'boolean',
        ]);

        $user = $request->user();
        
        // Get existing settings or initialize
        $settings = $user->settings ?? [];
        
        // Update settings
        $settings['email_notifications'] = $validated['email_notifications'] ?? true;
        $settings['browser_notifications'] = $validated['browser_notifications'] ?? false;
        
        // Save to settings column (JSON)
        $user->settings = $settings;
        $user->save();

        return back()->with('success', 'Préférences de notification mises à jour!');
    }
}

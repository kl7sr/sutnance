<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\SettingsController;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Login');
});

Route::get('/dashboard', function () {
    $user = auth()->user();
    $hiddenIds = $user->hiddenAnnouncements()->pluck('announcements.id')->toArray();
    $announcements = \App\Models\Announcement::latest()
        ->when(!empty($hiddenIds), fn ($q) => $q->whereNotIn('id', $hiddenIds))
        ->get();
    $user->markAnnouncementsAsRead($announcements->pluck('id')->toArray());
    return Inertia::render('Dashboard', [
        'announcements' => $announcements,
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'show'])->name('profile.show');
    Route::get('/profile/edit', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    //zine edit annnouncement routs 
    
Route::middleware('auth')->group(function () {
    Route::get('/announcements', [AnnouncementController::class, 'index'])->name('announcements.index');
    Route::post('/announcements/mark-read', [AnnouncementController::class, 'markRead'])->name('announcements.mark_read');
    Route::post('/announcements', [AnnouncementController::class, 'store'])->name('announcements.store');
    Route::delete('/announcements/{announcement}', [AnnouncementController::class, 'destroy'])->name('announcements.destroy');
    Route::get('/announcements/{announcement}/download', [AnnouncementController::class, 'download'])->name('announcements.download');
});

// route controler 
    // Route::get('/announcements', [AnnouncementController::class, 'index'])->name('announcements.index');
    // Route::post('/announcements', [AnnouncementController::class, 'store'])->name('announcements.store');
    // Route::get('/announcements/{announcement}/download', [AnnouncementController::class, 'download'])->name('announcements.download');
    
    Route::get('/chat/unread-count', [ChatController::class, 'unreadCount'])->name('chat.unread_count');
    Route::get('/chat/dm/{user}', [ChatController::class, 'dm'])->name('chat.dm');
    Route::post('/chat/create-group', [ChatController::class, 'createGroup'])->name('chat.create_group');
    Route::post('/chat/group/{conversation}/add-members', [ChatController::class, 'addMembers'])->name('chat.add_members');
    Route::delete('/chat/group/{conversation}/members/{user}', [ChatController::class, 'removeMember'])->name('chat.remove_member');
    Route::put('/chat/group/{conversation}', [ChatController::class, 'updateGroup'])->name('chat.update_group');
    Route::delete('/chat/{conversation}', [ChatController::class, 'destroy'])->name('chat.destroy');
    Route::delete('/chat/{conversation}/leave', [ChatController::class, 'leaveConversation'])->name('chat.leave');
    Route::get('/chat/{conversation?}', [ChatController::class,'index'])->name('chat.index');
    Route::post('/chat/{conversation}', [ChatController::class,'send'])->name('chat.send');
    Route::get('/chat/messages/{message}/download', [ChatController::class, 'download'])->name('chat.download');
    Route::put('/chat/messages/{message}', [MessageController::class, 'update'])->name('messages.update');
    Route::delete('/chat/messages/{message}', [MessageController::class, 'destroy'])->name('messages.destroy');
    
    Route::get('/users/create', [UserController::class, 'create'])->name('users.create');
    Route::post('/users', [UserController::class, 'store'])->name('users.store');
    Route::get('/users/{user}/edit', [UserController::class, 'edit'])->name('users.edit');
    Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
    Route::get('/users', [UserController::class, 'index'])->name('users.index');
    Route::get('/users/{user}', [UserController::class, 'show'])->name('users.show');
    
    Route::get('/settings', [SettingsController::class, 'index'])->name('settings');
    Route::post('/settings/profile', [SettingsController::class, 'updateProfile'])->name('settings.profile');
    Route::post('/settings/password', [SettingsController::class, 'updatePassword'])->name('settings.password');
    Route::post('/settings/notifications', [SettingsController::class, 'updateNotifications'])->name('settings.notifications');
});

require __DIR__.'/auth.php';
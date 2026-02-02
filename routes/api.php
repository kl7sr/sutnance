<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AnnouncementController;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
// routes/api.php

Route::middleware('auth')->group(function () {
    // المسار الذي يجلب البيانات
    Route::get('/announcements', [AnnouncementController::class, 'apiIndex']);
    
    // المسار الذي يقوم بالحذف
    Route::delete('/announcements/{announcement}', [AnnouncementController::class, 'destroy']);
});

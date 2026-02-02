<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Announcement;
use Illuminate\Support\Facades\Storage;

class AnnouncementController extends Controller
{
    public function index()
    {
        $announcements = Announcement::latest()->get();
        return view('announcements', compact('announcements'));
    }

    public function apiIndex()
    {
        $announcements = Announcement::latest()->get();
        return response()->json($announcements);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'attachment' => 'nullable|file|max:10240', // max 10MB
        ]);

        $attachmentPath = null;
        if ($request->hasFile('attachment')) {
            $attachmentPath = $request->file('attachment')->store('announcement_attachments', 'public');
        }

        Announcement::create([
            'title' => $request->title,
            'content' => $request->content,
            'attachment' => $attachmentPath,
        ]);

        return redirect()->route('announcements.index');
    }

    public function download(Announcement $announcement)
    {
        if (! $announcement->attachment) {
            return redirect()->route('announcements.index')->with('error', 'Fichier introuvable.');
        }

        if (! Storage::disk('public')->exists($announcement->attachment)) {
            return redirect()->route('announcements.index')->with('error', 'Fichier introuvable.');
        }

        return Storage::disk('public')->download($announcement->attachment);
    }

public function destroy(Announcement $announcement)
{
    if ($announcement->attachment && \Storage::disk('public')->exists($announcement->attachment)) {
        \Storage::disk('public')->delete($announcement->attachment);
    }

 
    $announcement->delete();

   
    return redirect()->route('announcements.index')->with('success', 'Annonce supprimée avec succès');
}
}

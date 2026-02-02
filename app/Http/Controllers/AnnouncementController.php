<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Announcement;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class AnnouncementController extends Controller
{
    public function index(): Response
    {
        $announcements = Announcement::latest()->get();
        return Inertia::render('AnnonceList', [
            'announcements' => $announcements,
        ]);
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

        // Redirect to dashboard to refresh Inertia props with updated announcements
        return redirect()->route('dashboard');
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
        // Delete the attachment file if it exists
        if ($announcement->attachment && Storage::disk('public')->exists($announcement->attachment)) {
            Storage::disk('public')->delete($announcement->attachment);
        }

        // Delete the announcement record
        $announcement->delete();

        // Return back to refresh Inertia props
        return back()->with('success', 'Annonce supprimée avec succès');
    }
}

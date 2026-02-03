<?php

namespace App\Http\Controllers;

use App\Events\NewAnnonceEvent;
use Illuminate\Http\Request;
use App\Models\Announcement;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class AnnouncementController extends Controller
{
    public function index(): Response
    {
        $user = auth()->user();
        $hiddenIds = $user->hiddenAnnouncements()->pluck('announcements.id')->toArray();
        $announcements = Announcement::latest()
            ->when(!empty($hiddenIds), fn ($q) => $q->whereNotIn('id', $hiddenIds))
            ->get();
        $user->markAnnouncementsAsRead($announcements->pluck('id')->toArray());
        return Inertia::render('AnnonceList', [
            'announcements' => $announcements,
        ]);
    }

    public function markRead()
    {
        auth()->user()->markAnnouncementsAsRead();

        return response()->json(['success' => true]);
    }

    public function apiIndex()
    {
        $user = auth()->user();
        $hiddenIds = $user->hiddenAnnouncements()->pluck('announcements.id')->toArray();
        $announcements = Announcement::latest()
            ->when(!empty($hiddenIds), fn ($q) => $q->whereNotIn('id', $hiddenIds))
            ->get();
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

        $announcement = Announcement::create([
            'title' => $request->title,
            'content' => $request->content,
            'attachment' => $attachmentPath,
        ]);

        broadcast(new NewAnnonceEvent($announcement));

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
        $user = auth()->user();

        if ($user->role === 'admin') {
            // Admin: delete from announcements table so it disappears for everyone
            if ($announcement->attachment && Storage::disk('public')->exists($announcement->attachment)) {
                Storage::disk('public')->delete($announcement->attachment);
            }
            $announcement->delete();
            return back()->with('success', 'Annonce supprimée avec succès');
        }

        // Regular user: hide from their view only (pivot table)
        DB::table('announcement_user')->updateOrInsert(
            ['announcement_id' => $announcement->id, 'user_id' => $user->id],
            ['hidden_at' => now(), 'updated_at' => now(), 'created_at' => now()]
        );

        return back()->with('success', 'Annonce masquée');
    }
}

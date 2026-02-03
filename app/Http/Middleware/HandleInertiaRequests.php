<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        if ($request->user() && $request->is('announcements*')) {
            $request->user()->markAnnouncementsAsRead();
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
                'unread_messages_count' => $request->user()?->unreadMessagesCount() ?? 0,
                'unread_count' => $request->user()?->unreadMessagesCount() ?? 0,
                'unread_announcements_count' => $request->user()?->unreadAnnouncementsCount() ?? 0,
                'has_unread_announcements' => ($request->user()?->unreadAnnouncementsCount() ?? 0) > 0,
                'recent_notifications' => $request->user()?->recentNotifications(5) ?? [],
            ],
            'broadcasting' => [
                'driver' => config('broadcasting.default'),
                'pusher_key' => config('broadcasting.connections.pusher.key'),
                'pusher_cluster' => config('broadcasting.connections.pusher.options.cluster'),
            ],
        ];
    }
}

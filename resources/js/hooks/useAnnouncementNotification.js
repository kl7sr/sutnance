import { useState, useEffect, useCallback } from 'react';
import { usePage, router } from '@inertiajs/react';

/**
 * Hook for real-time announcement notifications via Pusher/Echo.
 * Listens on window.Echo.channel('announcements-channel') for NewAnnonceEvent.
 * Returns hasUnreadAnnonce (persists across refresh until user visits Annonces page).
 *
 * @param {boolean} enabled - Whether the user is logged in
 * @returns {{ hasUnreadAnnonce: boolean, hasNewAnnouncement: boolean, clearNotification: () => void }}
 */
export function useAnnouncementNotification(enabled) {
  const { component, props } = usePage();
  const backendCount = typeof (props?.auth?.unread_announcements_count) === 'number' ? props.auth.unread_announcements_count : 0;
  const [localEchoBonus, setLocalEchoBonus] = useState(0);
  const [hasNewAnnouncement, setHasNewAnnouncement] = useState(false);

  const hasUnreadAnnonce = backendCount + localEchoBonus > 0;

  const clearNotification = useCallback(() => {
    setLocalEchoBonus(0);
  }, []);

  // Clear local bonus when user visits Annonces page (backend marks as read; red dot disappears)
  useEffect(() => {
    if (component?.startsWith('Annonce')) {
      const id = setTimeout(() => setLocalEchoBonus(0), 500);
      return () => clearTimeout(id);
    }
  }, [component]);

  // Listen for explicit mark-read from AnnonceList (route called)
  useEffect(() => {
    const handler = () => setLocalEchoBonus(0);
    window.addEventListener('announcements-marked-read', handler);
    return () => window.removeEventListener('announcements-marked-read', handler);
  }, []);

  // Clear hasNewAnnouncement (toast trigger) when visiting Dashboard or Annonces
  useEffect(() => {
    if (component === 'Dashboard' || component?.startsWith('Annonce')) {
      const id = setTimeout(() => setHasNewAnnouncement(false), 3000);
      return () => clearTimeout(id);
    }
  }, [component]);

  useEffect(() => {
    if (!enabled) return;

    const broadcasting = props?.broadcasting;
    const driver = broadcasting?.driver;
    const pusherKey = broadcasting?.pusher_key;
    if (!pusherKey || (driver !== 'pusher' && driver !== 'reverb')) {
      return;
    }

    const echoRef = { current: null };

    const initEcho = async () => {
      try {
        const Echo = (await import('laravel-echo')).default;
        const Pusher = (await import('pusher-js')).default;
        window.Pusher = Pusher;

        const cluster = broadcasting?.pusher_cluster || 'mt1';

        echoRef.current = new Echo({
          broadcaster: 'pusher',
          key: pusherKey,
          cluster,
          forceTLS: true,
          enabledTransports: ['ws', 'wss'],
        });

        window.Echo = echoRef.current;

        window.Echo.channel('announcements-channel').listen('.announcement.created', () => {
          setLocalEchoBonus((prev) => prev + 1);
          setHasNewAnnouncement(true);
          router.reload({ preserveScroll: true });
        });
      } catch (e) {
        console.warn('Echo/Pusher not available:', e);
      }
    };

    initEcho();

    return () => {
      if (echoRef.current) {
        try {
          echoRef.current.leave('announcements-channel');
        } catch (_) {}
      }
      if (window.Echo === echoRef.current) {
        delete window.Echo;
      }
    };
  }, [enabled, props?.broadcasting]);

  return { hasUnreadAnnonce, hasNewAnnouncement, clearNotification };
}

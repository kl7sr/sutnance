import { useState, useEffect, useRef, useCallback } from 'react';
import { router } from '@inertiajs/react';

const POLL_INTERVAL_MS = 15000; // 15 seconds (default)
const CHAT_PAGE_POLL_MS = 4000; // 4 seconds when on chat page for near real-time badge updates

/**
 * Show browser notification if permission granted (visual only, no sound)
 */
function showBrowserNotification(count, title = 'Nouveau message') {
  if (!('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;

  const body = count === 1
    ? 'Vous avez reçu un nouveau message'
    : `Vous avez ${count} nouveaux messages`;

  try {
    const n = new Notification(title, {
      body,
      icon: '/favicon.ico',
      tag: 'chat-unread',
      requireInteraction: false,
    });
    n.onclick = () => {
      window.focus();
      router.visit('/chat');
      n.close();
    };
  } catch (e) {
    console.warn('Could not show browser notification:', e);
  }
}

/**
 * Hook for notification bell: polls unread count, plays sound and shows
 * browser notification when count increases.
 *
 * @param {boolean} enabled - Whether polling is enabled (e.g. user is logged in)
 * @param {number} initialCount - Initial count from server (auth.unread_messages_count)
 * @returns {{ count: number, requestPermission: () => Promise<boolean> }}
 */
export function useNotificationBell(enabled, initialCount = 0) {
  const [count, setCount] = useState(initialCount);
  const prevCountRef = useRef(initialCount);

  // Sync with server-provided count on navigation
  useEffect(() => {
    setCount(initialCount);
    prevCountRef.current = initialCount;
  }, [initialCount]);

  const fetchCount = useCallback(async () => {
    if (!enabled) return;
    try {
      const res = await fetch('/chat/unread-count', {
        headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
        credentials: 'same-origin',
      });
      if (!res.ok) return;
      const { count: newCount } = await res.json();
      const prevCount = prevCountRef.current;
      setCount(newCount);

      const isOnChatPage = window.location.pathname.startsWith('/chat');

      // When count increases: show notification if NOT on chat, or refresh chat if ON chat (update per-conversation badges)
      if (newCount > prevCount) {
        if (!isOnChatPage) {
          showBrowserNotification(newCount);
        } else {
          // On chat page: refresh to show red badge on conversations immediately
          router.reload({ preserveScroll: true });
        }
      }
      prevCountRef.current = newCount;
    } catch (e) {
      // Silently ignore fetch errors (e.g. network offline)
    }
  }, [enabled]);

  // Poll when tab is visible (faster on chat page for near real-time badge updates)
  useEffect(() => {
    if (!enabled) return;

    const isOnChatPage = () => window.location.pathname.startsWith('/chat');
    const poll = () => {
      if (document.visibilityState === 'visible') {
        fetchCount();
      }
    };

    poll(); // Initial fetch
    const interval = isOnChatPage() ? CHAT_PAGE_POLL_MS : POLL_INTERVAL_MS;
    const id = setInterval(poll, interval);
    return () => clearInterval(id);
  }, [enabled, fetchCount]);

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) return false;
    if (Notification.permission === 'granted') return true;
    if (Notification.permission === 'denied') return false;
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }, []);

  return { count, requestPermission };
}

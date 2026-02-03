import { useState, useRef, useEffect } from 'react';
import { usePage, Link, router } from '@inertiajs/react';
import { MessageSquare, Megaphone } from 'lucide-react';
import axios from 'axios';

function Header({ requestPermission = async () => false, hasUnreadAnnonce = false, unreadCount = 0 }) {
  const { props } = usePage();
  const { auth } = props;
  const user = auth?.user;
  const notifications = auth?.recent_notifications ?? [];
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const messagesCount = typeof unreadCount === 'number' ? unreadCount : 0;
  const showRedDot = messagesCount > 0 || hasUnreadAnnonce;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleBellClick = (e) => {
    e.stopPropagation();
    if ('Notification' in window && Notification.permission === 'default') {
      requestPermission();
    }
    setDropdownOpen((prev) => !prev);
  };

  const handleNotificationClick = async (notification) => {
    setDropdownOpen(false);
    if (notification.type === 'announcement') {
      const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      await axios.post('/announcements/mark-read', {}, {
        headers: { 'X-CSRF-TOKEN': token, 'Accept': 'application/json' },
      }).catch(() => {});
      window.dispatchEvent(new CustomEvent('announcements-marked-read'));
    }
    router.visit(notification.link);
  };

  return (
    <header className="bg-white border-b-2 border-[#003366] shadow-sm sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Left Section - Title */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block w-1.5 h-10 bg-[#8CC63F] rounded-full"></div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#003366] tracking-tight font-sans">
                SEAAL Workspace
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block font-sans">
                Gestion et communication
              </p>
            </div>
          </div>

          {/* Right Section - User Info & Actions */}
          <div className="flex items-center gap-4">
            {/* Notification Bell - dropdown (no redirect to /chat) */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={handleBellClick}
                className="p-2 rounded-xl text-gray-600 hover:bg-[#F4F7F9] transition-colors inline-flex"
                title="Centre de notifications"
              >
                <span className="relative inline-block">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {showRedDot && (
                    <span className="red-dot absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white" />
                  )}
                </span>
              </button>

              {/* Notification Center Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white rounded-xl shadow-xl border-2 border-gray-100 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <h3 className="font-semibold text-seaal-dark text-sm">Centre de notifications</h3>
                  </div>
                  {notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center text-gray-500 text-sm">
                      Aucune notification
                    </div>
                  ) : (
                    <>
                    <ul className="py-1">
                      {notifications.map((n) => (
                        <li key={`${n.type}-${n.id}`}>
                          <button
                            type="button"
                            onClick={() => handleNotificationClick(n)}
                            className="w-full px-4 py-3 flex items-start gap-3 hover:bg-gray-50 text-left transition-colors"
                          >
                            {n.type === 'message' ? (
                              <MessageSquare size={18} className="text-seaal-dark shrink-0 mt-0.5" />
                            ) : (
                              <Megaphone size={18} className="text-seaal-green shrink-0 mt-0.5" />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{n.title}</p>
                              {n.preview && (
                                <p className="text-xs text-gray-500 truncate mt-0.5">{n.preview}</p>
                              )}
                              <p className="text-xs text-gray-400 mt-1">
                                {new Date(n.created_at).toLocaleDateString('fr-FR', {
                                  day: 'numeric',
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </p>
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                    <div className="border-t border-gray-100 px-4 py-2">
                      <Link
                        href="/chat"
                        className="text-sm font-medium text-seaal-dark hover:text-seaal-light transition-colors"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Voir les messages →
                      </Link>
                      <span className="mx-2 text-gray-300">|</span>
                      <Link
                        href="/announcements"
                        className="text-sm font-medium text-seaal-dark hover:text-seaal-light transition-colors"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Voir les annonces →
                      </Link>
                    </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-3 pl-4 border-l border-gray-100">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-[#003366] font-sans">{user?.name || 'Utilisateur'}</p>
                <p className="text-xs text-gray-500 font-sans">{user?.email || ''}</p>
              </div>
              {user?.profile_photo ? (
                <img 
                  src={`/storage/${user.profile_photo}`} 
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-md"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#8CC63F] flex items-center justify-center text-white font-bold shadow-md ring-2 ring-white">
                  <span className="text-sm">{user?.name?.charAt(0) || 'U'}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;

import React, { useState, useMemo, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
  LayoutDashboard,
  Users,
  Megaphone,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  UserCircle,
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { safeRoute } from '../../utils/routeHelper';

export default function Sidebar({ user, collapsed: collapsedProp, onCollapseToggle, unreadCount = 0, hasUnreadAnnonce = false }) {
  const { component, props } = usePage();
  const initialHasUnread = !!props?.auth?.has_unread_announcements;
  const [hasNewAnnouncement, setHasNewAnnouncement] = useState(initialHasUnread);
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const collapsed = collapsedProp !== undefined ? collapsedProp : internalCollapsed;
  const [mobileOpen, setMobileOpen] = useState(false);

  // Sync hasNewAnnouncement from props when they change
  useEffect(() => {
    setHasNewAnnouncement(!!props?.auth?.has_unread_announcements);
  }, [props?.auth?.has_unread_announcements]);

  // Clear when announcements marked read (from AnnonceList)
  useEffect(() => {
    const handler = () => setHasNewAnnouncement(false);
    window.addEventListener('announcements-marked-read', handler);
    return () => window.removeEventListener('announcements-marked-read', handler);
  }, []);

  const showAnnouncementBadge = hasNewAnnouncement || hasUnreadAnnonce;

  // Safe route helper function
  const getRoute = (routeName, fallback) => {
    try {
      // Check if Ziggy is available
      if (typeof window.Ziggy !== 'undefined' && typeof window.route === 'function') {
        try {
          // Try to get the route
          const routePath = window.route(routeName);
          return routePath;
        } catch (e) {
          // Route doesn't exist, use fallback
          console.warn(`Route "${routeName}" not found, using fallback:`, fallback);
          return fallback || `/${routeName.replace(/\./g, '/')}`;
        }
      }
      // Ziggy not loaded yet, use fallback
      return fallback || `/${routeName.replace(/\./g, '/')}`;
    } catch (error) {
      console.warn(`Route "${routeName}" error:`, error);
      return fallback || `/${routeName.replace(/\./g, '/')}`;
    }
  };

  // Links configuration with safe routing - hide 'Utilisateurs' for non-admin (user) role
  const isAdmin = user?.role === 'admin';
  const links = useMemo(() => {
    const baseLinks = [
      {
        name: 'Tableau de bord',
        href: getRoute('dashboard', '/dashboard'),
        icon: LayoutDashboard,
        active: component === 'Dashboard',
      },
      ...(isAdmin ? [{
        name: 'Utilisateurs',
        href: getRoute('users.index', '/users'),
        icon: Users,
        active: component.startsWith('User')
      }] : []),
      {
        name: 'Annonces',
        href: getRoute('announcements.index', '/announcements'),
        icon: Megaphone,
        active: component.startsWith('Annonce'),
        badge: hasUnreadAnnonce,
      },
      {
        name: 'Chat',
        href: getRoute('chat.index', '/chat'),
        icon: MessageSquare,
        active: component.startsWith('Chat')
      },
      {
        name: 'Paramètres',
        href: getRoute('settings', '/settings'),
        icon: Settings,
        active: component === 'Settings'
      },
    ];
    return baseLinks;
  }, [component, isAdmin, showAnnouncementBadge]);

  const toggleCollapse = () => (onCollapseToggle ? onCollapseToggle() : setInternalCollapsed((c) => !c));
  const toggleMobile = () => setMobileOpen(!mobileOpen);

  const sidebarWidth = collapsed ? 'w-20' : 'w-72';

  return (
    <>
      {/* Mobile Menu Button - Fixed on top right for mobile access */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <button
          onClick={toggleMobile}
          className="p-2 rounded-lg bg-white shadow-lg text-[#003366] hover:bg-gray-50 transition-colors"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <motion.aside
        className={`sidebar fixed top-0 left-0 h-screen bg-[#003366] text-white z-40 shadow-xl transition-all duration-300 ease-in-out
                    ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                    ${sidebarWidth}
                    flex flex-col
                `}
        style={{ backgroundColor: '#003366' }}
      >
        {/* Header / Logo */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-white/10">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-bold text-2xl tracking-tight text-white"
            >
              SEAAL<span className="text-[#00AEEF]">App</span>
            </motion.div>
          )}
          {collapsed && (
            <div className="font-bold text-xl text-center w-full text-[#00AEEF]">S</div>
          )}

          {/* Desktop Collapse Toggle */}
          <button
            onClick={toggleCollapse}
            className="hidden md:flex p-1.5 rounded-full hover:bg-white/10 text-gray-300 hover:text-white transition-colors absolute -right-3 top-8 bg-[#003366] border border-white/20 shadow-md"
            style={{ backgroundColor: '#003366' }}
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="sidebar flex-1 overflow-y-auto py-6 px-3 space-y-2">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative
                                ${link.active
                  ? 'bg-[#00AEEF]/15 text-white font-medium border-l-4 border-[#8CC63F] shadow-lg'
                  : 'text-gray-300 hover:bg-white/10 hover:text-white hover:border-l-4 hover:border-[#00AEEF]/50'
                }
                            `}
            >
              <span className="relative shrink-0">
                <link.icon size={22} className={`${link.active ? 'text-white' : 'text-gray-400 group-hover:text-white transition-colors'}`} />
                {/* Red badge for unread messages on Chat link */}
                {link.name === 'Chat' && unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
                {/* Red dot for unread announcements (Annonces only; persists until user visits Annonces page) */}
                {link.badge && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full" title="Nouvelle annonce" />
                )}
              </span>

              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="whitespace-nowrap"
                >
                  {link.name}
                </motion.span>
              )}

              {/* Tooltip for collapsed state */}
              {collapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
                  {link.name}
                </div>
              )}
            </Link>
          ))}
        </nav>

        {/* User Profile & Logout */}
        <div className="border-t border-white/10 p-4 bg-black/20">
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
            <div className="w-10 h-10 rounded-full bg-[#00AEEF]/20 flex items-center justify-center shrink-0 border-2 border-[#00AEEF]">
              {user?.profile_photo ? (
                <img src={`/storage/${user.profile_photo}`} alt={user.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                <UserCircle size={24} className="text-[#00AEEF]" />
              )}
            </div>

            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user?.name || 'Utilisateur'}</p>
                <p className="text-xs text-gray-400 truncate">{user?.email || 'email@example.com'}</p>
              </div>
            )}

            {!collapsed && (
              <Link
                href={getRoute('logout', '/logout')}
                method="post"
                as="button"
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <LogOut size={20} />
              </Link>
            )}
          </div>

          {/* Collapsed Logout separate button */}
          {collapsed && (
            <div className="mt-4 flex justify-center">
              <Link
                href={getRoute('logout', '/logout')}
                method="post"
                as="button"
                className="p-2 text-gray-400 hover:text-red-400 hover:bg-white/10 rounded-lg transition-colors"
              >
                <LogOut size={20} />
              </Link>
            </div>
          )}
        </div>
      </motion.aside>
    </>
  );
}

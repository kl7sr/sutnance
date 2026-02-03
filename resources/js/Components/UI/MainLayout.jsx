import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePage } from '@inertiajs/react';
import { useNotificationBell } from '../../hooks/useNotificationBell';
import { useAnnouncementNotification } from '../../hooks/useAnnouncementNotification';
import Sidebar from './Sidebar';
import Header from './Header';

export default function MainLayout({ children }) {
    const { props } = usePage();
    const { auth } = props;
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [showAnnouncementToast, setShowAnnouncementToast] = useState(false);
    const initialCount = auth?.unread_messages_count ?? 0;
    const { count: unreadCount, requestPermission } = useNotificationBell(!!auth?.user, initialCount);
    const { hasUnreadAnnonce, hasNewAnnouncement } = useAnnouncementNotification(!!auth?.user);

    useEffect(() => {
        if (hasNewAnnouncement) {
            setShowAnnouncementToast(true);
            const id = setTimeout(() => setShowAnnouncementToast(false), 4000);
            return () => clearTimeout(id);
        }
    }, [hasNewAnnouncement]);

    return (
        <div className="min-h-screen bg-[#F3F4F6] font-sans flex text-gray-800">
            {/* Toast: NewAnnonceEvent - Un nouvel annonce a été publié */}
            <AnimatePresence>
                {showAnnouncementToast && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed top-4 right-4 z-50 px-4 py-3 bg-seaal-green text-white rounded-xl shadow-lg font-medium text-sm max-w-sm"
                    >
                        Un nouvel annonce a été publié
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Sidebar - handles its own mobile state internally */}
            <Sidebar user={auth?.user} collapsed={sidebarCollapsed} onCollapseToggle={() => setSidebarCollapsed(!sidebarCollapsed)} unreadCount={unreadCount} hasUnreadAnnonce={hasUnreadAnnonce} />

            {/* Main Content Area - margin syncs with Sidebar state: collapsed=80px, expanded=260px, mobile=0 */}
            <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out min-h-screen ${sidebarCollapsed ? 'md:ml-[80px]' : 'md:ml-[260px]'}`}>
                {/* Header */}
                <Header requestPermission={requestPermission} hasUnreadAnnonce={hasUnreadAnnonce} unreadCount={unreadCount} />

                {/* Content - White card-like container */}
                <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

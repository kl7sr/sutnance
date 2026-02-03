import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePage } from '@inertiajs/react';
import MainLayout from '../Components/UI/MainLayout';
import AnnonceList from './AnnonceList';
import AnnonceCreate from './AnnonceCreate';
import { useAnnouncementNotification } from '../hooks/useAnnouncementNotification';
import { Megaphone } from 'lucide-react';

function Dashboard({ announcements: announcementsProp }) {
  const { props } = usePage();
  const isAdmin = props?.auth?.user?.role === 'admin';
  const announcements = announcementsProp || props.announcements || [];

  // Debug: log backend data when announcements is empty to verify what's being sent
  if (announcements.length === 0 || announcementsProp === undefined) {
    console.log('[Dashboard] props.announcements:', props?.announcements);
    console.log('[Dashboard] announcementsProp:', announcementsProp);
    console.log('[Dashboard] announcements:', announcements);
  }
  const { hasNewAnnouncement } = useAnnouncementNotification(!!props?.auth?.user);

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-10"
      >
        {/* New Announcement Notification Banner */}
        <AnimatePresence>
          {hasNewAnnouncement && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-3 px-4 py-3 bg-seaal-green/10 border border-seaal-green/30 rounded-xl text-seaal-dark font-medium"
            >
              <Megaphone size={22} className="text-seaal-green shrink-0" />
              <span>Nouvelle annonce publiée !</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Page Header - Clean Typography */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-seaal-dark mb-3 tracking-tight leading-tight">
            Tableau de bord
          </h1>
          <p className="text-lg text-gray-600 tracking-wide leading-relaxed">
            Bienvenue sur votre espace de travail SEAAL
          </p>
        </div>

        {/* Create Announcement Section - admin only */}
        {isAdmin && <AnnonceCreate />}

        {/* Announcements List - embedded: no MainLayout (already provided by Dashboard) */}
        <AnnonceList announcements={announcements} embedded />
      </motion.div>
    </MainLayout>
  );
}

export default Dashboard;

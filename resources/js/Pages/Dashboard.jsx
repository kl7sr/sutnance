import React from 'react';
import { motion } from 'framer-motion';
import { usePage } from '@inertiajs/react';
import MainLayout from '../Components/UI/MainLayout';
import AnnonceList from './AnnonceList';
import AnnonceCreate from './AnnonceCreate';

function Dashboard({ announcements: announcementsProp }) {
  const { props } = usePage();
  // Get announcements from prop or from usePage props
  const announcements = announcementsProp || props.announcements || [];

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-10"
      >
        {/* Page Header - Clean Typography */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-seaal-dark mb-3 tracking-tight leading-tight">
            Tableau de bord
          </h1>
          <p className="text-lg text-gray-600 tracking-wide leading-relaxed">
            Bienvenue sur votre espace de travail SEAAL
          </p>
        </div>

        {/* Create Announcement Section */}
        <AnnonceCreate />

        {/* Announcements List */}
        <AnnonceList announcements={announcements} />
      </motion.div>
    </MainLayout>
  );
}

export default Dashboard;

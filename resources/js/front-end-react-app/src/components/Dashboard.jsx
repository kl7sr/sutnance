import React from 'react';
import { motion } from 'framer-motion';
import Layout from './Layout';
import AnnonceList from './AnnonceList';
import AnnonceCreate from './AnnonceCreate';

function Dashboard() {
  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-10"
      >
        {/* Page Header - Clean Typography */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#003366] mb-3" style={{ fontFamily: 'Inter, system-ui, sans-serif', lineHeight: '1.3', letterSpacing: '-0.02em' }}>
            Tableau de bord
          </h1>
          <p className="text-lg text-gray-600" style={{ fontFamily: 'Inter, system-ui, sans-serif', lineHeight: '1.6', letterSpacing: '0.01em' }}>
            Bienvenue sur votre espace de travail SEAAL
          </p>
        </div>

        {/* Create Announcement Section */}
        <AnnonceCreate />

        {/* Announcements List */}
        <AnnonceList />
      </motion.div>
    </Layout>
  );
}

export default Dashboard;

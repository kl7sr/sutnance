import React, { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnnonceListSkeleton } from '../Components/Skeleton';

function AnnonceList({ announcements: announcementsProp }) {
  const { props } = usePage();
  // Get announcements from props (passed from controller) or from prop
  const list = announcementsProp || props.announcements || [];
  const [loading, setLoading] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  const handleDelete = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) {
      setLoading(true);
      router.delete(`/announcements/${id}`, {
        onSuccess: () => {
          setLoading(false);
        },
        onError: (errors) => {
          setLoading(false);
          alert('Erreur lors de la suppression');
          console.error(errors);
        }
      });
    }
  };

  const handleDownload = (id) => {
    window.open(`/announcements/${id}/download`, '_blank');
  };

  // Loading state with skeleton
  if (loading && list.length === 0) {
    return (
      <div className="w-full">
        <h2
          className="text-4xl font-bold text-[#003366] mb-10"
          style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            letterSpacing: '-0.02em',
            lineHeight: '1.3'
          }}
        >
          Liste des Annonces
        </h2>
        <AnnonceListSkeleton count={6} />
      </div>
    );
  }

  // Animation variants for entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 30
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.6, -0.05, 0.01, 0.99]
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full"
      style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
    >
      {/* Header */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-4xl font-bold text-[#003366] mb-10"
        style={{
          letterSpacing: '-0.02em',
          lineHeight: '1.3'
        }}
      >
        Liste des Annonces
      </motion.h2>

      {list.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-16 text-center bg-white/80 backdrop-blur-md rounded-3xl border-2 border-dashed border-gray-300 shadow-lg"
        >
          <p
            className="text-gray-600 font-medium text-lg"
            style={{
              lineHeight: '1.6'
            }}
          >
            Aucune annonce pour le moment.
          </p>
        </motion.div>
      ) : (
        /* Masonry Grid Layout */
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          <AnimatePresence>
            {list.map((annonce, index) => (
              <motion.div
                key={annonce.id}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="break-inside-avoid mb-6 group relative"
                onMouseEnter={() => setHoveredCard(annonce.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Glassmorphism Card */}
                <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/40 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 hover:bg-white/90">
                  {/* Left Gradient Accent */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-3xl bg-gradient-to-b from-seaal-dark to-seaal-light shadow-[0_0_20px_rgba(0,174,239,0.4)]"
                  />

                  {/* Date Badge - Top Right */}
                  <div className="absolute top-4 right-4 z-10">
                    <span
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100/80 backdrop-blur-sm text-gray-700 rounded-full text-xs font-medium shadow-sm font-sans"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(annonce.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short'
                      })}
                    </span>
                  </div>

                  {/* Card Content */}
                  <div className="ml-3 pr-16">
                    {/* Title */}
                    <h3
                      className="text-xl font-bold text-seaal-dark mb-4 group-hover:text-seaal-light transition-colors duration-300 pr-8 leading-relaxed tracking-tight"
                    >
                      {annonce.title}
                    </h3>

                    {/* Content */}
                    <p
                      className="text-gray-700 text-sm mb-6 leading-relaxed tracking-wide"
                    >
                      {annonce.content}
                    </p>
                  </div>

                  {/* FAB Download Button - Bottom Right with Blue Glow */}
                  {annonce.attachment && (
                    <motion.button
                      onClick={() => handleDownload(annonce.id)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className={`absolute bottom-6 right-6 w-14 h-14 bg-seaal-light text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:shadow-2xl z-10
                        ${hoveredCard === annonce.id ? 'shadow-[0_0_20px_rgba(0,174,239,0.6),0_4px_12px_rgba(0,174,239,0.4)]' : 'shadow-[0_4px_12px_rgba(0,174,239,0.3)]'}
                      `}
                      title="Télécharger"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </motion.button>
                  )}

                  {/* Delete Button - Top Right (only on hover) */}
                  <motion.button
                    onClick={() => handleDelete(annonce.id)}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: hoveredCard === annonce.id ? 1 : 0,
                      scale: hoveredCard === annonce.id ? 1 : 0
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute top-4 right-16 w-10 h-10 bg-red-500/90 backdrop-blur-sm text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:bg-red-600 z-10"
                    title="Supprimer"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}

export default AnnonceList;

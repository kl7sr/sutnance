import React, { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';

function UserList({ users: initialUsers }) {
  const { props } = usePage();
  const usersData = initialUsers || props.users || [];
  const [searchQuery, setSearchQuery] = useState('');

  // Filter users based on search query
  const filteredUsers = usersData.filter(user => {
    const query = searchQuery.toLowerCase();
    return (
      user.name?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query) ||
      user.role?.toLowerCase().includes(query)
    );
  });

  const handleDelete = (userId, userName) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${userName || 'cet utilisateur'} ?`)) {
      router.delete(`/users/${userId}`, {
        onError: (errors) => {
          alert('Erreur lors de la suppression');
          console.error(errors);
        }
      });
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Generate random background color based on user ID for consistency
  const getAvatarColor = (userId) => {
    const colors = [
      'from-[#003366] to-[#00AEEF]',
      'from-[#8CC63F] to-[#7AB82E]',
      'from-[#00AEEF] to-[#003366]',
      'from-purple-500 to-pink-500',
      'from-blue-500 to-cyan-500',
      'from-green-500 to-emerald-500',
      'from-orange-500 to-red-500',
      'from-indigo-500 to-purple-500',
    ];
    return colors[userId % colors.length];
  };

  const getAvatarUrl = (user) => {
    if (user.profile_photo) {
      return user.profile_photo.startsWith('http') 
        ? user.profile_photo 
        : `/storage/${user.profile_photo}`;
    }
    return null;
  };

  // Determine user status (for demo, you can add actual status logic)
  const getUserStatus = (user) => {
    // You can implement actual status logic here
    // For now, randomly assign or use a default
    return Math.random() > 0.5 ? 'active' : 'online';
  };

  // Animation variants with stagger effect
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  };

  const rowVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.6, -0.05, 0.01, 0.99]
      }
    },
    exit: {
      opacity: 0,
      x: -20,
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full bg-white rounded-3xl shadow-lg overflow-hidden"
      style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
    >
      {/* Header with Search Bar */}
      <div className="sticky top-0 z-10 bg-white border-b-2 border-[#003366]/10 px-8 py-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h2 
              className="text-4xl font-bold text-[#003366] mb-2"
              style={{ 
                fontFamily: 'Inter, system-ui, sans-serif',
                letterSpacing: '-0.02em',
                lineHeight: '1.3'
              }}
            >
              Liste des Utilisateurs
            </h2>
            <p 
              className="text-sm text-gray-600"
              style={{ 
                fontFamily: 'Inter, system-ui, sans-serif',
                lineHeight: '1.6'
              }}
            >
              {filteredUsers.length} utilisateur{filteredUsers.length !== 1 ? 's' : ''} trouvé{filteredUsers.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            {/* Search Bar with Magnifying Glass */}
            <div className="relative flex-1 sm:max-w-md">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher par nom, email ou rôle..."
                className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-[#00AEEF] focus:ring-4 focus:ring-[#00AEEF]/20 outline-none transition-all duration-300 bg-gray-50 focus:bg-white shadow-sm"
                style={{ 
                  fontFamily: 'Inter, system-ui, sans-serif',
                  lineHeight: '1.6'
                }}
              />
            </div>

            {/* Add User Button - SEAAL Green */}
            <a
              href="/users/create"
              className="px-8 py-3.5 bg-[#8CC63F] text-white rounded-xl font-semibold hover:bg-[#7AB82E] hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap shadow-lg"
              style={{ 
                fontFamily: 'Inter, system-ui, sans-serif',
                lineHeight: '1.6'
              }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Ajouter Utilisateur
            </a>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Sticky Table Header - SEAAL Deep Blue */}
          <thead className="bg-[#003366] sticky top-[120px] z-10">
            <tr>
              <th className="px-8 py-4 text-left text-xs font-bold text-white uppercase tracking-wider" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                Utilisateur
              </th>
              <th className="px-8 py-4 text-left text-xs font-bold text-white uppercase tracking-wider" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                Email
              </th>
              <th className="px-8 py-4 text-left text-xs font-bold text-white uppercase tracking-wider" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                Rôle
              </th>
              <th className="px-8 py-4 text-left text-xs font-bold text-white uppercase tracking-wider" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                Statut
              </th>
              <th className="px-8 py-4 text-right text-xs font-bold text-white uppercase tracking-wider" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                Actions
              </th>
            </tr>
          </thead>
          
          {/* Table Body */}
          <tbody className="bg-white divide-y divide-gray-100">
            <AnimatePresence mode="wait">
              {filteredUsers.length === 0 ? (
                <motion.tr
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <td colSpan="5" className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <svg className="w-20 h-20 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <p 
                        className="text-gray-500 font-medium text-lg"
                        style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                      >
                        {searchQuery ? 'Aucun utilisateur trouvé' : 'Aucun utilisateur'}
                      </p>
                    </div>
                  </td>
                </motion.tr>
              ) : (
                filteredUsers.map((user, index) => {
                  const status = getUserStatus(user);
                  return (
                    <motion.tr
                      key={user.id}
                      variants={rowVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="hover:bg-gray-50/80 transition-colors duration-200 border-b border-gray-100"
                    >
                      {/* User Avatar & Name */}
                      <td className="px-8 py-5 whitespace-nowrap">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            {getAvatarUrl(user) ? (
                              <img
                                src={getAvatarUrl(user)}
                                alt={user.name}
                                className="w-14 h-14 rounded-full object-cover border-3 border-gray-200 shadow-sm"
                              />
                            ) : (
                              <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${getAvatarColor(user.id)} flex items-center justify-center text-white font-bold text-base border-3 border-gray-200 shadow-sm`}>
                                {getInitials(user.name)}
                              </div>
                            )}
                          </div>
                          <div>
                            <div 
                              className="text-sm font-semibold text-gray-900 mb-1"
                              style={{ 
                                fontFamily: 'Inter, system-ui, sans-serif',
                                lineHeight: '1.5'
                              }}
                            >
                              {user.name || 'N/A'}
                            </div>
                            <div 
                              className="text-xs text-gray-500"
                              style={{ 
                                fontFamily: 'Inter, system-ui, sans-serif',
                                lineHeight: '1.4'
                              }}
                            >
                              ID: {user.id}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-8 py-5 whitespace-nowrap">
                        <div 
                          className="text-sm text-gray-900"
                          style={{ 
                            fontFamily: 'Inter, system-ui, sans-serif',
                            lineHeight: '1.6'
                          }}
                        >
                          {user.email || 'N/A'}
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="px-8 py-5 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold ${
                            user.role === 'admin'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                        >
                          {user.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                        </span>
                      </td>

                      {/* Status Badge with Glow */}
                      <td className="px-8 py-5 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold ${
                            status === 'active'
                              ? 'bg-green-100 text-green-700 shadow-[0_0_8px_rgba(34,197,94,0.3)]'
                              : 'bg-blue-100 text-blue-700 shadow-[0_0_8px_rgba(59,130,246,0.3)]'
                          }`}
                          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                        >
                          <span className={`w-2 h-2 rounded-full ${
                            status === 'active' ? 'bg-green-500' : 'bg-blue-500'
                          } animate-pulse`}></span>
                          {status === 'active' ? 'Actif' : 'En ligne'}
                        </span>
                      </td>

                      {/* Actions - Direct Trash Icon */}
                      <td className="px-8 py-5 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-3">
                          <a
                            href={`/users/${user.id}/edit`}
                            className="p-2 text-gray-400 hover:text-[#00AEEF] hover:bg-blue-50 rounded-lg transition-all duration-200"
                            title="Modifier"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </a>
                          <button
                            onClick={() => handleDelete(user.id, user.name)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
                            title="Supprimer"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

    </motion.div>
  );
}

export default UserList;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

function ProfileShow() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get('/api/user', {
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        withCredentials: true
      });
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Fallback data
      setUser({
        name: 'User Name',
        email: 'user@example.com',
        role: 'user',
        profile_photo: null
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-full bg-seaal-gray flex items-center justify-center font-sans">
          <div className="text-seaal-dark">Chargement...</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="min-h-full bg-seaal-gray flex items-center justify-center px-4 py-12 font-sans"
      >
        <div className="w-full max-w-md">
          {/* Identity Card - Clean White Background */}
          <div className="bg-white rounded-3xl shadow-sm p-8">
            {/* Profile Header with Avatar */}
            <div className="text-center mb-8">
              {/* Circular Avatar with seaal-dark Border */}
              <div className="flex justify-center mb-5">
                {user?.profile_photo ? (
                  <div className="relative">
                    <img
                      src={user.profile_photo}
                      alt={user.name}
                      className="w-24 h-24 rounded-full object-cover border-4 border-seaal-dark"
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-full bg-seaal-green flex items-center justify-center text-white text-3xl font-bold border-4 border-seaal-dark">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
              </div>
              <h1 className="text-2xl font-bold text-seaal-dark mb-2 font-sans">
                {user?.name || 'Utilisateur'}
              </h1>
              <p className="text-sm text-gray-500 font-sans">
                {user?.role === 'admin' ? 'Administrateur' : 'Employé SEAAL'}
              </p>
            </div>

            {/* Profile Information Rows - Clean Layout */}
            <div className="space-y-4 mb-8">
              {/* Name Row */}
              <div className="flex items-center gap-3 py-2">
                <div className="flex-shrink-0 w-5 h-5 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 mb-1 font-sans">
                    Nom
                  </p>
                  <p className="text-sm text-gray-900 truncate font-sans">
                    {user?.name || 'Non défini'}
                  </p>
                </div>
              </div>

              {/* Email Row */}
              <div className="flex items-center gap-3 py-2">
                <div className="flex-shrink-0 w-5 h-5 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 mb-1 font-sans">
                    E-mail
                  </p>
                  <p className="text-sm text-gray-900 truncate font-sans">
                    {user?.email || 'Non défini'}
                  </p>
                </div>
              </div>

              {/* Role Row */}
              <div className="flex items-center gap-3 py-2">
                <div className="flex-shrink-0 w-5 h-5 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 mb-1 font-sans">
                    Rôle
                  </p>
                  <p className="text-sm text-gray-900 font-sans">
                    {user?.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                  </p>
                </div>
              </div>
            </div>

            {/* Edit Button */}
            <div className="pt-6 border-t border-gray-100">
              <a
                href="/profile/edit"
                className="block w-full px-6 py-3 bg-seaal-green text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-opacity-90 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ease-in-out text-center font-sans"

              >
                Modifier le profil
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </MainLayout>
  );
}

export default ProfileShow;

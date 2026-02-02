import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProfileInfo from './ProfileInfo';
import SecuritySettings from './SecuritySettings';
import DeleteAccount from './DeleteAccount';

function ProfileEdit() {
  const [activeTab, setActiveTab] = useState('account');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user data
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      // This would typically fetch from an API endpoint
      // For now, we'll use a placeholder
      setUser({
        name: 'User Name',
        email: 'user@example.com',
        email_verified_at: null
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'account', label: 'Informations du compte', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )},
    { id: 'security', label: 'Sécurité', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    )},
    { id: 'danger', label: 'Zone de danger', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    )}
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-[#003366]">Chargement...</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-[#F4F7F9] flex items-center justify-center px-4 py-12"
    >
      <div className="w-full max-w-lg">
        {/* Identity Card Style */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          {/* Compact Header */}
          <div className="mb-5 pb-3 border-b border-gray-100">
            <h1 className="text-lg font-bold text-[#003366] mb-0.5" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              Paramètres du profil
            </h1>
            <p className="text-xs text-gray-500" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              Gérez vos informations
            </p>
          </div>

          {/* Compact Tab Navigation */}
          <div className="mb-5">
            <div className="flex gap-1 border-b border-gray-100">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-t
                    transition-all duration-300 ease-in-out
                    ${activeTab === tab.id
                      ? 'text-[#003366] border-b-2 border-[#003366] font-semibold'
                      : 'text-gray-500 hover:text-[#003366]'
                    }
                  `}
                  style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                >
                  <span className="w-3.5 h-3.5">{tab.icon}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="mt-3">
            {activeTab === 'account' && <ProfileInfo user={user} />}
            {activeTab === 'security' && <SecuritySettings />}
            {activeTab === 'danger' && <DeleteAccount />}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default ProfileEdit;

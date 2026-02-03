import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import MainLayout from '../Components/UI/MainLayout';
import { storageUrl } from '../utils/storageUrl';
import { MessageSquare } from 'lucide-react';

function UserShow({ user: profileUser }) {
  const { auth } = usePage().props;
  const currentUserId = auth?.user?.id;
  const isOwnProfile = profileUser?.id === currentUserId;

  const user = profileUser || {};

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="min-h-full bg-[#F3F4F6] flex justify-center px-4 py-12 font-sans"
      >
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-sm p-8">
            {/* Profile Header with Avatar */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-5">
                {user?.profile_photo ? (
                  <img
                    src={storageUrl(user.profile_photo)}
                    alt={user.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-seaal-dark"
                  />
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

            {/* Profile Information */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 py-2">
                <div className="flex-shrink-0 w-5 h-5 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 mb-1 font-sans">Nom</p>
                  <p className="text-sm text-gray-900 truncate font-sans">{user?.name || 'Non défini'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 py-2">
                <div className="flex-shrink-0 w-5 h-5 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 mb-1 font-sans">E-mail</p>
                  <p className="text-sm text-gray-900 truncate font-sans">{user?.email || 'Non défini'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 py-2">
                <div className="flex-shrink-0 w-5 h-5 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 mb-1 font-sans">Rôle</p>
                  <p className="text-sm text-gray-900 font-sans">
                    {user?.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                  </p>
                </div>
              </div>
            </div>

            {/* Contacter button - only when viewing another user's profile (not own) */}
            <div className="pt-6 border-t border-gray-100 space-y-3">
              {!isOwnProfile && user?.id && (
                <Link
                  href={`/chat/dm/${user.id}`}
                  className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-seaal-dark text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-opacity-90 hover:shadow-md transition-all duration-300 font-sans"
                >
                  <MessageSquare size={18} />
                  Contacter
                </Link>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </MainLayout>
  );
}

export default UserShow;

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useForm, usePage } from '@inertiajs/react';
import MainLayout from '../Components/UI/MainLayout';
import { Settings as SettingsIcon, User, Bell, Lock, Check, X } from 'lucide-react';
import { storageUrl } from '../utils/storageUrl';

// Switch Component
const Switch = ({ enabled, onChange, label }) => {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-sm font-medium text-gray-700 font-sans">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-seaal-dark focus:ring-offset-2 ${
          enabled ? 'bg-seaal-green' : 'bg-gray-200'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            enabled ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
};

function Settings() {
  const { user, settings: initialSettings } = usePage().props;
  const [activeTab, setActiveTab] = useState('account');
  const [photoPreview, setPhotoPreview] = useState(user?.profile_photo ? storageUrl(user.profile_photo) : null);
  const fileInputRef = useRef(null);

  // Account Settings Form
  const profileForm = useForm({
    name: user?.name || '',
    email: user?.email || '',
    profile_photo: null,
  });

  // Password Form
  const passwordForm = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  // Notifications Form
  const notificationsForm = useForm({
    email_notifications: initialSettings?.email_notifications ?? true,
    browser_notifications: initialSettings?.browser_notifications ?? false,
  });

  const handleProfilePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      profileForm.setData('profile_photo', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    profileForm.post('/settings/profile', {
      forceFormData: true,
      onSuccess: () => {
        // Success handled by Inertia
      },
    });
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    passwordForm.post('/settings/password', {
      onSuccess: () => {
        passwordForm.reset();
      },
    });
  };

  const handleNotificationsSubmit = (e) => {
    e.preventDefault();
    notificationsForm.post('/settings/notifications');
  };

  const tabs = [
    { id: 'account', label: 'Paramètres de compte', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Sécurité', icon: Lock },
  ];

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full"
      >
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-seaal-dark to-seaal-light px-8 py-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <SettingsIcon className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white font-sans">Paramètres</h1>
                <p className="text-white/80 font-sans">Gérez vos préférences et configurations</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 bg-gray-50">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 font-medium text-sm transition-colors whitespace-nowrap font-sans ${
                      activeTab === tab.id
                        ? 'text-seaal-dark border-b-2 border-seaal-dark bg-white'
                        : 'text-gray-600 hover:text-seaal-dark hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={18} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {/* Account Settings Tab */}
            {activeTab === 'account' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-seaal-dark mb-6 font-sans">Paramètres de compte</h2>
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  {/* Profile Photo */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 font-sans">
                      Photo de profil
                    </label>
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        {photoPreview ? (
                          <img
                            src={photoPreview}
                            alt="Profile"
                            className="w-24 h-24 rounded-full object-cover border-4 border-seaal-dark shadow-lg"
                          />
                        ) : (
                          <div className="w-24 h-24 rounded-full bg-seaal-dark flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                            {user?.name?.charAt(0) || 'U'}
                          </div>
                        )}
                      </div>
                      <div>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleProfilePhotoChange}
                          accept="image/*"
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-4 py-2 bg-seaal-light text-white rounded-lg hover:bg-opacity-90 transition-colors font-sans"
                        >
                          Changer la photo
                        </button>
                      </div>
                    </div>
                    {profileForm.errors.profile_photo && (
                      <p className="text-red-500 text-sm mt-1">{profileForm.errors.profile_photo}</p>
                    )}
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 font-sans">
                      Nom <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={profileForm.data.name}
                      onChange={(e) => profileForm.setData('name', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-seaal-dark focus:ring-4 focus:ring-seaal-dark/20 outline-none transition-all font-sans text-black"
                      required
                    />
                    {profileForm.errors.name && (
                      <p className="text-red-500 text-sm mt-1">{profileForm.errors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 font-sans">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={profileForm.data.email}
                      onChange={(e) => profileForm.setData('email', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-seaal-dark focus:ring-4 focus:ring-seaal-dark/20 outline-none transition-all font-sans text-black"
                      required
                    />
                    {profileForm.errors.email && (
                      <p className="text-red-500 text-sm mt-1">{profileForm.errors.email}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      disabled={profileForm.processing}
                      className="px-8 py-3 bg-seaal-green text-white rounded-xl font-semibold hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-sans"
                    >
                      {profileForm.processing ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Enregistrement...
                        </>
                      ) : (
                        <>
                          <Check size={18} />
                          Enregistrer les modifications
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-seaal-dark mb-6 font-sans">Notifications</h2>
                <form onSubmit={handleNotificationsSubmit} className="space-y-6">
                  <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                    <Switch
                      enabled={notificationsForm.data.email_notifications}
                      onChange={(value) => notificationsForm.setData('email_notifications', value)}
                      label="Notifications par email"
                    />
                    <Switch
                      enabled={notificationsForm.data.browser_notifications}
                      onChange={(value) => notificationsForm.setData('browser_notifications', value)}
                      label="Notifications du navigateur"
                    />
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      disabled={notificationsForm.processing}
                      className="px-8 py-3 bg-seaal-green text-white rounded-xl font-semibold hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-sans"
                    >
                      {notificationsForm.processing ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Enregistrement...
                        </>
                      ) : (
                        <>
                          <Check size={18} />
                          Enregistrer les préférences
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-seaal-dark mb-6 font-sans">Sécurité</h2>
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  {/* Current Password */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 font-sans">
                      Mot de passe actuel <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      value={passwordForm.data.current_password}
                      onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-seaal-dark focus:ring-4 focus:ring-seaal-dark/20 outline-none transition-all font-sans text-black"
                      required
                    />
                    {passwordForm.errors.current_password && (
                      <p className="text-red-500 text-sm mt-1">{passwordForm.errors.current_password}</p>
                    )}
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 font-sans">
                      Nouveau mot de passe <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      value={passwordForm.data.password}
                      onChange={(e) => passwordForm.setData('password', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-seaal-dark focus:ring-4 focus:ring-seaal-dark/20 outline-none transition-all font-sans text-black"
                      required
                    />
                    {passwordForm.errors.password && (
                      <p className="text-red-500 text-sm mt-1">{passwordForm.errors.password}</p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 font-sans">
                      Confirmer le mot de passe <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      value={passwordForm.data.password_confirmation}
                      onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-seaal-dark focus:ring-4 focus:ring-seaal-dark/20 outline-none transition-all font-sans text-black"
                      required
                    />
                    {passwordForm.errors.password_confirmation && (
                      <p className="text-red-500 text-sm mt-1">{passwordForm.errors.password_confirmation}</p>
                    )}
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      disabled={passwordForm.processing}
                      className="px-8 py-3 bg-seaal-green text-white rounded-xl font-semibold hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-sans"
                    >
                      {passwordForm.processing ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Enregistrement...
                        </>
                      ) : (
                        <>
                          <Check size={18} />
                          Changer le mot de passe
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </MainLayout>
  );
}

export default Settings;

import React, { useState, useRef, useEffect } from 'react';
import { useForm, Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import MainLayout from '../Components/UI/MainLayout';

function UserEdit({ user }) {
  // Safety check - if user is not provided, show loading or error
  if (!user) {
    return (
      <MainLayout>
        <div className="min-h-full flex items-center justify-center font-sans">
          <div className="text-center">
            <p className="text-gray-600">
              Chargement...
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  const { data, setData, put, processing, errors, reset } = useForm({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'user',
    profile_photo: null
  });

  const [focusedField, setFocusedField] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const fileInputRef = useRef(null);

  // Set photo preview from existing user photo
  useEffect(() => {
    if (user?.profile_photo) {
      // Handle both full URLs and relative paths
      const photoUrl = user.profile_photo.startsWith('http')
        ? user.profile_photo
        : `/storage/${user.profile_photo}`;
      setPhotoPreview(photoUrl);
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    put(`/users/${user.id}`, {
      onSuccess: () => {
        // Redirect handled by Inertia
      },
    });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setData('profile_photo', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const FloatingLabel = ({ children, label, htmlFor, hasValue, isFocused, error }) => (
    <div className="relative">
      {children}
      <label
        htmlFor={htmlFor}
        className={`absolute left-4 transition-all duration-300 pointer-events-none font-sans ${hasValue || isFocused
          ? 'top-2 text-xs text-seaal-light font-medium'
          : 'top-4 text-sm text-gray-500'
          } ${error ? 'text-red-500' : ''}`}
      >
        {label}
      </label>
    </div>
  );

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="min-h-[calc(100vh-200px)] flex items-center justify-center p-4 sm:p-8 font-sans"
      >
        <Head title={`Modifier ${user?.name || 'Utilisateur'}`} />

        {/* Floating Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8 sm:p-10 border border-gray-100/50"
        >
          {/* Header */}
          <div className="mb-8 text-center">
            <h1
              className="text-3xl font-bold text-seaal-dark mb-2 tracking-tight leading-tight"
            >
              Modifier l'Utilisateur
            </h1>
            <p
              className="text-gray-600 text-sm leading-relaxed"
            >
              Mettre à jour les informations de {user?.name || 'l\'utilisateur'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Photo Upload Zone */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div
                  onClick={handlePhotoClick}
                  className="w-32 h-32 rounded-full bg-gradient-to-br from-seaal-dark to-seaal-light p-1 cursor-pointer hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-xl"
                >
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center">
                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <p className="text-xs text-gray-500">Photo</p>
                      </div>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handlePhotoClick}
                  className="absolute -bottom-2 -right-2 w-10 h-10 bg-seaal-green text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#7AB82E] hover:scale-110 transition-all duration-300"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* Name Input with Floating Label */}
            <FloatingLabel
              label="Nom Complet"
              htmlFor="name"
              hasValue={data.name}
              isFocused={focusedField === 'name'}
              error={errors.name}
            >
              <input
                id="name"
                type="text"
                value={data.name}
                onChange={e => setData('name', e.target.value)}
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
                className={`w-full pt-6 pb-2 px-4 border-2 rounded-xl outline-none transition-all duration-300 font-sans text-black bg-white ${errors.name
                  ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                  : 'border-gray-200 focus:border-seaal-light focus:ring-4 focus:ring-seaal-light/20'
                  }`}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1.5 ml-1 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.name}
                </p>
              )}
            </FloatingLabel>

            {/* Email Input with Floating Label */}
            <FloatingLabel
              label="Email"
              htmlFor="email"
              hasValue={data.email}
              isFocused={focusedField === 'email'}
              error={errors.email}
            >
              <input
                id="email"
                type="email"
                value={data.email}
                onChange={e => setData('email', e.target.value)}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                className={`w-full pt-6 pb-2 px-4 border-2 rounded-xl outline-none transition-all duration-300 font-sans text-black bg-white ${errors.email
                  ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                  : 'border-gray-200 focus:border-seaal-light focus:ring-4 focus:ring-seaal-light/20'
                  }`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1.5 ml-1 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.email}
                </p>
              )}
            </FloatingLabel>

            {/* Role Select with Floating Label */}
            <div className="relative">
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700 mb-2 font-sans"

              >
                Rôle
              </label>
              <select
                id="role"
                value={data.role}
                onChange={e => setData('role', e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-xl outline-none transition-all duration-300 font-sans text-black bg-white ${errors.role
                  ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                  : 'border-gray-200 focus:border-seaal-light focus:ring-4 focus:ring-seaal-light/20'
                  }`}
              >
                <option value="user">Utilisateur</option>
                <option value="admin">Administrateur</option>
              </select>
              {errors.role && (
                <p className="text-red-500 text-xs mt-1.5 ml-1 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.role}
                </p>
              )}
            </div>

            {/* Submit Button with Pulse Effect */}
            <button
              type="submit"
              disabled={processing}
              className="w-full py-4 text-white rounded-xl font-bold shadow-lg shadow-seaal-green/30 hover:shadow-xl hover:shadow-seaal-green/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 relative overflow-hidden group font-sans leading-relaxed bg-seaal-green"

            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {processing ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Mise à jour en cours...
                  </>
                ) : (
                  'Mettre à jour'
                )}
              </span>
              {/* Pulse Effect */}
              <span className="absolute inset-0 bg-seaal-green opacity-0 group-hover:opacity-20 group-hover:animate-pulse"></span>
            </button>
          </form>
        </motion.div>
      </motion.div>
    </MainLayout>
  );
}

export default UserEdit;

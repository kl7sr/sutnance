import React, { useState, useRef } from 'react';
import { useForm, Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import MainLayout from '../Components/UI/MainLayout';

function UserCreate() {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'user',
    profile_photo: null
  });

  const [focusedField, setFocusedField] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/users', {
      onBefore: () => { data.password_confirmation = data.password; },
      onSuccess: () => {
        reset('password');
        setPhotoPreview(null);
      },
    });
  };

  const handlePhotoChange = (file) => {
    if (file) {
      setData('profile_photo', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    handlePhotoChange(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handlePhotoChange(file);
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

  // Animation variants for the card
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
        duration: 0.6
      }
    }
  };

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="min-h-full flex items-center justify-center p-4 sm:p-8"
      >
        <Head title="Créer Utilisateur" />

        {/* High-Contrast Floating Card with SEAAL Colors */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-2 border-[#003366]/20 overflow-hidden"
          style={{
            boxShadow: '0 20px 60px rgba(0, 51, 102, 0.15), 0 0 0 1px rgba(0, 51, 102, 0.05)'
          }}
        >
          {/* Header with SEAAL Blue Gradient */}
          <div
            className="px-8 py-6 border-b-2 border-seaal-dark/10 bg-gradient-to-br from-seaal-dark to-seaal-light"
          >
            <h1
              className="text-3xl font-bold text-white mb-2 tracking-tight leading-tight"
            >
              Créer un Utilisateur
            </h1>
            <p
              className="text-white/90 text-sm"
              style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                lineHeight: '1.6'
              }}
            >
              Ajouter un nouveau membre au système SEAAL
            </p>
          </div>

          <div className="p-8 sm:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Modern Drag & Drop Zone for Profile Photo */}
              <div className="flex justify-center mb-8">
                <div
                  ref={dropZoneRef}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={handlePhotoClick}
                  className={`
                  relative w-40 h-40 rounded-2xl cursor-pointer
                  transition-all duration-300 ease-in-out
                  ${isDragging
                      ? 'scale-105 border-4 border-seaal-green bg-seaal-green/10'
                      : 'border-2 border-dashed border-gray-300 hover:border-seaal-dark hover:bg-gray-50'
                    }
                  ${photoPreview ? 'border-solid border-seaal-green bg-white' : ''}
                `}
                >
                  {photoPreview ? (
                    <div className="w-full h-full rounded-2xl overflow-hidden">
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileHover={{ opacity: 1, scale: 1 }}
                          className="bg-seaal-green text-white rounded-full p-3 shadow-lg"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </motion.div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-4">
                      <motion.div
                        animate={isDragging ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <svg
                          className={`w-16 h-16 mx-auto mb-3 ${isDragging ? 'text-seaal-green' : 'text-gray-400'}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </motion.div>
                      <p
                        className={`text-sm font-medium text-center font-sans ${isDragging ? 'text-seaal-green' : 'text-gray-600'}`}
                      >
                        {isDragging ? 'Déposez l\'image ici' : 'Glissez une image ou cliquez'}
                      </p>
                      <p
                        className="text-xs text-gray-400 mt-1 font-sans"

                      >
                        PNG, JPG jusqu'à 2MB
                      </p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileInputChange}
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

              {/* Password Input with Floating Label */}
              <FloatingLabel
                label="Mot de passe"
                htmlFor="password"
                hasValue={data.password}
                isFocused={focusedField === 'password'}
                error={errors.password}
              >
                <input
                  id="password"
                  type="password"
                  value={data.password}
                  onChange={e => setData('password', e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full pt-6 pb-2 px-4 border-2 rounded-xl outline-none transition-all duration-300 font-sans text-black bg-white ${errors.password
                    ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                    : 'border-gray-200 focus:border-seaal-light focus:ring-4 focus:ring-seaal-light/20'
                    }`}
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1.5 ml-1 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.password}
                  </p>
                )}
              </FloatingLabel>

              {/* Password Confirmation Input */}
              <FloatingLabel
                label="Confirmer le mot de passe"
                htmlFor="password_confirmation"
                hasValue={data.password_confirmation}
                isFocused={focusedField === 'password_confirmation'}
                error={errors.password_confirmation}
              >
                <input
                  id="password_confirmation"
                  type="password"
                  value={data.password_confirmation}
                  onChange={e => setData('password_confirmation', e.target.value)}
                  onFocus={() => setFocusedField('password_confirmation')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full pt-6 pb-2 px-4 border-2 rounded-xl outline-none transition-all duration-300 font-sans text-black bg-white ${errors.password_confirmation
                      ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                      : 'border-gray-200 focus:border-seaal-light focus:ring-4 focus:ring-seaal-light/20'
                    }`}
                />
                {errors.password_confirmation && (
                  <p className="text-red-500 text-xs mt-1.5 ml-1 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.password_confirmation}
                  </p>
                )}
              </FloatingLabel>

              {/* Role Select */}
              <div className="relative">
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700 mb-2"
                  style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                >
                  Rôle
                </label>
                <select
                  id="role"
                  value={data.role}
                  onChange={e => setData('role', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none transition-all duration-300 focus:border-seaal-light focus:ring-4 focus:ring-seaal-light/20 font-sans text-black bg-white"
                >
                  <option value="user">Utilisateur</option>
                  <option value="admin">Administrateur</option>
                </select>
              </div>

              {/* Submit Button with SEAAL Green */}
              <motion.button
                type="submit"
                disabled={processing}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group font-sans leading-relaxed bg-seaal-green"
                onMouseDown={(e) => e.currentTarget.style.backgroundColor = '#7AB82E'}
                onMouseUp={(e) => e.currentTarget.style.backgroundColor = '#8CC63F'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#8CC63F'}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {processing ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Création en cours...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                      Créer le compte
                    </>
                  )}
                </span>
                {/* Pulse Effect */}
                <motion.span
                  className="absolute inset-0 bg-[#8CC63F] opacity-0 group-hover:opacity-20"
                  animate={{
                    opacity: [0, 0.2, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                />
              </motion.button>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </MainLayout>
  );
}

export default UserCreate;

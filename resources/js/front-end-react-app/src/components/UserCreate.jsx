import React, { useState, useRef } from 'react';
import { useForm, Head } from '@inertiajs/react';
import { motion } from 'framer-motion';

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
  const fileInputRef = useRef(null);

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
        className={`absolute left-4 transition-all duration-300 pointer-events-none ${
          hasValue || isFocused
            ? 'top-2 text-xs text-[#00AEEF] font-medium'
            : 'top-4 text-sm text-gray-500'
        } ${error ? 'text-red-500' : ''}`}
        style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
      >
        {label}
      </label>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-gradient-to-br from-[#F4F7F9] via-white to-[#F4F7F9] flex items-center justify-center p-4 sm:p-8"
    >
      <Head title="Créer Utilisateur" />
      
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
            className="text-3xl font-bold text-[#003366] mb-2" 
            style={{ 
              fontFamily: 'Inter, system-ui, sans-serif',
              letterSpacing: '-0.02em',
              lineHeight: '1.3'
            }}
          >
            Créer un Utilisateur
          </h1>
          <p 
            className="text-gray-600 text-sm"
            style={{ 
              fontFamily: 'Inter, system-ui, sans-serif',
              lineHeight: '1.6'
            }}
          >
            Ajouter un nouveau membre au système SEAAL
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Photo Upload Zone */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div
                onClick={handlePhotoClick}
                className="w-32 h-32 rounded-full bg-gradient-to-br from-[#003366] to-[#00AEEF] p-1 cursor-pointer hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-xl"
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
                className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#8CC63F] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#7AB82E] hover:scale-110 transition-all duration-300"
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
              className={`w-full pt-6 pb-2 px-4 border-2 rounded-xl outline-none transition-all duration-300 ${
                errors.name
                  ? 'border-red-400 bg-red-50/50 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                  : 'border-gray-200 bg-gray-50/50 focus:border-[#00AEEF] focus:ring-4 focus:ring-[#00AEEF]/20 focus:bg-white'
              }`}
              style={{ 
                fontFamily: 'Inter, system-ui, sans-serif',
                lineHeight: '1.6'
              }}
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
              className={`w-full pt-6 pb-2 px-4 border-2 rounded-xl outline-none transition-all duration-300 ${
                errors.email
                  ? 'border-red-400 bg-red-50/50 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                  : 'border-gray-200 bg-gray-50/50 focus:border-[#00AEEF] focus:ring-4 focus:ring-[#00AEEF]/20 focus:bg-white'
              }`}
              style={{ 
                fontFamily: 'Inter, system-ui, sans-serif',
                lineHeight: '1.6'
              }}
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
              className={`w-full pt-6 pb-2 px-4 border-2 rounded-xl outline-none transition-all duration-300 ${
                errors.password
                  ? 'border-red-400 bg-red-50/50 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                  : 'border-gray-200 bg-gray-50/50 focus:border-[#00AEEF] focus:ring-4 focus:ring-[#00AEEF]/20 focus:bg-white'
              }`}
              style={{ 
                fontFamily: 'Inter, system-ui, sans-serif',
                lineHeight: '1.6'
              }}
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

          {/* Submit Button with Pulse Effect */}
          <button
            type="submit"
            disabled={processing}
            className="w-full py-4 bg-[#8CC63F] text-white rounded-xl font-bold shadow-lg shadow-[#8CC63F]/30 hover:bg-[#7AB82E] hover:shadow-xl hover:shadow-[#8CC63F]/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 relative overflow-hidden group"
            style={{ 
              fontFamily: 'Inter, system-ui, sans-serif',
              lineHeight: '1.6'
            }}
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
                'Créer le compte'
              )}
            </span>
            {/* Pulse Effect */}
            <span className="absolute inset-0 bg-[#8CC63F] opacity-0 group-hover:opacity-20 group-hover:animate-pulse"></span>
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default UserCreate;
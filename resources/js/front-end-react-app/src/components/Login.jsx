import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  // Get CSRF token from meta tag
  const getCsrfToken = () => {
    const metaTag = document.querySelector('meta[name="csrf-token"]');
    return metaTag ? metaTag.getAttribute('content') : null;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const csrfToken = getCsrfToken();
      const response = await axios.post('/login', formData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': csrfToken,
          'X-Requested-With': 'XMLHttpRequest'
        },
        withCredentials: true
      });

      // If successful, redirect to dashboard
      if (response.status === 200 || response.status === 204) {
        window.location.href = '/dashboard';
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else if (error.response?.data?.message) {
        setErrors({ email: error.response.data.message });
      } else {
        setErrors({ email: 'Une erreur est survenue lors de la connexion.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#003366] via-[#002244] to-[#001122] px-4 py-12"
    >
      {/* Centered Login Container - No White Box */}
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg border border-white/20">
              {/* SEAAL Logo Placeholder */}
              <img 
                src="https://www.areal-topkapi.com/sites/default/files/2020-09/logo-seaal.jpg" 
                alt="SEAAL Logo" 
                className="w-16 h-16 object-cover rounded-lg"
                onError={(e) => {
                  // Fallback if image fails to load
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = '<span class="text-white text-2xl font-bold">SEAAL</span>';
                }}
              />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: 'Inter, system-ui, sans-serif', lineHeight: '1.5', letterSpacing: '0.01em' }}>
            Connexion
          </h2>
          <p className="text-sm text-gray-300" style={{ fontFamily: 'Inter, system-ui, sans-serif', lineHeight: '1.6', letterSpacing: '0.01em' }}>
            Entrez vos identifiants pour continuer
          </p>
        </div>

        {/* Form Section - Minimalist */}
        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Email Field - Transparent with Bottom Border */}
          <div>
            <label 
              htmlFor="email" 
              className="block text-sm font-semibold text-gray-200 mb-4"
              style={{ fontFamily: 'Inter, system-ui, sans-serif', lineHeight: '1.6', letterSpacing: '0.01em' }}
            >
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              required
              autoFocus
              autoComplete="username"
              className={`
                w-full px-0 py-3 
                bg-transparent
                border-0 
                border-b-2 
                rounded-none
                outline-none 
                transition-all 
                duration-300 
                ease-in-out
                text-white
                placeholder-gray-400
                ${errors.email 
                  ? 'border-red-400 focus:border-red-500' 
                  : focusedField === 'email' || formData.email
                    ? 'border-[#00AEEF] focus:border-[#00AEEF]'
                    : 'border-gray-400 focus:border-[#00AEEF]'
                }
              `}
              placeholder="votre.email@exemple.com"
              style={{ fontFamily: 'Inter, system-ui, sans-serif', lineHeight: '1.6', letterSpacing: '0.01em' }}
            />
            {errors.email && (
              <p className="mt-3 text-sm text-red-300" style={{ fontFamily: 'Inter, system-ui, sans-serif', lineHeight: '1.6', letterSpacing: '0.01em' }}>
                {errors.email}
              </p>
            )}
          </div>

          {/* Password Field - Transparent with Bottom Border */}
          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-semibold text-gray-200 mb-4"
              style={{ fontFamily: 'Inter, system-ui, sans-serif', lineHeight: '1.6', letterSpacing: '0.01em' }}
            >
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
              required
              autoComplete="current-password"
              className={`
                w-full px-0 py-3 
                bg-transparent
                border-0 
                border-b-2 
                rounded-none
                outline-none 
                transition-all 
                duration-300 
                ease-in-out
                text-white
                placeholder-gray-400
                ${errors.password 
                  ? 'border-red-400 focus:border-red-500' 
                  : focusedField === 'password' || formData.password
                    ? 'border-[#00AEEF] focus:border-[#00AEEF]'
                    : 'border-gray-400 focus:border-[#00AEEF]'
                }
              `}
              placeholder="••••••••"
              style={{ fontFamily: 'Inter, system-ui, sans-serif', lineHeight: '1.6', letterSpacing: '0.01em' }}
            />
            {errors.password && (
              <p className="mt-3 text-sm text-red-300" style={{ fontFamily: 'Inter, system-ui, sans-serif', lineHeight: '1.6', letterSpacing: '0.01em' }}>
                {errors.password}
              </p>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between pt-4">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="remember"
                checked={formData.remember}
                onChange={handleChange}
                className="w-4 h-4 rounded border-gray-400 bg-transparent text-[#00AEEF] focus:ring-[#00AEEF] focus:ring-2 transition-all duration-300 ease-in-out cursor-pointer"
              />
              <span 
                className="ml-2 text-sm text-gray-200"
                style={{ fontFamily: 'Inter, system-ui, sans-serif', lineHeight: '1.6', letterSpacing: '0.01em' }}
              >
                Se souvenir de moi
              </span>
            </label>

            <a 
              href="/forgot-password" 
              className="text-sm font-medium text-[#00AEEF] hover:text-[#00C4FF] transition-all duration-300 ease-in-out hover:underline"
              style={{ fontFamily: 'Inter, system-ui, sans-serif', lineHeight: '1.6', letterSpacing: '0.01em' }}
            >
              Mot de passe oublié?
            </a>
          </div>

          {/* Submit Button - Rounded Full with Lightening Hover */}
          <div className="pt-8">
            <button
              type="submit"
              disabled={loading}
              className="w-full px-8 py-4 bg-[#003366] text-white font-semibold rounded-full shadow-sm hover:bg-[#0055AA] hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{ fontFamily: 'Inter, system-ui, sans-serif', lineHeight: '1.6', letterSpacing: '0.02em' }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Connexion en cours...
                </span>
              ) : (
                'Connexion'
              )}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

export default Login;

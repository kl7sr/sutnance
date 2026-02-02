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
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-seaal-gray via-white to-seaal-gray px-4 py-12 font-sans"
    >
      {/* Modern Centered Login Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 border border-gray-100"
      >
        {/* SEAAL Logo at Top */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <img
              src="https://www.areal-topkapi.com/sites/default/files/2020-09/logo-seaal.jpg"
              alt="SEAAL Logo"
              className="w-20 h-20 object-cover rounded-lg shadow-md"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = '<div class="w-20 h-20 bg-seaal-dark rounded-lg flex items-center justify-center"><span class="text-white text-2xl font-bold">SEAAL</span></div>';
              }}
            />
          </div>
          <h2
            className="text-3xl font-bold text-seaal-dark mb-2 tracking-wide leading-snug"
          >
            Connexion
          </h2>
          <p
            className="text-sm text-gray-600 tracking-wide leading-relaxed font-sans"
          >
            Entrez vos identifiants pour continuer
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700 mb-2 font-sans leading-relaxed"
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
                w-full px-4 py-3 
                border-2
                rounded-xl
                outline-none 
                transition-all 
                duration-300 
                ease-in-out
                placeholder-gray-600
                ${errors.email
                  ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                  : focusedField === 'email' || formData.email
                    ? 'border-gray-300 focus:border-seaal-dark focus:ring-4 focus:ring-seaal-dark/30'
                    : 'border-gray-300 focus:border-seaal-dark focus:ring-4 focus:ring-seaal-dark/30'
                }
              `}
              placeholder="votre.email@exemple.com"
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-600" style={{ fontFamily: 'Inter, system-ui, sans-serif', lineHeight: '1.6' }}>
                {errors.email}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-700 mb-2 font-sans leading-relaxed"
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
                w-full px-4 py-3 
                border-2
                rounded-xl
                outline-none 
                transition-all 
                duration-300 
                ease-in-out
                placeholder-gray-600
                ${errors.password
                  ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                  : focusedField === 'password' || formData.password
                    ? 'border-gray-300 focus:border-seaal-dark focus:ring-4 focus:ring-seaal-dark/30'
                    : 'border-gray-300 focus:border-seaal-dark focus:ring-4 focus:ring-seaal-dark/30'
                }
              `}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-2 text-sm text-red-600" style={{ fontFamily: 'Inter, system-ui, sans-serif', lineHeight: '1.6' }}>
                {errors.password}
              </p>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between pt-2">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="remember"
                checked={formData.remember}
                onChange={handleChange}
                className="w-4 h-4 rounded border-gray-300 text-seaal-dark focus:ring-seaal-dark focus:ring-2 transition-all duration-300 ease-in-out cursor-pointer"
              />
              <span
                className="ml-2 text-sm text-gray-700 font-sans leading-relaxed"
              >
                Se souvenir de moi
              </span>
            </label>

            <a
              href="/forgot-password"
              className="text-sm font-medium text-seaal-light hover:text-seaal-dark transition-all duration-300 ease-in-out hover:underline font-sans leading-relaxed"
            >
              Mot de passe oublié?
            </a>
          </div>

          {/* Submit Button - SEAAL Blue */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full px-8 py-4 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 bg-seaal-dark font-sans leading-relaxed tracking-wide hover:bg-opacity-90"
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
      </motion.div>
    </motion.div>
  );
}

export default Login;

import React, { useState } from 'react';
import axios from 'axios';

function ProfileInfo({ user }) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Get CSRF token
  const getCsrfToken = () => {
    const metaTag = document.querySelector('meta[name="csrf-token"]');
    return metaTag ? metaTag.getAttribute('content') : null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSuccess(false);

    try {
      const csrfToken = getCsrfToken();
      const response = await axios.patch('/profile', formData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': csrfToken,
          'X-Requested-With': 'XMLHttpRequest'
        },
        withCredentials: true
      });

      if (response.status === 200) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ email: error.response?.data?.message || 'Une erreur est survenue.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async (e) => {
    e.preventDefault();
    try {
      const csrfToken = getCsrfToken();
      await axios.post('/email/verification-notification', {}, {
        headers: {
          'X-CSRF-TOKEN': csrfToken,
          'X-Requested-With': 'XMLHttpRequest'
        },
        withCredentials: true
      });
      alert('Lien de vérification envoyé!');
    } catch (error) {
      console.error('Error sending verification:', error);
    }
  };

  const isEmailVerified = user?.email_verified_at !== null;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
        {/* Name Field - Minimalist Bottom Border Style */}
        <div>
          <label 
            htmlFor="name" 
            className="block text-xs font-medium text-gray-600 mb-3"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            Nom
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
            autoFocus
            autoComplete="name"
            className={`
              w-full px-0 py-3 text-sm
              bg-transparent
              border-0 
              border-b-2 
              rounded-none
              outline-none 
              transition-all 
              duration-300 
              ease-in-out
              shadow-sm
              ${errors.name 
                ? 'border-red-400 focus:border-red-500' 
                : 'border-gray-300 focus:border-[#00AEEF]'
              }
              placeholder-gray-400
            `}
            placeholder="Votre nom"
            style={{ fontFamily: 'Inter, system-ui, sans-serif', lineHeight: '1.6', letterSpacing: '0.01em' }}
          />
          {errors.name && (
            <p className="mt-2 text-xs text-red-600" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              {errors.name}
            </p>
          )}
        </div>

        {/* Email Field - Minimalist Bottom Border Style */}
        <div>
          <label 
            htmlFor="email" 
            className="block text-xs font-medium text-gray-600 mb-3"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            E-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="username"
            className={`
              w-full px-0 py-3 text-sm
              bg-transparent
              border-0 
              border-b-2 
              rounded-none
              outline-none 
              transition-all 
              duration-300 
              ease-in-out
              shadow-sm
              ${errors.email 
                ? 'border-red-400 focus:border-red-500' 
                : 'border-gray-300 focus:border-[#00AEEF]'
              }
              placeholder-gray-400
            `}
            placeholder="votre.email@exemple.com"
            style={{ fontFamily: 'Inter, system-ui, sans-serif', lineHeight: '1.6', letterSpacing: '0.01em' }}
          />
          {errors.email && (
            <p className="mt-2 text-xs text-red-600" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              {errors.email}
            </p>
          )}
          {/* Email Verification Notice */}
          {!isEmailVerified && (
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-xs">
              <p className="text-gray-700 mb-1" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                E-mail non vérifié.
              </p>
              <button
                type="button"
                onClick={handleResendVerification}
                className="text-[#00AEEF] hover:text-[#0088CC] underline transition-all duration-300 ease-in-out"
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                Renvoyer le lien
              </button>
            </div>
          )}
        </div>

        {/* Submit Button - Rounded Full, Compact, Seaal Green */}
        <div className="flex flex-col items-center gap-3 pt-8">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-[#8CC63F] text-white text-sm font-semibold rounded-full shadow-sm hover:bg-[#7AB82E] hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            style={{ fontFamily: 'Inter, system-ui, sans-serif', lineHeight: '1.6', letterSpacing: '0.02em' }}
          >
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </button>

          {success && (
            <p className="text-xs text-green-600 font-medium" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              Enregistré.
            </p>
          )}
        </div>
      </form>
  );
}

export default ProfileInfo;

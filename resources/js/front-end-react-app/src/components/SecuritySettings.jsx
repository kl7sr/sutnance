import React, { useState } from 'react';
import axios from 'axios';

function SecuritySettings() {
  const [formData, setFormData] = useState({
    current_password: '',
    password: '',
    password_confirmation: ''
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
      const response = await axios.put('/password', formData, {
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
        setFormData({
          current_password: '',
          password: '',
          password_confirmation: ''
        });
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ password: error.response?.data?.message || 'Une erreur est survenue.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Current Password - Minimalist Bottom Border Style */}
        <div>
          <label 
            htmlFor="current_password" 
            className="block text-xs font-medium text-gray-600 mb-3"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            Mot de passe actuel
          </label>
          <input
            id="current_password"
            name="current_password"
            type="password"
            value={formData.current_password}
            onChange={handleChange}
            autoComplete="current-password"
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
              ${errors.current_password 
                ? 'border-red-400 focus:border-red-500' 
                : 'border-gray-300 focus:border-[#00AEEF]'
              }
              placeholder-gray-400
            `}
            placeholder="••••••••"
            style={{ fontFamily: 'Inter, system-ui, sans-serif', lineHeight: '1.6', letterSpacing: '0.01em' }}
          />
          {errors.current_password && (
            <p className="mt-2 text-xs text-red-600" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              {errors.current_password}
            </p>
          )}
        </div>

        {/* New Password - Minimalist Bottom Border Style */}
        <div>
          <label 
            htmlFor="password" 
            className="block text-xs font-medium text-gray-600 mb-3"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            Nouveau mot de passe
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="new-password"
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
              ${errors.password 
                ? 'border-red-400 focus:border-red-500' 
                : 'border-gray-300 focus:border-[#00AEEF]'
              }
              placeholder-gray-400
            `}
            placeholder="••••••••"
            style={{ fontFamily: 'Inter, system-ui, sans-serif', lineHeight: '1.6', letterSpacing: '0.01em' }}
          />
          {errors.password && (
            <p className="mt-2 text-xs text-red-600" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              {errors.password}
            </p>
          )}
        </div>

        {/* Confirm Password - Minimalist Bottom Border Style */}
        <div>
          <label 
            htmlFor="password_confirmation" 
            className="block text-xs font-medium text-gray-600 mb-3"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            Confirmer le mot de passe
          </label>
          <input
            id="password_confirmation"
            name="password_confirmation"
            type="password"
            value={formData.password_confirmation}
            onChange={handleChange}
            autoComplete="new-password"
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
              ${errors.password_confirmation 
                ? 'border-red-400 focus:border-red-500' 
                : 'border-gray-300 focus:border-[#00AEEF]'
              }
              placeholder-gray-400
            `}
            placeholder="••••••••"
            style={{ fontFamily: 'Inter, system-ui, sans-serif', lineHeight: '1.6', letterSpacing: '0.01em' }}
          />
          {errors.password_confirmation && (
            <p className="mt-2 text-xs text-red-600" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              {errors.password_confirmation}
            </p>
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
    </>
  );
}

export default SecuritySettings;

import React, { useState } from 'react';
import axios from 'axios';

function DeleteAccount() {
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Get CSRF token
  const getCsrfToken = () => {
    const metaTag = document.querySelector('meta[name="csrf-token"]');
    return metaTag ? metaTag.getAttribute('content') : null;
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const csrfToken = getCsrfToken();
      await axios.delete('/profile', {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': csrfToken,
          'X-Requested-With': 'XMLHttpRequest'
        },
        data: { password },
        withCredentials: true
      });

      // Redirect to home after successful deletion
      window.location.href = '/';
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
    <div className="space-y-4">
      {/* Delete Account Card - Compact Red Styling */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-sm">
        <div className="flex items-start gap-3 mb-3">
          <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-red-600 mt-0.5">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-red-900 mb-1" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              Action irréversible
            </h3>
            <p className="text-xs text-red-800" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              Cette action ne peut pas être annulée. Toutes vos données seront définitivement supprimées.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-red-700 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ease-in-out"
          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
        >
          Supprimer le compte
        </button>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-[#003366] mb-4" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              Êtes-vous sûr de vouloir supprimer votre compte?
            </h2>

            <p className="text-sm text-gray-600 mb-6" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              Une fois votre compte supprimé, toutes ses ressources et données seront définitivement supprimées. 
              Veuillez entrer votre mot de passe pour confirmer que vous souhaitez supprimer définitivement votre compte.
            </p>

            <form onSubmit={handleDelete} className="space-y-4">
              <div>
                <label 
                  htmlFor="delete_password" 
                  className="block text-sm font-semibold text-[#003366] mb-2"
                  style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                >
                  Mot de passe
                </label>
                <input
                  id="delete_password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={`
                    w-full px-4 py-3 
                    bg-white 
                    border-2 
                    rounded-lg 
                    outline-none 
                    transition-all 
                    duration-300 
                    ease-in-out
                    ${errors.password 
                      ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                      : 'border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                    }
                    placeholder-gray-400
                  `}
                  placeholder="Entrez votre mot de passe"
                  style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                />
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setPassword('');
                    setErrors({});
                  }}
                  className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-300 ease-in-out"
                  style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                >
                  {loading ? 'Suppression...' : 'Supprimer le compte'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DeleteAccount;

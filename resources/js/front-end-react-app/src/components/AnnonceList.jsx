import { useState, useEffect } from 'react';
import axios from 'axios';

function AnnonceList() {
  const [annonces, setAnnonces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get CSRF token from meta tag (if available)
  const getCsrfToken = () => {
    const metaTag = document.querySelector('meta[name="csrf-token"]');
    return metaTag ? metaTag.getAttribute('content') : null;
  };

  // Configure axios base URL - adjust this to match your Laravel API
  const api = axios.create({
    baseURL: '/api',
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    withCredentials: true, // Important for Laravel session-based auth
  });

  // Add CSRF token to requests if available
  api.interceptors.request.use((config) => {
    const token = getCsrfToken();
    if (token) {
      config.headers['X-CSRF-TOKEN'] = token;
    }
    return config;
  });

  // Fetch announcements on component mount
  useEffect(() => {
    fetchAnnonces();
  }, []);

  const fetchAnnonces = async () => {
    try {
      setLoading(true);
      // Adjust this endpoint to match your API route for fetching announcements
      const response = await api.get('/announcements');
      setAnnonces(response.data);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des annonces');
      console.error('Error fetching announcements:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) {
      return;
    }

    try {
      await api.delete(`/announcements/${id}`);
      
      // Remove the deleted item from the state
      setAnnonces(annonces.filter(annonce => annonce.id !== id));
      
      // Optionally show a success message
      alert('Annonce supprimée avec succès');
    } catch (err) {
      setError('Erreur lors de la suppression de l\'annonce');
      console.error('Error deleting announcement:', err);
      alert('Erreur lors de la suppression de l\'annonce');
    }
  };

  if (loading) {
    return <div className="p-4">Chargement...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Liste des Annonces</h2>
      
      {annonces.length === 0 ? (
        <p className="text-gray-500">Aucune annonce pour le moment.</p>
      ) : (
        <div className="space-y-4">
          {annonces.map((annonce) => (
            <div key={annonce.id} className="border rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{annonce.title}</h3>
                  <p className="text-gray-600 mb-2">{annonce.content}</p>
                  {annonce.attachment && (
                    <a
                      href={`/storage/${annonce.attachment}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      Voir la pièce jointe
                    </a>
                  )}
                  <p className="text-sm text-gray-400 mt-2">
                    {new Date(annonce.created_at).toLocaleDateString()}
                  </p>
                </div>
<button
  onClick={() => handleDelete(annonce.id)}
  className="ml-4 p-2 text-red-500 hover:bg-red-50 rounded-full transition-all duration-200 group"
  title="Supprimer l'annonce"
>
 
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className="h-6 w-6 group-hover:scale-110" 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
    />
  </svg>
</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AnnonceList;

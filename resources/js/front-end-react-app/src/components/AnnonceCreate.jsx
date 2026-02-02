import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

function AnnonceCreate({ onSuccess }) {
  const [isOpen, setIsOpen] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const contentRef = useRef(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    attachment: null
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Calculate content height for smooth transition
  useEffect(() => {
    if (isOpen && contentRef.current) {
      // Measure height when opening with a small delay to ensure content is rendered
      const timer = setTimeout(() => {
        if (contentRef.current) {
          setContentHeight(contentRef.current.scrollHeight);
        }
      }, 10);
      return () => clearTimeout(timer);
    } else if (!isOpen) {
      setContentHeight(0);
    }
  }, [isOpen, formData, errors]);

  // Get CSRF token
  const getCsrfToken = () => {
    const metaTag = document.querySelector('meta[name="csrf-token"]');
    return metaTag ? metaTag.getAttribute('content') : null;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'attachment') {
      setFormData(prev => ({
        ...prev,
        [name]: files[0] || null
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
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
      const data = new FormData();
      data.append('title', formData.title);
      data.append('content', formData.content);
      if (formData.attachment) {
        data.append('attachment', formData.attachment);
      }

      const response = await axios.post('/announcements', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': csrfToken,
          'X-Requested-With': 'XMLHttpRequest'
        },
        withCredentials: true
      });

      if (response.status === 200 || response.status === 201) {
        // Reset form
        setFormData({
          title: '',
          content: '',
          attachment: null
        });
        setIsOpen(false);
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ title: error.response?.data?.message || 'Une erreur est survenue.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-8 bg-white rounded-2xl shadow-sm border-l-4 border-[#00A859] overflow-hidden">
      {/* Toggle Button with Subtle Hover */}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full p-5 flex items-center justify-between hover:bg-gray-50/80 transition-all duration-300 ease-in-out rounded-t-2xl"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#00A859] flex items-center justify-center shadow-sm">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
            </svg>
          </div>
          <h2 className="text-lg font-bold text-[#003366]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            Créer une annonce
          </h2>
        </div>
        {/* SVG Arrow with Smooth Rotation */}
        <svg 
          className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>
      
      {/* Form Container with Smooth Slide-Down Effect */}
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          maxHeight: isOpen ? `${contentHeight || 1000}px` : '0px',
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div ref={contentRef} className="px-6 pb-6">
          <form onSubmit={handleSubmit} className="space-y-5" encType="multipart/form-data">
            {/* Title Field */}
            <div>
              <label className="block text-xs font-semibold text-[#003366] mb-2" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                Titre <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Entrez le titre de l'annonce"
                className={`w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:bg-white focus:border-[#003366] focus:ring-1 focus:ring-[#003366] focus:ring-opacity-20 outline-none transition-all duration-300 ease-in-out ${
                  errors.title ? 'border-red-400 focus:border-red-500' : ''
                }`}
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                required
              />
              {errors.title && (
                <p className="mt-1.5 text-xs text-red-600" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  {errors.title}
                </p>
              )}
            </div>
            
            {/* Content Field */}
            <div>
              <label className="block text-xs font-semibold text-[#003366] mb-2" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                Contenu <span className="text-red-500">*</span>
              </label>
              <textarea 
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Entrez le contenu de l'annonce" 
                rows="5"
                className={`w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:bg-white focus:border-[#003366] focus:ring-1 focus:ring-[#003366] focus:ring-opacity-20 outline-none transition-all duration-300 ease-in-out resize-none ${
                  errors.content ? 'border-red-400 focus:border-red-500' : ''
                }`}
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                required
              />
              {errors.content && (
                <p className="mt-1.5 text-xs text-red-600" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  {errors.content}
                </p>
              )}
            </div>
            
            {/* Attachment Field */}
            <div>
              <label className="block text-xs font-semibold text-[#003366] mb-2" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                Fichier joint <span className="text-gray-500 font-normal">(optionnel)</span>
              </label>
              <input 
                type="file" 
                name="attachment"
                onChange={handleChange}
                accept="*/*" 
                className="w-full text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 focus:bg-white focus:border-[#003366] focus:ring-1 focus:ring-[#003366] focus:ring-opacity-20 outline-none transition-all duration-300 ease-in-out file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#003366] file:text-white hover:file:bg-[#004488] file:cursor-pointer file:transition-all file:duration-300"
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
              />
            </div>
            
            {/* Submit Button */}
            <div className="pt-3">
              <button 
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 rounded-lg font-semibold text-sm text-white shadow-sm transition-all duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                style={{ 
                  backgroundColor: '#003366',
                  fontFamily: 'Inter, system-ui, sans-serif'
                }}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Publication en cours...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    Publier une annonce
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AnnonceCreate;

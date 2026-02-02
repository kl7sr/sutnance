import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePage, useForm } from '@inertiajs/react';
import MainLayout from '../Components/UI/MainLayout';
import { storageUrl } from '../utils/storageUrl';
import { Users, X } from 'lucide-react';

function Chat({ conversations = [], conversation = null, messages = [], allUsers = [] }) {
  const { auth } = usePage().props;
  const currentUserId = auth?.user?.id;
  const isAdmin = auth?.user?.role === 'admin';
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  
  // Ensure messages is always an array
  const messagesArray = Array.isArray(messages) ? messages : [];
  
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    image: null,
    participants: []
  });

  // Helper function to check if attachment is an image
  const isImageFile = (filename) => {
    if (!filename) return false;
    const ext = filename.toLowerCase().split('.').pop();
    return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext);
  };
  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full"
      >
        <div className="flex h-[calc(100vh-200px)] bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Conversations Sidebar */}
          <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
            <div className="p-6 border-b border-gray-200 bg-white flex justify-between items-center">
              <h2
                className="font-bold text-xl text-seaal-dark font-sans"
              >
                Discussions
              </h2>
              {isAdmin && (
                <button
                  onClick={() => setShowCreateGroup(true)}
                  className="p-2 rounded-lg bg-seaal-green text-white hover:bg-opacity-90 transition-colors"
                  title="Créer un groupe"
                >
                  <Users size={20} />
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              {conversations.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-gray-500 text-sm font-sans">
                    Aucune conversation
                  </p>
                </div>
              ) : (
                conversations.map((conv) => {
                  const isActive = conversation && conversation.id === conv.id;
                  return (
                    <a
                      key={conv.id}
                      href={`/chat/${conv.id}`}
                      className={`block p-4 transition-all duration-200 rounded-lg mb-2 ${isActive
                        ? 'bg-blue-50 border-l-4 border-l-seaal-dark'
                        : 'hover:bg-gray-50'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        {conv.image ? (
                          <img
                            src={storageUrl(conv.image)}
                            alt={conv.name || 'Conversation'}
                            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                            style={{ maxWidth: '48px', maxHeight: '48px' }}
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-seaal-dark flex items-center justify-center text-white font-bold text-lg shadow-sm">
                            {conv.type === 'group' ? 'G' : 'U'}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4
                            className="text-sm font-bold text-gray-900 truncate font-sans"
                          >
                            {conv.name || 'Conversation'}
                          </h4>
                          <p
                            className="text-xs text-gray-500 truncate font-medium font-sans"
                          >
                            {conv.type === 'group' ? 'Groupe' : 'Message direct'}
                          </p>
                        </div>
                      </div>
                    </a>
                  );
                })
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {conversation ? (
              <>
                {/* Chat Header */}
                <div className="p-6 border-b border-gray-200 bg-white flex items-center gap-4">
                  {conversation.image && (
                    <img
                      src={storageUrl(conversation.image)}
                      alt={conversation.name || 'Conversation'}
                      className="w-12 h-12 rounded-full object-cover border-2 border-seaal-dark"
                      style={{ maxWidth: '48px', maxHeight: '48px' }}
                    />
                  )}
                  <h3
                    className="text-lg font-bold text-seaal-dark font-sans"
                  >
                    {conversation.name || 'Conversation'}
                  </h3>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                  {!Array.isArray(messagesArray) || messagesArray.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500 font-sans">
                        Aucun message. Commencez la conversation!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messagesArray.map((message) => {
                        const isMe = message.user?.id === currentUserId;
                        return (
                          <div key={message.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                            {!isMe && (
                              message.user?.profile_photo ? (
                                <img
                                  src={storageUrl(message.user.profile_photo)}
                                  alt={message.user?.name || 'User'}
                                  className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                                  style={{ maxWidth: '40px', maxHeight: '40px' }}
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-seaal-dark flex items-center justify-center text-white font-bold text-sm">
                                  {message.user?.name?.charAt(0) || 'U'}
                                </div>
                              )
                            )}
                            <div className={`flex-1 ${isMe ? 'text-right' : ''}`}>
                              {!isMe && (
                                <div className="flex items-center gap-2 mb-1">
                                  <span
                                    className="text-sm font-semibold text-gray-900 font-sans"
                                  >
                                    {message.user?.name || 'Utilisateur'}
                                  </span>
                                  <span
                                    className="text-xs text-gray-500 font-sans"
                                  >
                                    {new Date(message.created_at).toLocaleTimeString('fr-FR', {
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </span>
                                </div>
                              )}
                              {isMe && (
                                <div className="flex items-center justify-end gap-2 mb-1">
                                  <span
                                    className="text-xs text-gray-500"
                                    style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                                  >
                                    {new Date(message.created_at).toLocaleTimeString('fr-FR', {
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </span>
                                </div>
                              )}
                              <div className={`inline-block ${isMe ? 'bg-[#E6F0FF] border border-blue-100' : 'bg-white border border-gray-200'} px-4 py-3 rounded-2xl shadow-sm ${isMe ? 'rounded-br-none' : 'rounded-bl-none'}`}>
                                {message.content && (
                                  <p
                                    className="text-sm text-gray-700 leading-relaxed"
                                    style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                                  >
                                    {message.content}
                                  </p>
                                )}
                                {message.attachment && (
                                  <div className={`mt-2 ${message.content ? 'pt-2 border-t border-gray-200/50' : ''}`}>
                                    {isImageFile(message.attachment) ? (
                                      <div className="chat-image-container">
                                        <a
                                          href={storageUrl(message.attachment)}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="block"
                                        >
                                          <img
                                            src={storageUrl(message.attachment)}
                                            alt="Image partagée"
                                            className="chat-image"
                                            style={{
                                              maxWidth: '200px',
                                              borderRadius: '12px',
                                              objectFit: 'cover',
                                              cursor: 'pointer',
                                              transition: 'transform 0.2s ease-in-out'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                          />
                                        </a>
                                      </div>
                                    ) : (
                                      <a
                                        href={`/chat/messages/${message.id}/download`}
                                        className="inline-flex items-center gap-2 text-xs font-medium text-[#003366] hover:underline"
                                        style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                                      >
                                        📎 Pièce jointe
                                      </a>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Message Input */}
                <div className="p-6 border-t border-gray-200 bg-white">
                  <form method="POST" action={`/chat/${conversation.id}`} encType="multipart/form-data">
                    <input type="hidden" name="_token" value={document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')} />
                    <div className="flex gap-3">
                      <input
                        type="text"
                        name="content"
                        placeholder="Tapez votre message..."
                        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-seaal-dark focus:ring-4 focus:ring-seaal-dark/20 outline-none transition-all font-sans"
                      />
                      <input
                        type="file"
                        name="attachment"
                        className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-seaal-dark focus:ring-4 focus:ring-seaal-dark/20 outline-none transition-all"
                      />
                      <button
                        type="submit"
                        className="px-6 py-3 bg-seaal-dark text-white rounded-xl font-semibold hover:bg-opacity-90 transition-colors font-sans"
                      >
                        Envoyer
                      </button>
                    </div>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <p
                    className="text-gray-500 text-lg"
                    style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                  >
                    Sélectionnez une conversation pour commencer
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Create Group Modal */}
        <AnimatePresence>
          {showCreateGroup && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowCreateGroup(false)}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
              >
                <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-seaal-dark font-sans">Créer un groupe</h3>
                    <button
                      onClick={() => {
                        setShowCreateGroup(false);
                        reset();
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      post('/chat/create-group', {
                        forceFormData: true,
                        onSuccess: () => {
                          setShowCreateGroup(false);
                          reset();
                        },
                        onError: (errors) => {
                          console.error('Create group errors:', errors);
                        }
                      });
                    }}
                    className="p-6 space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 font-sans">
                        Nom du groupe <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder="Entrez le nom du groupe"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-seaal-dark focus:ring-4 focus:ring-seaal-dark/20 outline-none transition-all font-sans"
                        required
                      />
                      {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 font-sans">
                        Image du groupe (optionnel)
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setData('image', e.target.files[0])}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-seaal-dark focus:ring-4 focus:ring-seaal-dark/20 outline-none transition-all"
                      />
                      {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 font-sans">
                        Participants <span className="text-red-500">*</span>
                      </label>
                      <div className="max-h-60 overflow-y-auto border-2 border-gray-200 rounded-xl p-3 space-y-2">
                        {allUsers.map((user) => (
                          <label
                            key={user.id}
                            className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={data.participants.includes(user.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setData('participants', [...data.participants, user.id]);
                                } else {
                                  setData('participants', data.participants.filter(id => id !== user.id));
                                }
                              }}
                              className="w-4 h-4 text-seaal-dark border-gray-300 rounded focus:ring-seaal-dark"
                            />
                            <div className="flex items-center gap-2">
                              {user.profile_photo ? (
                                <img
                                  src={storageUrl(user.profile_photo)}
                                  alt={user.name}
                                  className="w-8 h-8 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-seaal-dark flex items-center justify-center text-white text-sm font-bold">
                                  {user.name?.charAt(0) || 'U'}
                                </div>
                              )}
                              <span className="text-sm font-sans">{user.name}</span>
                            </div>
                          </label>
                        ))}
                      </div>
                      {errors.participants && <p className="text-red-500 text-sm mt-1">{errors.participants}</p>}
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setShowCreateGroup(false);
                          reset();
                        }}
                        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors font-sans"
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        disabled={processing || data.participants.length === 0}
                        className="flex-1 px-4 py-3 bg-seaal-green text-white rounded-xl font-semibold hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-sans"
                      >
                        {processing ? 'Création...' : 'Créer le groupe'}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </MainLayout>
  );
}

export default Chat;

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, usePage, useForm, router } from '@inertiajs/react';
import MainLayout from '../Components/UI/MainLayout';
import UserAvatar from '../Components/UI/UserAvatar';
import { storageUrl } from '../utils/storageUrl';
import { Users, X, Info, Paperclip, Image, FileText, Pencil, Trash2, UserMinus, Search, MoreVertical } from 'lucide-react';

function Chat({ conversations = [], conversation = null, messages = [], messagesLastReadAt = null, allUsers = [], usersToAdd = [] }) {
  const { auth } = usePage().props;
  const currentUserId = auth?.user?.id;
  const isAdmin = auth?.user?.role === 'admin';
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const [showAttachmentDropdown, setShowAttachmentDropdown] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState(null);
  const [showDeleteGroupConfirm, setShowDeleteGroupConfirm] = useState(false);
  const [showDeleteChatConfirm, setShowDeleteChatConfirm] = useState(false);
  const [editingGroupName, setEditingGroupName] = useState(false);
  const [groupNameValue, setGroupNameValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editingContent, setEditingContent] = useState('');
  const [messageMenuOpen, setMessageMenuOpen] = useState(null);
  const [optimisticallyDeletedIds, setOptimisticallyDeletedIds] = useState(new Set());
  const attachmentInputRef = useRef(null);
  const groupPhotoInputRef = useRef(null);

  // Clear optimistic delete state when messages change (server response)
  useEffect(() => {
    setOptimisticallyDeletedIds(new Set());
  }, [messages]);

  const updateGroupForm = useForm({
    name: '',
    image: null
  });
  
  // Ensure messages is always an array
  const messagesArray = Array.isArray(messages) ? messages : [];
  
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    image: null,
    participants: []
  });

  const addMembersForm = useForm({
    user_ids: []
  });

  // Helper function to check if attachment is an image
  const isImageFile = (filename) => {
    if (!filename) return false;
    const ext = filename.toLowerCase().split('.').pop();
    return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext);
  };

  // Helper to get document filename from path
  const getAttachmentFilename = (path) => {
    if (!path) return 'Document';
    return path.split('/').pop() || 'Document';
  };

  // Online status: user.is_online or last_seen within 5 minutes
  const isUserOnline = (user) => {
    if (!user) return false;
    if (user.is_online === true) return true;
    if (!user.last_seen) return false;
    const lastSeen = new Date(user.last_seen);
    return (Date.now() - lastSeen.getTime()) < 5 * 60 * 1000;
  };

  const groupMembers = conversation?.type === 'group' ? (conversation.users || []) : [];

  // Display name: private = other participant's name, group = group name
  const getConversationDisplayName = (conv) => {
    if (!conv) return 'Conversation';
    if (conv.type === 'group') return conv.name || 'Groupe';
    const otherUser = conv.users?.find((u) => u.id !== currentUserId) ?? conv.users?.[0];
    return otherUser?.name || 'Conversation';
  };

  // SEAAL: canEdit - message belongs to user AND is < 5 mins old
  const canEdit = (message) => {
    if (!message) return false;
    const msgUserId = message.user_id ?? message.user?.id;
    if (msgUserId !== currentUserId) return false;
    if (message.is_deleted_for_everyone) return false;
    const ageMs = Date.now() - new Date(message.created_at).getTime();
    return ageMs < 5 * 60 * 1000;
  };

  // SEAAL: canDeleteForEveryone - message belongs to user AND is < 10 mins old, OR user is Admin
  const canDeleteForEveryone = (message) => {
    if (!message) return false;
    if (isAdmin) return true;
    const msgUserId = message.user_id ?? message.user?.id;
    if (msgUserId !== currentUserId) return false;
    const ageMs = Date.now() - new Date(message.created_at).getTime();
    return ageMs < 10 * 60 * 1000;
  };

  // Filter conversations by partner/group name in real-time
  const filteredConversations = searchQuery.trim()
    ? conversations.filter((conv) => {
        const name = getConversationDisplayName(conv).toLowerCase();
        return name.includes(searchQuery.trim().toLowerCase());
      })
    : conversations;

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
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-bold text-xl text-seaal-dark font-sans">
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
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher une conversation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-seaal-dark focus:ring-2 focus:ring-seaal-dark/20 outline-none font-sans"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              {filteredConversations.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-gray-500 text-sm font-sans">
                    {searchQuery.trim() ? 'Aucun résultat' : 'Aucune conversation'}
                  </p>
                </div>
              ) : (
                filteredConversations.map((conv) => {
                  const isActive = conversation && conversation.id === conv.id;
                  const otherUser = conv.type === 'private' ? (conv.users?.[0]) : null;
                  const showOnline = otherUser && isUserOnline(otherUser);
                  const displayName = getConversationDisplayName(conv);
                  const unreadCount = conv.unread_count ?? 0;
                  const hasUnread = unreadCount > 0;
                  return (
                    <a
                      key={conv.id}
                      href={`/chat/${conv.id}`}
                      className={`block p-4 transition-all duration-200 rounded-lg mb-2 relative ${isActive
                        ? 'bg-blue-50 border-l-4 border-l-seaal-dark'
                        : 'hover:bg-gray-50'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        {conv.type === 'group' ? (
                          conv.image ? (
                            <div className="relative shrink-0">
                              <img
                                src={storageUrl(conv.image)}
                                alt={displayName}
                                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                                style={{ maxWidth: '48px', maxHeight: '48px' }}
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-seaal-dark flex items-center justify-center text-white font-bold text-lg shadow-sm shrink-0">
                              G
                            </div>
                          )
                        ) : (
                          <UserAvatar user={otherUser} size="lg" showOnline={showOnline} />
                        )}
                        <div className="flex-1 min-w-0">
                          <h4
                            className="text-sm font-bold text-gray-900 truncate font-sans"
                          >
                            {displayName}
                          </h4>
                          <p
                            className="text-xs text-gray-500 truncate font-medium font-sans"
                          >
                            {conv.type === 'group' ? 'Groupe' : 'Message direct'}
                          </p>
                        </div>
                        {hasUnread && (
                          <span className="absolute top-4 right-4 flex items-center justify-center min-w-[20px] h-[20px] px-1.5 bg-red-500 text-white text-[11px] font-bold rounded-full shrink-0" title={`${unreadCount} non lu(s)`}>
                            {unreadCount > 99 ? '99+' : unreadCount}
                          </span>
                        )}
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
                <div className="p-6 border-b border-gray-200 bg-white flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {conversation.type === 'group' ? (
                      conversation.image ? (
                        <img
                          src={storageUrl(conversation.image)}
                          alt={getConversationDisplayName(conversation)}
                          className="w-12 h-12 rounded-full object-cover border-2 border-seaal-dark"
                          style={{ maxWidth: '48px', maxHeight: '48px' }}
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-seaal-dark flex items-center justify-center text-white font-bold text-lg shrink-0">
                          G
                        </div>
                      )
                    ) : (
                      <UserAvatar
                        user={conversation.users?.find((u) => u.id !== currentUserId) ?? conversation.users?.[0]}
                        size="lg"
                        showOnline={isUserOnline(conversation.users?.find((u) => u.id !== currentUserId) ?? conversation.users?.[0])}
                      />
                    )}
                    <h3 className="text-lg font-bold text-seaal-dark font-sans">
                      {getConversationDisplayName(conversation)}
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowGroupInfo(true)}
                    className="p-2 rounded-lg text-seaal-dark hover:bg-gray-100 transition-colors"
                    title={conversation.type === 'group' ? 'Voir les membres du groupe' : 'Détails de la conversation'}
                  >
                    <Info size={22} />
                  </button>
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
                        const isUnread = !isMe && (
                          !messagesLastReadAt ||
                          new Date(message.created_at) > new Date(messagesLastReadAt)
                        );
                        const isDeleted = message.is_deleted_for_everyone || optimisticallyDeletedIds.has(message.id);
                        const isEditing = editingMessageId === message.id;
                        const hasActions = (canEdit(message) || canDeleteForEveryone(message) || message.can_delete_for_me) && !isDeleted;
                        return (
                          <div key={message.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''} group/message`}>
                            <UserAvatar
                              user={message.user}
                              size="md"
                              showOnline={!isMe && isUserOnline(message.user)}
                            />
                            <div className={`flex-1 ${isMe ? 'text-right' : ''} min-w-0`}>
                              {!isMe && (
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-sm font-semibold text-gray-900 font-sans">
                                    {message.user?.name || 'Utilisateur'}
                                  </span>
                                  {isUnread && (
                                    <span className="px-1.5 py-0.5 text-[10px] font-medium text-blue-600 bg-blue-50 rounded">
                                      Nouveau
                                    </span>
                                  )}
                                  {hasActions && (
                                    <div className="relative">
                                      <button
                                        type="button"
                                        onClick={() => setMessageMenuOpen(messageMenuOpen === message.id ? null : message.id)}
                                        className="p-1 rounded hover:bg-gray-200/80 text-gray-500 opacity-0 group-hover/message:opacity-100 transition-opacity"
                                        title="Actions"
                                      >
                                        <MoreVertical size={16} />
                                      </button>
                                      <AnimatePresence>
                                        {messageMenuOpen === message.id && (
                                          <>
                                            <div className="fixed inset-0 z-40" onClick={() => setMessageMenuOpen(null)} aria-hidden="true" />
                                            <motion.div
                                              initial={{ opacity: 0, y: -4 }}
                                              animate={{ opacity: 1, y: 0 }}
                                              exit={{ opacity: 0, y: -4 }}
                                              className="absolute left-0 top-6 z-50 py-1 bg-white rounded-lg shadow-lg border border-gray-200 min-w-[180px]"
                                            >
                                              {message.can_delete_for_everyone && (
                                                <button
                                                  type="button"
                                                  onClick={() => {
                                                    if (window.confirm('Supprimer ce message pour tout le monde ?')) {
                                                      setOptimisticallyDeletedIds((prev) => new Set(prev).add(message.id));
                                                      setMessageMenuOpen(null);
                                                      router.delete(`/chat/messages/${message.id}?for_everyone=1`, {
                                                        preserveScroll: true,
                                                        onError: () => setOptimisticallyDeletedIds((prev) => {
                                                          const next = new Set(prev);
                                                          next.delete(message.id);
                                                          return next;
                                                        }),
                                                      });
                                                    } else {
                                                      setMessageMenuOpen(null);
                                                    }
                                                  }}
                                                  className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50 text-red-600"
                                                >
                                                  <Trash2 size={14} /> Supprimer pour tout le monde
                                                </button>
                                              )}
                                            </motion.div>
                                          </>
                                        )}
                                      </AnimatePresence>
                                    </div>
                                  )}
                                  <span className="text-xs text-gray-500 font-sans">
                                    {new Date(message.created_at).toLocaleTimeString('fr-FR', {
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                    {message.edited_at && (
                                      <span className="italic ml-1">(édité)</span>
                                    )}
                                  </span>
                                </div>
                              )}
                              {isMe && (
                                <div className="flex items-center justify-end gap-2 mb-1">
                                  {hasActions && (
                                    <div className="relative">
                                      <button
                                        type="button"
                                        onClick={() => setMessageMenuOpen(messageMenuOpen === message.id ? null : message.id)}
                                        className="p-1 rounded hover:bg-gray-200/80 text-gray-500 opacity-0 group-hover/message:opacity-100 transition-opacity"
                                        title="Actions"
                                      >
                                        <MoreVertical size={16} />
                                      </button>
                                      <AnimatePresence>
                                        {messageMenuOpen === message.id && (
                                          <>
                                            <div className="fixed inset-0 z-40" onClick={() => setMessageMenuOpen(null)} aria-hidden="true" />
                                            <motion.div
                                              initial={{ opacity: 0, y: -4 }}
                                              animate={{ opacity: 1, y: 0 }}
                                              exit={{ opacity: 0, y: -4 }}
                                              className="absolute right-0 top-6 z-50 py-1 bg-white rounded-lg shadow-lg border border-gray-200 min-w-[180px]"
                                            >
                                              {canEdit(message) && (
                                                <button
                                                  type="button"
                                                  onClick={() => {
                                                    setEditingMessageId(message.id);
                                                    setEditingContent(message.content || '');
                                                    setMessageMenuOpen(null);
                                                  }}
                                                  className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50 text-gray-700"
                                                >
                                                  <Pencil size={14} /> Modifier
                                                </button>
                                              )}
                                              {message.can_delete_for_everyone && (
                                                <button
                                                  type="button"
                                                  onClick={() => {
                                                    if (window.confirm('Supprimer ce message pour tout le monde ?')) {
                                                      setOptimisticallyDeletedIds((prev) => new Set(prev).add(message.id));
                                                      setMessageMenuOpen(null);
                                                      router.delete(`/chat/messages/${message.id}?for_everyone=1`, {
                                                        preserveScroll: true,
                                                        onError: () => setOptimisticallyDeletedIds((prev) => {
                                                          const next = new Set(prev);
                                                          next.delete(message.id);
                                                          return next;
                                                        }),
                                                      });
                                                    } else {
                                                      setMessageMenuOpen(null);
                                                    }
                                                  }}
                                                  className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50 text-red-600"
                                                >
                                                  <Trash2 size={14} /> Supprimer pour tout le monde
                                                </button>
                                              )}
                                              {message.can_delete_for_me && (
                                                <button
                                                  type="button"
                                                  onClick={() => {
                                                    if (window.confirm('Supprimer ce message pour vous uniquement ?')) {
                                                      setMessageMenuOpen(null);
                                                      router.delete(`/chat/messages/${message.id}`, { preserveScroll: true });
                                                    } else {
                                                      setMessageMenuOpen(null);
                                                    }
                                                  }}
                                                  className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50 text-gray-700"
                                                >
                                                  <Trash2 size={14} /> Supprimer pour moi
                                                </button>
                                              )}
                                            </motion.div>
                                          </>
                                        )}
                                      </AnimatePresence>
                                    </div>
                                  )}
                                  <span className="text-xs text-gray-500" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                                    {new Date(message.created_at).toLocaleTimeString('fr-FR', {
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                    {message.edited_at && (
                                      <span className="italic ml-1">(édité)</span>
                                    )}
                                  </span>
                                </div>
                              )}
                              {!isMe && message.edited_at && (
                                <span className="text-xs text-gray-400 italic ml-1">(édité)</span>
                              )}
                              <div className={`inline-block ${isMe ? 'bg-[#E6F0FF] border border-blue-100' : 'bg-white border border-gray-200'} px-4 py-3 rounded-2xl shadow-sm ${isMe ? 'rounded-br-none' : 'rounded-bl-none'}`}>
                                {isEditing ? (
                                  <form
                                    onSubmit={(e) => {
                                      e.preventDefault();
                                      router.put(`/chat/messages/${message.id}`, { content: editingContent }, {
                                        onSuccess: () => { setEditingMessageId(null); setEditingContent(''); }
                                      });
                                    }}
                                    className="flex gap-2"
                                  >
                                    <input
                                      type="text"
                                      value={editingContent}
                                      onChange={(e) => setEditingContent(e.target.value)}
                                      className="flex-1 px-3 py-2 border rounded-lg text-sm"
                                      autoFocus
                                    />
                                    <button type="submit" className="px-3 py-1 bg-seaal-dark text-white rounded-lg text-sm">Enregistrer</button>
                                    <button type="button" onClick={() => { setEditingMessageId(null); setEditingContent(''); }} className="px-3 py-1 bg-gray-200 rounded-lg text-sm">Annuler</button>
                                  </form>
                                ) : isDeleted ? (
                                  <p className="text-sm text-gray-400 italic font-sans">
                                    Message deleted
                                  </p>
                                ) : (
                                  <>
                                    {message.content && (
                                      <p className="text-sm text-gray-700 leading-relaxed" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
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
                                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-sm font-medium text-seaal-dark"
                                            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                                          >
                                            <FileText size={18} className="text-seaal-dark shrink-0" />
                                            <span className="truncate max-w-[180px]">{getAttachmentFilename(message.attachment)}</span>
                                            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                            </svg>
                                          </a>
                                        )}
                                      </div>
                                    )}
                                  </>
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
                <div className="p-6 border-t border-gray-200 bg-white relative">
                  <form method="POST" action={`/chat/${conversation.id}`} encType="multipart/form-data" onSubmit={() => setSelectedFileName(null)}>
                    <input type="hidden" name="_token" value={document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')} />
                    <div className="flex flex-col gap-2">
                    <div className="flex gap-3 items-center">
                      <input
                        type="text"
                        name="content"
                        placeholder="Tapez votre message..."
                        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-seaal-dark focus:ring-4 focus:ring-seaal-dark/20 outline-none transition-all font-sans"
                      />
                      {/* Attachment button with dropdown */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setShowAttachmentDropdown(!showAttachmentDropdown)}
                          className="p-3 rounded-xl text-seaal-dark hover:bg-gray-100 transition-colors border-2 border-gray-200 hover:border-seaal-dark/30"
                          title="Joindre un fichier"
                        >
                          <Paperclip size={22} />
                        </button>
                        <AnimatePresence>
                          {showAttachmentDropdown && (
                            <>
                              <div
                                className="fixed inset-0 z-40"
                                onClick={() => setShowAttachmentDropdown(false)}
                                aria-hidden="true"
                              />
                              <motion.div
                                initial={{ opacity: 0, y: 4, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 4, scale: 0.95 }}
                                className="absolute bottom-full left-0 mb-2 z-50 bg-white rounded-xl shadow-lg border-2 border-gray-100 py-2 min-w-[160px]"
                              >
                                <button
                                  type="button"
                                  onClick={() => {
                                    const input = attachmentInputRef.current;
                                    if (input) {
                                      input.accept = 'image/*';
                                      input.value = '';
                                      input.click();
                                    }
                                    setShowAttachmentDropdown(false);
                                  }}
                                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left font-sans"
                                >
                                  <Image size={20} className="text-seaal-green" />
                                  <span>Photo</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const input = attachmentInputRef.current;
                                    if (input) {
                                      input.accept = '.pdf,.doc,.docx';
                                      input.value = '';
                                      input.click();
                                    }
                                    setShowAttachmentDropdown(false);
                                  }}
                                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left font-sans"
                                >
                                  <FileText size={20} className="text-seaal-dark" />
                                  <span>Document</span>
                                </button>
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                        <input
                          ref={attachmentInputRef}
                          type="file"
                          name="attachment"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            setSelectedFileName(file?.name || null);
                          }}
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-6 py-3 bg-seaal-dark text-white rounded-xl font-semibold hover:bg-opacity-90 transition-colors font-sans"
                      >
                        Envoyer
                      </button>
                    </div>
                    {selectedFileName && (
                      <p className="text-xs text-gray-500 font-sans flex items-center gap-2">
                        <Paperclip size={14} />
                        {selectedFileName}
                      </p>
                    )}
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

        {/* Info Sidebar - for both private and group chats */}
        <AnimatePresence>
          {showGroupInfo && conversation && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowGroupInfo(false)}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              />
              <motion.div
                initial={{ x: 320, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 320, opacity: 0 }}
                transition={{ type: 'tween', duration: 0.2 }}
                className="fixed right-0 top-0 bottom-0 w-80 max-w-[90vw] bg-white shadow-2xl z-50 flex flex-col"
              >
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-xl font-bold text-seaal-dark font-sans">
                    {conversation.type === 'group' ? 'Membres du groupe' : 'Détails de la conversation'}
                  </h3>
                  <button
                    onClick={() => setShowGroupInfo(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {conversation.type === 'private' ? (
                  /* Private chat: show other user info + Supprimer la conversation */
                  <>
                    {(() => {
                      const otherUser = conversation.users?.find((u) => u.id !== currentUserId) ?? conversation.users?.[0];
                      if (!otherUser) return null;
                      return (
                        <div className="flex flex-col items-center">
                          <Link
                            href={`/users/${otherUser.id}`}
                            className="flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-gray-50 transition-colors w-full"
                          >
                            <div className="relative shrink-0">
                              {otherUser.profile_photo ? (
                                <img
                                  src={storageUrl(otherUser.profile_photo)}
                                  alt={otherUser.name}
                                  className="w-20 h-20 rounded-full object-cover border-4 border-seaal-dark"
                                />
                              ) : (
                                <div className="w-20 h-20 rounded-full bg-seaal-dark flex items-center justify-center text-white text-2xl font-bold border-4 border-seaal-dark">
                                  {otherUser.name?.charAt(0) || 'U'}
                                </div>
                              )}
                              {isUserOnline(otherUser) && (
                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                              )}
                            </div>
                            <h4 className="text-lg font-bold text-seaal-dark font-sans">{otherUser.name}</h4>
                            <span className="text-sm text-gray-500">Voir le profil</span>
                          </Link>
                          <div className="w-full pt-6 border-t border-gray-200 mt-4">
                            <button
                              type="button"
                              onClick={() => setShowDeleteChatConfirm(true)}
                              className="w-full flex items-center justify-center gap-2 py-3 text-red-600 hover:bg-red-50 rounded-xl font-semibold text-sm transition-colors"
                            >
                              <Trash2 size={18} />
                              Supprimer la conversation
                            </button>
                          </div>
                        </div>
                      );
                    })()}
                  </>
                  ) : (
                  /* Group chat: existing group sidebar content */
                  <>
                  {/* Group header - editable for admin */}
                  <div className="flex flex-col items-center pb-6 border-b border-gray-200">
                    <div className="relative group">
                      {conversation.image ? (
                        <img
                          src={storageUrl(conversation.image)}
                          alt={conversation.name}
                          className="w-20 h-20 rounded-full object-cover border-4 border-seaal-dark"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-seaal-green flex items-center justify-center text-white text-2xl font-bold border-4 border-seaal-dark">
                          {conversation.name?.charAt(0) || 'G'}
                        </div>
                      )}
                      {isAdmin && (
                        <>
                          <input
                            ref={groupPhotoInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                updateGroupForm.setData('name', conversation.name);
                                updateGroupForm.setData('image', file);
                                updateGroupForm.submit('put', `/chat/group/${conversation.id}`, {
                                  forceFormData: true,
                                  onSuccess: () => setShowGroupInfo(false)
                                });
                              }
                              e.target.value = '';
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => groupPhotoInputRef.current?.click()}
                            className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Changer la photo"
                          >
                            <Pencil size={20} className="text-white" />
                          </button>
                        </>
                      )}
                    </div>
                    {isAdmin && editingGroupName ? (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (groupNameValue.trim()) {
                            router.put(`/chat/group/${conversation.id}`, { name: groupNameValue.trim() }, {
                              onSuccess: () => {
                                setEditingGroupName(false);
                                setGroupNameValue('');
                              }
                            });
                          }
                        }}
                        className="w-full mt-3"
                      >
                        <input
                          type="text"
                          value={groupNameValue}
                          onChange={(e) => setGroupNameValue(e.target.value)}
                          className="w-full px-3 py-2 border-2 border-seaal-dark rounded-lg text-center font-semibold text-seaal-dark"
                          placeholder="Nom du groupe"
                          autoFocus
                        />
                        <div className="flex gap-2 mt-2">
                          <button type="submit" className="flex-1 py-1.5 bg-seaal-green text-white rounded-lg text-sm font-medium">Enregistrer</button>
                          <button type="button" onClick={() => { setEditingGroupName(false); setGroupNameValue(''); }} className="flex-1 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium">Annuler</button>
                        </div>
                      </form>
                    ) : (
                      <div className="flex items-center gap-2 mt-3">
                        <h4 className="text-lg font-bold text-seaal-dark font-sans">{conversation.name}</h4>
                        {isAdmin && (
                          <button
                            type="button"
                            onClick={() => {
                              setGroupNameValue(conversation.name || '');
                              setEditingGroupName(true);
                            }}
                            className="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-seaal-dark"
                            title="Modifier le nom"
                          >
                            <Pencil size={14} />
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Group members list */}
                  <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 font-sans">
                      Membres ({groupMembers.length})
                    </h4>
                    <div className="space-y-2">
                      {groupMembers.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center gap-2 rounded-lg group/member"
                        >
                          <Link
                            href={`/users/${member.id}`}
                            className="flex items-center gap-3 flex-1 min-w-0 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <div className="relative shrink-0">
                              {member.profile_photo ? (
                                <img
                                  src={storageUrl(member.profile_photo)}
                                  alt={member.name}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-seaal-dark flex items-center justify-center text-white text-sm font-bold">
                                  {member.name?.charAt(0) || 'U'}
                                </div>
                              )}
                              {isUserOnline(member) && (
                                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{member.name}</p>
                              {member.role === 'admin' && (
                                <span className="text-xs text-gray-500">Admin</span>
                              )}
                            </div>
                          </Link>
                          {isAdmin && member.id !== currentUserId && (
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`Retirer ${member.name} du groupe ?`)) {
                                  router.delete(`/chat/group/${conversation.id}/members/${member.id}`, {
                                    onSuccess: () => setShowGroupInfo(false)
                                  });
                                }
                              }}
                              className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 opacity-0 group-hover/member:opacity-100 transition-opacity"
                              title="Retirer du groupe"
                            >
                              <UserMinus size={16} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Ajouter Member - Admin only */}
                  {isAdmin && usersToAdd.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 font-sans">
                        Ajouter un membre
                      </h4>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (addMembersForm.data.user_ids.length === 0) return;
                          addMembersForm.post(`/chat/group/${conversation.id}/add-members`, {
                            onSuccess: () => {
                              setShowGroupInfo(false);
                              addMembersForm.reset();
                            },
                            onError: (err) => console.error('Add members error:', err)
                          });
                        }}
                        className="space-y-3"
                      >
                        <div className="max-h-40 overflow-y-auto border-2 border-gray-200 rounded-xl p-3 space-y-2 scrollbar-hide">
                          {usersToAdd.map((user) => (
                            <label
                              key={user.id}
                              className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={addMembersForm.data.user_ids.includes(user.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    addMembersForm.setData('user_ids', [...addMembersForm.data.user_ids, user.id]);
                                  } else {
                                    addMembersForm.setData('user_ids', addMembersForm.data.user_ids.filter(id => id !== user.id));
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
                        <button
                          type="submit"
                          disabled={addMembersForm.processing || addMembersForm.data.user_ids.length === 0}
                          className="w-full px-4 py-2.5 bg-seaal-green text-white rounded-xl font-semibold hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-sans text-sm"
                        >
                          {addMembersForm.processing ? 'Ajout...' : 'Ajouter les membres'}
                        </button>
                      </form>
                    </div>
                  )}

                  {/* Supprimer le groupe - Admin only */}
                  {isAdmin && (
                    <div className="pt-4 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={() => setShowDeleteGroupConfirm(true)}
                        className="w-full flex items-center justify-center gap-2 py-3 text-red-600 hover:bg-red-50 rounded-xl font-semibold text-sm transition-colors"
                      >
                        <Trash2 size={18} />
                        Supprimer le groupe
                      </button>
                    </div>
                  )}
                  </>
                  )}
                </div>
              </motion.div>

              {/* Delete Private Chat Confirmation Modal */}
              {conversation.type === 'private' && (
              <AnimatePresence>
                {showDeleteChatConfirm && (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setShowDeleteChatConfirm(false)}
                      className="fixed inset-0 bg-black/50 z-[60]"
                    />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
                    >
                      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
                        <h4 className="text-lg font-bold text-seaal-dark mb-2 font-sans">Supprimer la conversation ?</h4>
                        <p className="text-sm text-gray-600 mb-6 font-sans">
                          Cette conversation sera supprimée de votre liste. L&apos;autre personne pourra toujours la voir.
                        </p>
                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => setShowDeleteChatConfirm(false)}
                            className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 font-sans"
                          >
                            Annuler
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              router.delete(`/chat/${conversation.id}/leave`, {
                                onSuccess: () => {
                                  setShowDeleteChatConfirm(false);
                                  setShowGroupInfo(false);
                                }
                              });
                            }}
                            className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 font-sans"
                          >
                            Supprimer
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
              )}

              {/* Delete Group Confirmation Modal */}
              <AnimatePresence>
                {showDeleteGroupConfirm && (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setShowDeleteGroupConfirm(false)}
                      className="fixed inset-0 bg-black/50 z-[60]"
                    />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
                    >
                      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
                        <h4 className="text-lg font-bold text-seaal-dark mb-2 font-sans">Supprimer le groupe ?</h4>
                        <p className="text-sm text-gray-600 mb-6 font-sans">
                          Cette action est irréversible. Tous les messages et membres seront supprimés.
                        </p>
                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => setShowDeleteGroupConfirm(false)}
                            className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 font-sans"
                          >
                            Annuler
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              router.delete(`/chat/${conversation.id}`, {
                                onSuccess: () => {
                                  setShowDeleteGroupConfirm(false);
                                  setShowGroupInfo(false);
                                }
                              });
                            }}
                            className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 font-sans"
                          >
                            Supprimer
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </MainLayout>
  );
}

export default Chat;

import React, { useState } from 'react';

// SEAAL: user.profile_photo ? '/storage/' + user.profile_photo : '/default-avatar.png'
const DEFAULT_AVATAR = '/default-avatar.svg';

/**
 * Avatar URL: profile_photo with /storage/ prefix, or default.
 * SEAAL: user.profile_photo ? '/storage/' + user.profile_photo : '/default-avatar.png'
 */
function getAvatarUrl(user) {
  const path = user?.profile_photo || user?.avatar;
  if (!path || typeof path !== 'string') return DEFAULT_AVATAR;
  const trimmed = path.trim();
  if (!trimmed) return DEFAULT_AVATAR;
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/')) return trimmed;
  return '/storage/' + (trimmed.startsWith('/') ? trimmed.slice(1) : trimmed);
}

/**
 * UserAvatar - Displays user avatar with fallback for null/broken images.
 * Uses: user.avatar ? '/storage/' + user.avatar : '/images/default-avatar.svg'
 *
 * @param {Object} user - User object with name, profile_photo, or avatar
 * @param {string} size - 'sm' | 'md' | 'lg' (default: 'md')
 * @param {string} className - Additional CSS classes
 * @param {boolean} showOnline - Show green dot if user is online
 */
export default function UserAvatar({ user, size = 'md', className = '', showOnline = false }) {
  const [imgError, setImgError] = useState(false);
  const photoPath = user?.profile_photo ?? null;
  const displayName = user?.name || 'User';
  const initial = displayName.charAt(0).toUpperCase() || 'U';

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-lg',
  };
  const sizeStyle = {
    sm: { maxWidth: '32px', maxHeight: '32px' },
    md: { maxWidth: '40px', maxHeight: '40px' },
    lg: { maxWidth: '48px', maxHeight: '48px' },
  };

  const showImage = photoPath && !imgError;
  const imageUrl = showImage ? getAvatarUrl(user) : DEFAULT_AVATAR;

  return (
    <div className={`relative shrink-0 ${className}`}>
      {showImage ? (
        <img
          src={imageUrl}
          alt={displayName}
          className={`rounded-full object-cover border-2 border-white shadow-sm ${sizeClasses[size]}`}
          style={sizeStyle[size]}
          onError={() => setImgError(true)}
        />
      ) : (
        <div
          className={`rounded-full bg-seaal-dark flex items-center justify-center text-white font-bold shadow-sm ${sizeClasses[size]}`}
          style={sizeStyle[size]}
          aria-label={displayName}
        >
          {initial}
        </div>
      )}
      {showOnline && (
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
      )}
    </div>
  );
}

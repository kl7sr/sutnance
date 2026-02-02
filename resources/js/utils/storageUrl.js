/**
 * Generate a URL for a storage file (React helper)
 * This mirrors the PHP storageUrl() helper function
 * 
 * @param {string|null} path - The storage path (e.g., 'profile_photos/user.jpg')
 * @returns {string} - The full URL to the storage file
 */
export const storageUrl = (path) => {
    if (!path) {
        return '';
    }
    
    // If path already starts with http or /storage, return as is
    if (path.startsWith('http') || path.startsWith('/storage')) {
        return path;
    }
    
    // Otherwise, prepend /storage/ to the path
    return `/storage/${path}`;
};

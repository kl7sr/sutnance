/**
 * Generate a URL for a storage file (React helper)
 * Mirrors PHP asset('storage/' . path) for correct asset loading.
 *
 * @param {string|null} path - The storage path (e.g., 'profile_photos/user.jpg')
 * @returns {string} - The full storage URL (e.g., /storage/profile_photos/user.jpg)
 */
export const storageUrl = (path) => {
    if (!path || typeof path !== 'string') {
        return '';
    }
    const trimmed = path.trim();
    if (!trimmed) return '';

    // Already a full URL
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
        return trimmed;
    }
    // Already has /storage/ prefix
    if (trimmed.startsWith('/storage/')) {
        return trimmed;
    }
    // Remove leading slash from path to avoid double slashes
    const cleanPath = trimmed.startsWith('/') ? trimmed.slice(1) : trimmed;
    return `/storage/${cleanPath}`;
};

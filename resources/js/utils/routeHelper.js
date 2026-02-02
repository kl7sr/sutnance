/**
 * Safe route helper that checks if Ziggy routes are available
 * Falls back to standard paths if routes are not loaded
 */
export const safeRoute = (routeName, fallback = '#') => {
  try {
    // Check if route function exists and routes are loaded
    if (typeof window.route === 'function') {
      // Check if the route exists by trying to access it
      if (window.route().has && window.route().has(routeName)) {
        return window.route(routeName);
      }
      // If has() doesn't exist, try to call route directly
      try {
        return window.route(routeName);
      } catch (e) {
        console.warn(`Route "${routeName}" not found, using fallback:`, fallback);
        return fallback;
      }
    }
    // If route is not a function, use fallback
    return fallback;
  } catch (error) {
    console.warn(`Error accessing route "${routeName}":`, error);
    return fallback;
  }
};

/**
 * Check if a route exists
 */
export const hasRoute = (routeName) => {
  try {
    if (typeof window.route === 'function' && window.route().has) {
      return window.route().has(routeName);
    }
    return false;
  } catch (error) {
    return false;
  }
};

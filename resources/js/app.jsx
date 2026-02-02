import '../css/app.css';
import React from 'react';
import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';

// Initialize Ziggy route function
// The @routes directive in app.blade.php creates window.Ziggy
// We initialize the route function when DOM is ready
const initZiggy = () => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setupZiggy();
    });
  } else {
    setupZiggy();
  }
};

const setupZiggy = () => {
  // Wait a moment for @routes script to execute
  setTimeout(() => {
    if (typeof window.Ziggy !== 'undefined') {
      try {
        // Import and setup ziggy-js
        import('ziggy-js').then(({ route }) => {
          window.route = route;
        }).catch(() => {
          createFallbackRoute();
        });
      } catch (e) {
        createFallbackRoute();
      }
    } else {
      // Ziggy not loaded, create fallback
      createFallbackRoute();
    }
  }, 50);
};

// Create a fallback route function that converts route names to paths
const createFallbackRoute = () => {
  window.route = (name, params = {}) => {
    // Convert route name to path (e.g., 'users.index' -> '/users')
    const parts = name.split('.');
    if (parts.length > 1 && parts[1] === 'index') {
      return `/${parts[0]}`;
    }
    return `/${parts.join('/')}`;
  };
};

// Initialize Ziggy
initZiggy();

// Dynamically import all page components using import.meta.glob
const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true });

// Helper function to resolve page components
const resolvePageComponent = (path, pagesMap) => {
    if (pagesMap[path]) {
        const module = pagesMap[path];
        return module.default || module;
    }
    return null;
};

createInertiaApp({
    resolve: (name) => {
        // Resolve from Pages directory (standard Inertia convention)
        const pagePath = `./Pages/${name}.jsx`;
        const component = resolvePageComponent(pagePath, pages);
        
        if (component) {
            return component;
        }
        
        throw new Error(`Component "${name}" not found in Pages directory. Tried: ${pagePath}`);
    },
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(<App {...props} />);
    },
});

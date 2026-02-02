import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('user-create-root');
if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
        <App />
    );
}
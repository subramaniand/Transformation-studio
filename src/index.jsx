import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

console.log('%c Starting Transformation Studio', 'color: #00d4ff; font-size: 16px; font-weight: bold;');

const rootEl = document.getElementById('root');
const loadingEl = document.getElementById('loading');

if (!rootEl) {
  console.error('Root element not found!');
  if (loadingEl) loadingEl.innerHTML = '<div style="color: red; padding: 40px;">ERROR: root element not found</div>';
} else {
  try {
    console.log('Creating React root...');
    const root = ReactDOM.createRoot(rootEl);

    console.log('Rendering App component...');
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );

    // Remove loading div after React renders
    if (loadingEl) {
      loadingEl.style.display = 'none';
    }

    console.log('%c ✓ App rendered successfully!', 'color: #27ae60; font-size: 14px; font-weight: bold;');
  } catch (error) {
    console.error('Error rendering app:', error);
    if (loadingEl) {
      loadingEl.innerHTML = '<div style="color: #ff7070; padding: 40px; font-family: monospace; white-space: pre-wrap; overflow: auto;">' +
        'ERROR: ' + error.message + '\n\n' + error.stack + '</div>';
    }
  }
}

// Global error handler
window.addEventListener('error', (event) => {
  console.error('Uncaught error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

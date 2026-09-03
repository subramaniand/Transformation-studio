import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

const root = document.getElementById('root');

if (!root) {
  console.error('❌ Root element not found!');
  document.body.innerHTML = '<div style="color: red; padding: 20px;">ERROR: Root element not found</div>';
} else {
  console.log('✓ Root element found, rendering app...');
  try {
    ReactDOM.createRoot(root).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    );
    console.log('✓ App rendered successfully');
  } catch (err) {
    console.error('❌ Error rendering app:', err);
    document.body.innerHTML = '<div style="color: red; padding: 20px; font-family: monospace;">ERROR: ' + err.message + '</div>';
  }
}

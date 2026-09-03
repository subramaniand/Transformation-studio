import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

console.log('Starting app...');

try {
  const root = document.getElementById('root');
  console.log('Root element:', root ? 'found' : 'NOT FOUND');

  if (!root) {
    throw new Error('Root element not found');
  }

  console.log('Creating React root...');
  const reactRoot = ReactDOM.createRoot(root);

  console.log('Rendering App...');
  reactRoot.render(<App />);

  console.log('✓ App rendered');
} catch (err) {
  console.error('FATAL ERROR:', err);
  document.body.innerHTML = '<div style="color: red; padding: 40px; font-family: monospace; white-space: pre-wrap;">' + err.message + '\n\n' + err.stack + '</div>';
}

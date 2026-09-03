import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

console.log('1. index.jsx loaded');

async function main() {
  const root = document.getElementById('root');
  const loading = document.getElementById('loading');

  if (!root) {
    console.error('❌ Root element not found!');
    document.body.innerHTML = '<div style="color: red; padding: 20px;">ERROR: Root element not found</div>';
    return;
  }

  console.log('2. Root element found');

  try {
    console.log('3. Creating React root...');
    const reactRoot = ReactDOM.createRoot(root);
    console.log('4. React root created');

    console.log('5. Rendering App...');
    reactRoot.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    );
    console.log('✓ App rendered successfully');

    if (loading) loading.style.display = 'none';
  } catch (err) {
    console.error('❌ Error:', err);
    const errMsg = err?.message || String(err);
    console.error('Full error:', err.stack);

    if (loading) {
      loading.innerHTML = '<div style="color: #ff7070; padding: 20px; font-family: monospace; white-space: pre-wrap; overflow: auto; max-height: 80vh;">ERROR: ' + errMsg + '\n\n' + (err.stack || '') + '</div>';
      loading.style.display = 'block';
    }
  }
}

console.log('0. Starting app initialization');
main().catch(err => {
  console.error('Fatal error:', err);
  document.body.innerHTML = '<div style="color: #ff7070; padding: 20px; font-family: monospace;">FATAL ERROR: ' + (err?.message || String(err)) + '</div>';
});

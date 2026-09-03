import { useState, useEffect } from 'react';
import './App.css';

// Simple error boundary
function ErrorBoundary({ children }) {
  const [error, setError] = useState(null);

  useEffect(() => {
    const errorHandler = (event) => {
      console.error('Error caught:', event.error);
      setError(event.error?.message || 'Unknown error');
    };

    window.addEventListener('error', errorHandler);
    return () => window.removeEventListener('error', errorHandler);
  }, []);

  if (error) {
    return (
      <div style={{
        background: '#0f1419',
        color: '#ff7070',
        padding: '20px',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'monospace',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word'
      }}>
        <div style={{ maxWidth: '600px' }}>
          <h2>ERROR: {error}</h2>
          <button onClick={() => window.location.reload()} style={{
            marginTop: '20px',
            padding: '10px 20px',
            background: '#004b87',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}>
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return children;
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('App: Initializing...');

    try {
      // Test basic imports
      console.log('1. Testing imports...');

      // Simulate async loading
      setTimeout(() => {
        console.log('2. App initialized successfully');
        setLoading(false);
      }, 100);
    } catch (err) {
      console.error('Error during init:', err);
      setError(err.message);
      setLoading(false);
    }
  }, []);

  if (error) {
    return (
      <div style={{
        background: '#0f1419',
        color: '#ff7070',
        padding: '40px',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
      }}>
        <div>
          <h1>Error Loading App</h1>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} style={{
            marginTop: '20px',
            padding: '10px 20px',
            background: '#004b87',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}>
            Reload
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{
        background: '#0f1419',
        color: '#e0e0f0',
        padding: '40px',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
      }}>
        <div>
          <h1>Transformation Studio</h1>
          <p>Loading application...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div style={{
        background: '#0f1419',
        color: '#e0e0f0',
        minHeight: '100vh',
        padding: '40px',
        textAlign: 'center'
      }}>
        <h1>✓ App Loaded Successfully!</h1>
        <p>React is working. Components are next...</p>
        <button onClick={() => window.location.reload()} style={{
          marginTop: '20px',
          padding: '10px 20px',
          background: '#004b87',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}>
          Reload
        </button>
      </div>
    </ErrorBoundary>
  );
}

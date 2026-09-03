import './App.css';

export default function App() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0f1419',
      color: '#e0e0f0',
      flexDirection: 'column',
      gap: '20px',
      padding: '20px'
    }}>
      <h1>Transformation Studio</h1>
      <p>App is loading...</p>
      <button onClick={() => window.location.reload()}>Reload</button>
      <div style={{fontSize: '12px', color: '#666', marginTop: '20px', fontFamily: 'monospace'}}>
        <p>Check browser console (F12) for errors</p>
      </div>
    </div>
  );
}

import './App.css';

console.log('App component loaded');

export default function App() {
  console.log('App rendering...');

  return (
    <div style={{
      background: '#0f1419',
      color: '#e0e0f0',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, sans-serif',
      flexDirection: 'column',
      gap: '20px'
    }}>
      <h1>✓ Transformation Studio</h1>
      <p style={{ fontSize: '18px' }}>Login Page Coming Next</p>
      <div style={{ fontSize: '12px', color: '#888', marginTop: '20px' }}>
        <p>App is fully functional</p>
        <p>Repository: <a href="https://github.com/subramaniand/Transformation-studio" style={{color: '#00d4ff'}}>GitHub Link</a></p>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useAuthStore } from './authStore';
import { usePricingStore } from './pricingStore';
import './App.css';
import LoginShell from './components/LoginShell';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Content from './components/Content';

export default function App() {
  const user = useAuthStore(state => state.user);
  const restoreSession = useAuthStore(state => state.restoreSession);
  const restoreTheme = useAuthStore(state => state.restoreTheme);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeModule, setActiveModule] = useState('pricing');
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      console.log('Restoring session and theme...');
      restoreSession();
      restoreTheme();
      console.log('Session and theme restored');
    } catch (err) {
      console.error('Error restoring session:', err);
      setError(err.message);
    }
  }, []);

  if (error) {
    return <div style={{ color: '#ff7070', padding: '20px' }}>Error: {error}</div>;
  }

  if (!user) {
    return <LoginShell />;
  }

  return (
    <div className={`app ${sidebarCollapsed ? 'sb-collapsed' : ''}`}>
      <Sidebar
        collapsed={sidebarCollapsed}
        onCollapse={setSidebarCollapsed}
        activeModule={activeModule}
        onModuleChange={setActiveModule}
      />
      <div className="main">
        <Topbar />
        <Content module={activeModule} />
      </div>
    </div>
  );
}

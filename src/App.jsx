import { useState } from 'react';
import { useAuthStore } from './authStore';
import { ModalProvider } from './context/ModalContext';
import './App.css';
import LoginShell from './components/LoginShell';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Content from './components/Content';

export default function App() {
  const user = useAuthStore(state => state.user);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeModule, setActiveModule] = useState('pricing');

  if (!user) {
    return <LoginShell />;
  }

  return (
    <ModalProvider>
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
    </ModalProvider>
  );
}

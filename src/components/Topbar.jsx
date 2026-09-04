import { useAuthStore } from '../authStore';
import { usePricingStore } from '../pricingStore';

export default function Topbar({ module }) {
  const theme = useAuthStore(state => state.theme);
  const setTheme = useAuthStore(state => state.setTheme);
  const currentView = usePricingStore(state => state.currentView);
  const setView = usePricingStore(state => state.setView);

  return (
    <div className="topbar">
      <div className="tb-l">
        <div className="tb-title" id="tb-title">Select a catalogue</div>
        <div className="tb-sub" id="tb-sub">Choose from the sidebar or create one</div>
      </div>

      <div id="db-status" style={{ display: 'flex', gap: '5px' }} />

      <div className="theme-switcher">
        <span style={{ fontSize: '11px', color: 'var(--tx2)' }}>Theme:</span>
        <button
          className={`theme-btn ${theme === 'default' ? 'active' : ''}`}
          onClick={() => setTheme('default')}
          title="Default"
        >
          ◐
        </button>
        <button
          className={`theme-btn ${theme === 'ust-light' ? 'active' : ''}`}
          onClick={() => setTheme('ust-light')}
          title="UST Light"
        >
          ☀
        </button>
        <button
          className={`theme-btn ${theme === 'ust-dark' ? 'active' : ''}`}
          onClick={() => setTheme('ust-dark')}
          title="UST Dark"
        >
          ◑
        </button>
      </div>

      {module === 'pricing' && (
        <div className="pill-nav" id="pricing-pills">
          <button className={`pv ${currentView === 'parameters' ? 'on' : ''}`} onClick={() => setView('parameters')}>Parameters</button>
          <button className={`pv ${currentView === 'estimate' ? 'on' : ''}`} onClick={() => setView('estimate')}>Estimate</button>
          <button className={`pv ${currentView === 'json' ? 'on' : ''}`} onClick={() => setView('json')}>JSON</button>
        </div>
      )}

      <button className="tbtn pri" id="export-btn">Export JSON</button>
    </div>
  );
}

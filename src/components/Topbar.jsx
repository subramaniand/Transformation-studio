import { useAuthStore } from '../authStore';

export default function Topbar() {
  const theme = useAuthStore(state => state.theme);
  const setTheme = useAuthStore(state => state.setTheme);

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

      <div className="pill-nav" id="pricing-pills">
        <button className="pv on" id="pv-params">Parameters</button>
        <button className="pv" id="pv-estimate">Estimate</button>
        <button className="pv" id="pv-json">JSON</button>
      </div>

      <button className="tbtn pri" id="export-btn">Export JSON</button>
    </div>
  );
}

import { useEffect } from 'react';
import { useAuthStore } from '../authStore';
import { usePricingStore } from '../pricingStore';

const TIER_COLS = ['#1a9e6e', '#4a9d3f', '#c97b00', '#c05020', '#a32d2d'];
const CAT_ICONS = {
  'DC Exit': '🏗',
  'App Development': '💻',
  'Landing Zone': '☁',
  'Data Architecture': '🗄',
  'Integration': '🔗',
  'Strategy & APR': '🧭',
  'Migration': '🚚',
  'Custom': '⚙',
};

export default function Sidebar({ collapsed, onCollapse, activeModule, onModuleChange }) {
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  const hasPermission = useAuthStore(state => state.hasPermission);
  const catalogues = usePricingStore(state => state.catalogues);
  const selectCatalogue = usePricingStore(state => state.selectCatalogue);
  const fetchCatalogues = usePricingStore(state => state.fetchCatalogues);

  useEffect(() => {
    if (activeModule === 'pricing' && catalogues.length === 0) {
      fetchCatalogues();
    }
  }, [activeModule]);

  const getRoleColor = (role) => {
    const colors = {
      admin: { bg: 'rgba(245,200,66,.15)', cl: '#f5c842' },
      analyst: { bg: 'rgba(91,76,245,.15)', cl: '#a99ef8' },
      viewer: { bg: 'rgba(26,158,110,.15)', cl: '#5ce0b0' },
    };
    return colors[role] || { bg: 'var(--bg4)', cl: 'var(--tx)' };
  };

  const userColor = getRoleColor(user?.role);

  return (
    <div className={`sb ${collapsed ? 'collapsed' : ''}`}>
      <div className="sb-brand">
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="sb-brand-ico">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L22 12L12 22L2 12Z" fill="#003D82" stroke="currentColor" strokeWidth="1.5" />
              <path d="M12 8L16 12L12 16L8 12Z" fill="white" />
            </svg>
          </div>
          <div>
            <div className="sb-brand-n" style={{ fontSize: '14px', fontWeight: '700', color: '#003D82', letterSpacing: '1px' }}>
              UST
            </div>
            <div className="sb-brand-s" style={{ fontSize: '9px' }}>
              Transformation Studio
            </div>
          </div>
        </div>
        <button
          id="sb-collapse-btn"
          className={collapsed ? 'collapsed' : ''}
          onClick={() => onCollapse(!collapsed)}
          title="Collapse sidebar"
          style={{ background: 'none', border: 'none', color: 'var(--tx2)', cursor: 'pointer', fontSize: '16px', padding: '4px', opacity: '0.6', transition: '0.2s' }}
        >
          ▶
        </button>
      </div>

      <div className="sb-user">
        <div className="u-av" style={{ background: userColor.cl }}>{user?.name?.[0]?.toUpperCase() || 'U'}</div>
        <div>
          <div className="u-name">{user?.name}</div>
          <div className="u-role" style={{ background: userColor.bg, color: userColor.cl }}>
            {user?.role?.toUpperCase()}
          </div>
        </div>
        <button className="u-out" onClick={logout} title="Logout">
          ⎋
        </button>
      </div>

      {/* MODULE SWITCHER */}
      <div className="sb-sec">Module</div>
      <div style={{ padding: '0 8px' }}>
        <button
          className={`sb-nav-item ${activeModule === 'pricing' ? 'on' : ''}`}
          onClick={() => onModuleChange('pricing')}
        >
          <span className="sb-nav-ico">💰</span>
          <span>Pricing Catalogue</span>
        </button>
        <button
          className={`sb-nav-item ${activeModule === 'planner' ? 'on' : ''}`}
          onClick={() => onModuleChange('planner')}
        >
          <span className="sb-nav-ico">📅</span>
          <span>Delivery Planner</span>
        </button>
        {hasPermission('admin') && (
          <button
            className={`sb-nav-item ${activeModule === 'admin' ? 'on' : ''}`}
            onClick={() => onModuleChange('admin')}
            style={{ color: 'var(--gold)' }}
          >
            <span className="sb-nav-ico">⚙</span>
            <span>Admin Panel</span>
          </button>
        )}
      </div>

      {/* PRICING: catalogue list */}
      {activeModule === 'pricing' && (
        <div id="pricing-nav">
          <div className="sb-sec">Catalogues</div>
          <div className="sb-list" id="cat-nav">
            {catalogues.map(cat => (
              <div
                key={cat.id}
                className="cat-row"
                onClick={() => selectCatalogue(cat)}
              >
                <div className="cat-ico" style={{ background: TIER_COLS[cat.tier] || 'var(--bg4)' }}>
                  {CAT_ICONS[cat.type] || '📋'}
                </div>
                <div className="cat-info">
                  <div className="cat-nm">{cat.name}</div>
                  <div className="cat-mt">{cat.type}</div>
                </div>
                <button className="cat-x" onClick={(e) => { e.stopPropagation(); }}>
                  ✕
                </button>
              </div>
            ))}
            {catalogues.length === 0 && (
              <div style={{ padding: '12px', fontSize: '12px', color: 'var(--tx3)', textAlign: 'center' }}>
                No catalogues yet
              </div>
            )}
          </div>
        </div>
      )}

      {/* PLANNER: view nav */}
      {activeModule === 'planner' && (
        <div id="planner-nav" style={{ padding: '11px 16px 4px', fontSize: '9.5px' }}>
          <div className="sb-sec">Planner Views</div>
          <div style={{ padding: '0 8px' }}>
            <button className="sb-nav-item on">
              <span className="sb-nav-ico">🗂</span>
              <span>WBS</span>
            </button>
            <button className="sb-nav-item">
              <span className="sb-nav-ico">👥</span>
              <span>Team & Roles</span>
            </button>
            <button className="sb-nav-item">
              <span className="sb-nav-ico">📅</span>
              <span>Timeline / Gantt</span>
            </button>
            <button className="sb-nav-item">
              <span className="sb-nav-ico">🎯</span>
              <span>RACI Matrix</span>
            </button>
          </div>
        </div>
      )}

      <div className="sb-foot">
        {hasPermission('create') && (
          <button className="sb-btn sb-new">+ New catalogue</button>
        )}
      </div>
    </div>
  );
}

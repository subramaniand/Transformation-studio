import { useState } from 'react';
import { canAccessModule, useAuthStore } from '../authStore';
import { usePricingStore } from '../pricingStore';
import { usePlannerStore } from '../plannerStore';
import { useAdminStore } from '../adminStore';
import PricingModule from '../modules/pricing/PricingModule';
import PlannerModule from '../modules/planner/PlannerModule';
import AdminModule from '../modules/admin/AdminModule';

export default function Content({ module }) {
  const user = useAuthStore(state => state.user);
  const hasPermission = useAuthStore(state => state.hasPermission);
  const currentCatalogue = usePricingStore(state => state.currentCatalogue);

  if (!canAccessModule(user, module)) {
    return <PricingModule />;
  }

  // Use new modular components
  if (module === 'pricing') {
    return <PricingModule />;
  }

  if (module === 'planner') {
    return <PlannerModule />;
  }

  if (module === 'admin') {
    return <AdminModule />;
  }

  // Fallback views (for reference)
  if (module === '_old_pricing') {
    return (
      <div className="content">
        {!currentCatalogue ? (
          <div className="empty">
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
            <div style={{ fontSize: '18px', fontWeight: '600', color: '#fff', marginBottom: '8px' }}>
              Pricing Catalogues
            </div>
            <div style={{ fontSize: '13px', color: 'var(--tx3)' }}>
              Select a catalogue from the sidebar to view details
            </div>
          </div>
        ) : (
          <div style={{ maxWidth: '1000px' }}>
            {/* Catalogue Header */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                <div style={{ fontSize: '32px' }}>📊</div>
                <div style={{ flex: 1 }}>
                  <h2 style={{ fontSize: '24px', fontWeight: '600', margin: '0 0 4px' }}>
                    {currentCatalogue.name}
                  </h2>
                  <p style={{ margin: '0', color: 'var(--tx3)', fontSize: '12px' }}>
                    {currentCatalogue.type} • Tier {currentCatalogue.tier + 1}
                  </p>
                </div>
                {hasPermission('edit') && (
                  <button
                    className="tbtn pri"
                    onClick={() => setShowModal(true)}
                    style={{ cursor: 'pointer' }}
                  >
                    ✎ Edit
                  </button>
                )}
              </div>
              <p style={{ color: 'var(--tx2)', lineHeight: '1.6', marginBottom: '20px' }}>
                {currentCatalogue.description || 'No description provided'}
              </p>
            </div>

            {/* Pricing Parameters */}
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--bd)', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
              <h3 style={{ marginTop: '0', marginBottom: '16px', fontSize: '14px', fontWeight: '600' }}>
                Pricing Parameters
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--tx3)', marginBottom: '4px' }}>Base Cost</div>
                  <div style={{ fontSize: '18px', fontWeight: '600', color: 'var(--gold)' }}>
                    ${Math.random() * 50000 + 10000 | 0}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--tx3)', marginBottom: '4px' }}>Implementation Days</div>
                  <div style={{ fontSize: '18px', fontWeight: '600', color: 'var(--grn)' }}>
                    {Math.random() * 120 + 30 | 0} days
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--tx3)', marginBottom: '4px' }}>Team Size</div>
                  <div style={{ fontSize: '18px', fontWeight: '600', color: 'var(--ac)' }}>
                    {Math.random() * 10 + 3 | 0} members
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--tx3)', marginBottom: '4px' }}>Risk Level</div>
                  <div style={{ fontSize: '18px', fontWeight: '600', color: 'var(--amb)' }}>
                    Medium
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Timeline */}
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--bd)', borderRadius: '12px', padding: '20px' }}>
              <h3 style={{ marginTop: '0', marginBottom: '16px', fontSize: '14px', fontWeight: '600' }}>
                Delivery Timeline
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {['Phase 1: Discovery', 'Phase 2: Design', 'Phase 3: Development', 'Phase 4: Testing', 'Phase 5: Deployment'].map((phase, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--ac)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '600' }}>
                      {i + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: '500' }}>{phase}</div>
                      <div style={{ fontSize: '11px', color: 'var(--tx3)' }}>Week {i * 4 + 1}-{(i + 1) * 4}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // DELIVERY PLANNER VIEW
  if (module === 'planner') {
    console.log('Rendering Delivery Planner');
    return (
      <div className="content">
        <div style={{ maxWidth: '1200px' }}>
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ margin: '0 0 8px', fontSize: '24px', fontWeight: '600' }}>Delivery Planner</h2>
            <p style={{ margin: '0', color: 'var(--tx3)', fontSize: '13px' }}>
              Manage project timeline, team allocation, and delivery milestones
            </p>
          </div>

          {/* Planner Options Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '24px' }}>
            {[
              { icon: '🗂', title: 'WBS', desc: 'Work Breakdown Structure' },
              { icon: '👥', title: 'Team', desc: 'Team & Roles' },
              { icon: '📅', title: 'Gantt', desc: 'Timeline / Gantt Chart' },
              { icon: '🎯', title: 'RACI', desc: 'RACI Matrix' }
            ].map((item) => (
              <button
                key={item.title}
                style={{
                  background: 'var(--bg2)',
                  border: '1px solid var(--bd)',
                  borderRadius: '12px',
                  padding: '16px',
                  cursor: 'pointer',
                  transition: '0.2s',
                  textAlign: 'center'
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--ac)'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--bd)'}
              >
                <div style={{ fontSize: '28px', marginBottom: '8px' }}>{item.icon}</div>
                <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '2px' }}>{item.title}</div>
                <div style={{ fontSize: '10px', color: 'var(--tx3)' }}>{item.desc}</div>
              </button>
            ))}
          </div>

          {/* Project Overview */}
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--bd)', borderRadius: '12px', padding: '20px' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: '600' }}>Project Overview</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--tx3)', marginBottom: '4px' }}>Total Duration</div>
                <div style={{ fontSize: '18px', fontWeight: '600', color: 'var(--ac)' }}>16 weeks</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--tx3)', marginBottom: '4px' }}>Team Members</div>
                <div style={{ fontSize: '18px', fontWeight: '600', color: 'var(--grn)' }}>12 people</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--tx3)', marginBottom: '4px' }}>Milestones</div>
                <div style={{ fontSize: '18px', fontWeight: '600', color: 'var(--gold)' }}>5 phases</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--tx3)', marginBottom: '4px' }}>Status</div>
                <div style={{ fontSize: '18px', fontWeight: '600', color: 'var(--grn)' }}>On Track</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ADMIN PANEL
  if (module === 'admin') {
    return (
      <div className="content">
        <div style={{ maxWidth: '1000px' }}>
          <h2 style={{ margin: '0 0 24px', fontSize: '24px', fontWeight: '600' }}>Admin Panel</h2>

          {/* Admin Sections */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {[
              { icon: '👥', title: 'User Management', desc: 'Manage users, roles & permissions', items: ['Add User', 'Edit Roles', 'View Audit Log'] },
              { icon: '📋', title: 'Catalogues', desc: 'Manage pricing catalogues', items: ['Create', 'Edit', 'Archive', 'Templates'] },
              { icon: '⚙', title: 'Settings', desc: 'System configuration', items: ['Database', 'Email', 'Integrations'] },
              { icon: '📊', title: 'Analytics', desc: 'Usage and performance', items: ['Dashboard', 'Reports', 'Logs'] }
            ].map((section, i) => (
              <div
                key={i}
                style={{
                  background: 'var(--bg2)',
                  border: '1px solid var(--bd)',
                  borderRadius: '12px',
                  padding: '20px',
                  cursor: 'pointer',
                  transition: '0.2s'
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--ac)'; e.currentTarget.style.background = 'rgba(0,75,135,0.05)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--bd)'; e.currentTarget.style.background = 'var(--bg2)'; }}
              >
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>{section.icon}</div>
                <h3 style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: '600' }}>{section.title}</h3>
                <p style={{ margin: '0 0 12px', fontSize: '12px', color: 'var(--tx3)' }}>{section.desc}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {section.items.map((item, j) => (
                    <span
                      key={j}
                      style={{
                        fontSize: '10px',
                        background: 'rgba(0,75,135,0.15)',
                        color: 'var(--ac)',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* System Status */}
          <div style={{ marginTop: '24px', background: 'var(--bg2)', border: '1px solid var(--bd)', borderRadius: '12px', padding: '20px' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: '600' }}>System Status</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
              {[
                { label: 'API Status', status: 'Operational', color: '#27ae60' },
                { label: 'Database', status: 'Connected', color: '#27ae60' },
                { label: 'Supabase', status: 'Configured', color: '#f39c12' },
                { label: 'Last Backup', status: '2 hours ago', color: '#004b87' }
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color }}></div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--tx3)' }}>{item.label}</div>
                    <div style={{ fontSize: '12px', fontWeight: '500' }}>{item.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="content">
      <div className="empty">
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>❓</div>
        <div>Unknown module</div>
      </div>
    </div>
  );
}

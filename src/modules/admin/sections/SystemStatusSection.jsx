/**
 * SystemStatusSection - System health and status
 */
import { useEffect } from 'react';
import { useAdminStore } from '../../../adminStore';
import Card from '../../../components/ui/Card';
import StatusIndicator from '../../../components/ui/StatusIndicator';
import Badge from '../../../components/ui/Badge';

export default function SystemStatusSection() {
  const systemStatus = useAdminStore(state => state.systemStatus);
  const fetchSystemStatus = useAdminStore(state => state.fetchSystemStatus);

  useEffect(() => {
    fetchSystemStatus();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      {/* Main Status Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {/* API Status */}
        <Card title="🔌 API Status">
          <StatusIndicator status={systemStatus.api} label={systemStatus.api} size="large" />
          <p style={{ margin: '12px 0 0', fontSize: '12px', color: 'var(--tx3)' }}>
            Backend API server status
          </p>
        </Card>

        {/* Database */}
        <Card title="💾 Database">
          <StatusIndicator status={systemStatus.database} label={systemStatus.database} size="large" />
          <p style={{ margin: '12px 0 0', fontSize: '12px', color: 'var(--tx3)' }}>
            Primary database connection
          </p>
        </Card>

        {/* Supabase */}
        <Card title="☁️ Supabase">
          <StatusIndicator status={systemStatus.supabase} label={systemStatus.supabase} size="large" />
          <p style={{ margin: '12px 0 0', fontSize: '12px', color: 'var(--tx3)' }}>
            Supabase backend service
          </p>
        </Card>

        {/* Uptime */}
        <Card title="⏱️ Uptime">
          <div style={{ fontSize: '20px', fontWeight: '600', color: 'var(--grn)', marginBottom: '8px' }}>
            {systemStatus.uptime}
          </div>
          <p style={{ margin: '0', fontSize: '12px', color: 'var(--tx3)' }}>
            System availability
          </p>
        </Card>
      </div>

      {/* Backup & Version Info */}
      <Card title="ℹ️ System Information">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--tx3)', marginBottom: '4px', textTransform: 'uppercase' }}>
              Last Backup
            </div>
            <div style={{ fontSize: '13px', fontWeight: '500' }}>
              {new Date(systemStatus.lastBackup).toLocaleString()}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--tx3)', marginBottom: '4px', textTransform: 'uppercase' }}>
              System Version
            </div>
            <div style={{ fontSize: '13px', fontWeight: '500' }}>
              {systemStatus.version}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--tx3)', marginBottom: '4px', textTransform: 'uppercase' }}>
              Environment
            </div>
            <Badge variant="info">Production</Badge>
          </div>
        </div>
      </Card>

      {/* Health Checks */}
      <Card title="🏥 Health Checks" style={{ marginTop: '16px' }}>
        <div style={{ display: 'grid', gap: '12px' }}>
          {[
            { name: 'API Response Time', value: '45ms', status: 'success' },
            { name: 'Database Query Time', value: '12ms', status: 'success' },
            { name: 'Cache Hit Rate', value: '94%', status: 'success' },
            { name: 'Error Rate (24h)', value: '0.02%', status: 'success' },
          ].map((check, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: idx < 3 ? '1px solid var(--bd)' : 'none' }}>
              <div>
                <div style={{ fontSize: '12px', fontWeight: '500', marginBottom: '2px' }}>{check.name}</div>
                <StatusIndicator status={check.status} size="small" />
              </div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--gold)' }}>
                {check.value}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

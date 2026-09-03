/**
 * AuditLogSection - View and filter audit logs
 */
import { useEffect, useState } from 'react';
import { useAdminStore } from '../../../adminStore';
import Card from '../../../components/ui/Card';
import Table from '../../../components/ui/Table';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Badge from '../../../components/ui/Badge';

export default function AuditLogSection() {
  const auditLogs = useAdminStore(state => state.auditLogs);
  const fetchAuditLogs = useAdminStore(state => state.fetchAuditLogs);
  const [filters, setFilters] = useState({
    action: '',
    resource: '',
    search: '',
  });

  useEffect(() => {
    fetchAuditLogs(filters);
  }, []);

  const filteredLogs = auditLogs.filter(log => {
    if (filters.action && log.action !== filters.action) return false;
    if (filters.resource && log.resource !== filters.resource) return false;
    if (filters.search && !log.resourceName?.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  const getActionBadgeVariant = (action) => {
    return action === 'DELETE' ? 'danger' : action === 'UPDATE' ? 'warning' : 'success';
  };

  const headers = [
    { key: 'user', label: 'User' },
    { key: 'action', label: 'Action', align: 'center' },
    { key: 'resource', label: 'Resource' },
    { key: 'details', label: 'Details' },
    { key: 'timestamp', label: 'Time' },
  ];

  const rows = filteredLogs.map(log => ({
    id: log.id,
    user: (
      <div style={{ fontSize: '13px' }}>
        <strong>{log.username}</strong>
        <div style={{ fontSize: '11px', color: 'var(--tx3)' }}>{log.userId}</div>
      </div>
    ),
    action: (
      <Badge variant={getActionBadgeVariant(log.action)}>
        {log.action}
      </Badge>
    ),
    resource: (
      <div style={{ fontSize: '12px' }}>
        <div>{log.resource}</div>
        <div style={{ fontSize: '10px', color: 'var(--tx3)' }}>{log.resourceId}</div>
      </div>
    ),
    details: log.details || log.resourceName,
    timestamp: new Date(log.timestamp).toLocaleString(),
  }));

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: '600' }}>
          📋 Audit Logs ({filteredLogs.length})
        </h3>

        {/* Filters */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          <Input
            icon="🔍"
            placeholder="Search..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
          <Select
            options={[
              { value: '', label: 'All Actions' },
              { value: 'CREATE', label: 'Create' },
              { value: 'UPDATE', label: 'Update' },
              { value: 'DELETE', label: 'Delete' },
            ]}
            value={filters.action}
            onChange={(e) => setFilters({ ...filters, action: e.target.value })}
          />
          <Select
            options={[
              { value: '', label: 'All Resources' },
              { value: 'catalogue', label: 'Catalogue' },
              { value: 'user', label: 'User' },
              { value: 'project', label: 'Project' },
            ]}
            value={filters.resource}
            onChange={(e) => setFilters({ ...filters, resource: e.target.value })}
          />
        </div>
      </div>

      <Card>
        <Table headers={headers} rows={rows} emptyMessage="No audit logs found" />
      </Card>
    </div>
  );
}

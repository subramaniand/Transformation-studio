/**
 * TeamView - Team roster and allocation
 */
import { usePlannerStore } from '../../../plannerStore';
import { useAuthStore } from '../../../authStore';
import Card from '../../../components/ui/Card';
import Avatar from '../../../components/ui/Avatar';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Table from '../../../components/ui/Table';

export default function TeamView() {
  const activeProject = usePlannerStore(state => state.activeProject);
  const removeTeamMember = usePlannerStore(state => state.removeTeamMember);
  const hasPermission = useAuthStore(state => state.hasPermission);

  if (!activeProject) return null;

  const headers = [
    { key: 'name', label: 'Name' },
    { key: 'role', label: 'Role' },
    { key: 'allocationPercent', label: 'Allocation' },
    { key: 'startDate', label: 'Start Date' },
    { key: 'endDate', label: 'End Date' },
    { key: 'actions', label: 'Actions' },
  ];

  const rows = activeProject.team?.map(member => ({
    id: member.id,
    name: member.name,
    role: member.role,
    allocationPercent: `${member.allocationPercent}%`,
    startDate: member.startDate,
    endDate: member.endDate || 'Ongoing',
    actions: (
      <div style={{ display: 'flex', gap: '6px' }}>
        <Button size="small" variant="secondary">✏️</Button>
        {hasPermission('edit') && (
          <Button
            size="small"
            variant="danger"
            onClick={() => removeTeamMember(member.id)}
          >
            🗑️
          </Button>
        )}
      </div>
    ),
  })) || [];

  return (
    <div style={{ padding: '20px' }}>
      {/* Team Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        <Card style={{ padding: '12px' }}>
          <div style={{ fontSize: '10px', color: 'var(--tx3)', marginBottom: '4px' }}>Total Team Members</div>
          <div style={{ fontSize: '18px', fontWeight: '600', color: 'var(--ac)' }}>
            {activeProject.team?.length || 0}
          </div>
        </Card>
        <Card style={{ padding: '12px' }}>
          <div style={{ fontSize: '10px', color: 'var(--tx3)', marginBottom: '4px' }}>Avg Allocation</div>
          <div style={{ fontSize: '18px', fontWeight: '600', color: 'var(--grn)' }}>
            {activeProject.team && activeProject.team.length > 0
              ? (activeProject.team.reduce((sum, m) => sum + m.allocationPercent, 0) / activeProject.team.length).toFixed(0)
              : 0}%
          </div>
        </Card>
      </div>

      {/* Team Table */}
      <Card title="👥 Team Members">
        <Table headers={headers} rows={rows} />
      </Card>

      {hasPermission('create') && (
        <Button variant="primary" style={{ marginTop: '16px' }}>
          ➕ Add Team Member
        </Button>
      )}
    </div>
  );
}

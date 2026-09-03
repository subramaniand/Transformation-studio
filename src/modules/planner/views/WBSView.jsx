/**
 * WBSView - Work Breakdown Structure tree view
 */
import { usePlannerStore } from '../../../plannerStore';
import { useAuthStore } from '../../../authStore';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';

export default function WBSView() {
  const activeProject = usePlannerStore(state => state.activeProject);
  const toggleWBSNode = usePlannerStore(state => state.toggleWBSNode);
  const expandedWBSNodes = usePlannerStore(state => state.expandedWBSNodes);
  const deleteWBSItem = usePlannerStore(state => state.deleteWBSItem);
  const hasPermission = useAuthStore(state => state.hasPermission);

  if (!activeProject) return null;

  const statusColors = {
    'not-started': 'info',
    'in-progress': 'warning',
    'completed': 'success',
  };

  return (
    <div style={{ padding: '20px' }}>
      {activeProject.wbs && activeProject.wbs.length > 0 ? (
        <div>
          {activeProject.wbs.map((item) => (
            <Card
              key={item.id}
              style={{
                marginBottom: '12px',
                borderLeft: `4px solid ${
                  statusColors[item.status] === 'success' ? 'var(--grn)' :
                  statusColors[item.status] === 'warning' ? 'var(--amb)' :
                  'var(--tx3)'
                }`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <h4 style={{ margin: '0', fontSize: '14px', fontWeight: '600' }}>
                      {item.name}
                    </h4>
                    <Badge variant={statusColors[item.status]}>
                      {item.status}
                    </Badge>
                  </div>
                  <p style={{ margin: '0 0 12px', fontSize: '12px', color: 'var(--tx3)' }}>
                    {item.description}
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px' }}>
                    <div>
                      <div style={{ fontSize: '10px', color: 'var(--tx3)', marginBottom: '2px' }}>Start Date</div>
                      <div style={{ fontSize: '12px', fontWeight: '500' }}>{item.startDate}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '10px', color: 'var(--tx3)', marginBottom: '2px' }}>End Date</div>
                      <div style={{ fontSize: '12px', fontWeight: '500' }}>{item.endDate}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '10px', color: 'var(--tx3)', marginBottom: '2px' }}>Duration</div>
                      <div style={{ fontSize: '12px', fontWeight: '500' }}>{item.estimatedDays} days</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '10px', color: 'var(--tx3)', marginBottom: '2px' }}>Owner</div>
                      <div style={{ fontSize: '12px', fontWeight: '500' }}>{item.owner}</div>
                    </div>
                  </div>
                </div>

                {hasPermission('edit') && (
                  <div style={{ display: 'flex', gap: '6px', whiteSpace: 'nowrap' }}>
                    <Button size="small" variant="secondary">✏️</Button>
                    <Button
                      size="small"
                      variant="danger"
                      onClick={() => deleteWBSItem(item.id)}
                    >
                      🗑️
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}

          {hasPermission('create') && (
            <Button variant="primary" style={{ marginTop: '16px' }}>
              ➕ Add WBS Item
            </Button>
          )}
        </div>
      ) : (
        <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--tx3)' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>🗂</div>
          <div>No WBS items defined yet</div>
          {hasPermission('create') && (
            <Button variant="primary" style={{ marginTop: '16px' }}>
              ➕ Create First WBS Item
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

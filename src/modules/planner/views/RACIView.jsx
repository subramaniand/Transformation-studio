/**
 * RACIView - RACI matrix (Responsible, Accountable, Consulted, Informed)
 */
import { usePlannerStore } from '../../../plannerStore';
import { useAuthStore } from '../../../authStore';
import Card from '../../../components/ui/Card';

const RACI_OPTIONS = ['R', 'A', 'C', 'I', ''];
const RACI_DESCRIPTIONS = {
  R: 'Responsible - Does the work',
  A: 'Accountable - Final authority',
  C: 'Consulted - Provides input',
  I: 'Informed - Kept in the loop',
  '': 'Not involved',
};

const RACI_COLORS = {
  R: '#004b87', // blue
  A: '#e67e22', // gold
  C: '#27ae60', // green
  I: '#f39c12', // amber
  '': 'var(--bg3)',
};

export default function RACIView() {
  const activeProject = usePlannerStore(state => state.activeProject);
  const updateRACICell = usePlannerStore(state => state.updateRACICell);
  const hasPermission = useAuthStore(state => state.hasPermission);

  if (!activeProject) return null;

  const getRACIValue = (taskId, roleId) => {
    const cell = activeProject.raci?.find(r => r.taskId === taskId && r.roleId === roleId);
    return cell?.responsibility || '';
  };

  const handleCellClick = (taskId, roleId) => {
    if (!hasPermission('edit')) return;

    const currentValue = getRACIValue(taskId, roleId);
    const nextIndex = (RACI_OPTIONS.indexOf(currentValue) + 1) % RACI_OPTIONS.length;
    const nextValue = RACI_OPTIONS[nextIndex];

    updateRACICell(taskId, roleId, nextValue);
  };

  return (
    <div style={{ padding: '20px' }}>
      <Card title="🎯 RACI Matrix">
        <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
          <table style={{
            width: '100%',
            minWidth: '800px',
            borderCollapse: 'collapse',
          }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--bd)' }}>
                <th style={{
                  padding: '12px',
                  textAlign: 'left',
                  fontSize: '11px',
                  fontWeight: '600',
                  color: 'var(--tx3)',
                  width: '200px',
                  minWidth: '200px',
                }}>
                  Task / Role
                </th>
                {activeProject.team?.map((member) => (
                  <th
                    key={member.id}
                    style={{
                      padding: '12px',
                      textAlign: 'center',
                      fontSize: '11px',
                      fontWeight: '600',
                      color: 'var(--tx3)',
                      minWidth: '60px',
                      whiteSpace: 'nowrap',
                    }}
                    title={member.name}
                  >
                    {member.role.slice(0, 3)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {activeProject.wbs?.map((task) => (
                <tr key={task.id} style={{ borderBottom: '1px solid var(--bd)' }}>
                  <td style={{
                    padding: '12px',
                    fontSize: '12px',
                    fontWeight: '500',
                    color: 'var(--tx2)',
                    verticalAlign: 'middle',
                  }}>
                    {task.name}
                  </td>
                  {activeProject.team?.map((member) => {
                    const value = getRACIValue(task.id, member.id);
                    return (
                      <td
                        key={member.id}
                        onClick={() => handleCellClick(task.id, member.id)}
                        style={{
                          padding: '12px',
                          textAlign: 'center',
                          cursor: hasPermission('edit') ? 'pointer' : 'default',
                          background: value ? RACI_COLORS[value] : 'var(--bg3)',
                          color: value ? '#fff' : 'var(--tx3)',
                          fontWeight: value ? '600' : '400',
                          fontSize: '13px',
                          transition: '0.2s',
                          borderRadius: '4px',
                          userSelect: 'none',
                        }}
                        onMouseEnter={(e) => {
                          if (hasPermission('edit')) {
                            e.target.style.opacity = '0.8';
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.opacity = '1';
                        }}
                        title={RACI_DESCRIPTIONS[value]}
                      >
                        {value || '—'}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div style={{
          padding: '12px 0',
          borderTop: '1px solid var(--bd)',
        }}>
          <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '12px', color: 'var(--tx2)' }}>
            Legend:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
            {Object.entries(RACI_DESCRIPTIONS).map(([key, desc]) => (
              <div key={key} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                {key && (
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '4px',
                    background: RACI_COLORS[key],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#fff',
                    flexShrink: 0,
                  }}>
                    {key}
                  </div>
                )}
                <span style={{ fontSize: '11px', color: 'var(--tx3)', lineHeight: '1.4' }}>
                  {desc}
                </span>
              </div>
            ))}
          </div>
        </div>

        {hasPermission('edit') && (
          <div style={{
            marginTop: '12px',
            padding: '12px',
            background: 'rgba(0,75,135,0.1)',
            borderRadius: '6px',
            fontSize: '11px',
            color: 'var(--tx3)',
          }}>
            💡 Click on cells to cycle through RACI assignments
          </div>
        )}
      </Card>
    </div>
  );
}

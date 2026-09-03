/**
 * GanttView - Gantt chart/timeline view
 */
import { usePlannerStore } from '../../../plannerStore';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Select from '../../../components/ui/Select';

export default function GanttView() {
  const activeProject = usePlannerStore(state => state.activeProject);
  const ganttZoom = usePlannerStore(state => state.ganttZoom);
  const setGanttZoom = usePlannerStore(state => state.setGanttZoom);

  if (!activeProject) return null;

  const calculateBarWidth = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return Math.max(days * 8, 50); // pixels per day
  };

  const calculateProgress = (startDate, endDate, status) => {
    if (status === 'completed') return 100;
    if (status === 'not-started') return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    if (today > end) return 100;
    if (today < start) return 0;
    return Math.round(((today - start) / (end - start)) * 100);
  };

  const statusColors = {
    'not-started': 'var(--tx3)',
    'in-progress': 'var(--amb)',
    'completed': 'var(--grn)',
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '16px' }}>
        <label style={{ fontSize: '12px', fontWeight: '500', color: 'var(--tx2)', marginRight: '8px' }}>
          Zoom Level:
        </label>
        <Select
          options={[
            { value: 'week', label: 'Weekly' },
            { value: 'month', label: 'Monthly' },
            { value: 'quarter', label: 'Quarterly' },
          ]}
          value={ganttZoom}
          onChange={(e) => setGanttZoom(e.target.value)}
          style={{ display: 'inline-block', width: '120px' }}
        />
      </div>

      <Card title="📊 Project Timeline">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', minWidth: '800px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--bd)' }}>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: 'var(--tx3)', width: '200px' }}>
                  Task
                </th>
                <th style={{ padding: '12px', textAlign: 'center', fontSize: '11px', fontWeight: '600', color: 'var(--tx3)' }}>
                  Timeline
                </th>
              </tr>
            </thead>
            <tbody>
              {activeProject.wbs?.map((item, idx) => {
                const barWidth = calculateBarWidth(item.startDate, item.endDate);
                const progress = calculateProgress(item.startDate, item.endDate, item.status);

                return (
                  <tr key={item.id} style={{ borderBottom: '1px solid var(--bd)' }}>
                    <td style={{ padding: '12px', fontSize: '13px', fontWeight: '500', color: 'var(--tx2)', verticalAlign: 'middle' }}>
                      {item.name}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{
                        background: 'var(--bg3)',
                        borderRadius: '4px',
                        height: '24px',
                        position: 'relative',
                        overflow: 'hidden',
                        minWidth: barWidth + 'px',
                      }}>
                        <div style={{
                          background: statusColors[item.status],
                          height: '100%',
                          width: progress + '%',
                          transition: '0.3s',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '10px',
                          fontWeight: '600',
                          color: '#fff',
                        }}>
                          {progress}%
                        </div>
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--tx3)', marginTop: '4px' }}>
                        {item.startDate} → {item.endDate}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Legend */}
      <div style={{ marginTop: '16px', display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        {[
          { status: 'not-started', label: 'Not Started' },
          { status: 'in-progress', label: 'In Progress' },
          { status: 'completed', label: 'Completed' },
        ].map(item => (
          <div key={item.status} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '2px',
              background: statusColors[item.status],
            }} />
            <span style={{ fontSize: '12px', color: 'var(--tx2)' }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

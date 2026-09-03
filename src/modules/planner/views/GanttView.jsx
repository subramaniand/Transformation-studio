/**
 * GanttView - Professional Gantt chart with timeline
 */
import { useState } from 'react';
import { usePlannerStore } from '../../../plannerStore';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

export default function GanttView() {
  const activeProject = usePlannerStore(state => state.activeProject);
  const [ganttZoom, setGanttZoom] = useState('month');
  const [selectedTask, setSelectedTask] = useState(null);

  if (!activeProject) return null;

  // Calculate date range
  const projectStart = new Date(activeProject.startDate);
  const projectEnd = new Date(activeProject.endDate);

  // Get all unique weeks/months based on zoom level
  const getWeekNumber = (date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  };

  const getWeekStart = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };

  const getMonthYear = (date) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  // Generate timeline columns based on zoom level
  const generateTimeline = () => {
    const timeline = [];
    let current = new Date(projectStart);

    if (ganttZoom === 'week') {
      while (current <= projectEnd) {
        const weekStart = getWeekStart(current);
        const weekNum = getWeekNumber(weekStart);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);

        timeline.push({
          id: `w-${weekStart.toISOString().split('T')[0]}`,
          label: `W${weekNum}`,
          date: weekStart,
          start: weekStart,
          end: weekEnd,
          type: 'week',
        });

        current.setDate(current.getDate() + 7);
      }
    } else if (ganttZoom === 'month') {
      while (current <= projectEnd) {
        const monthStart = new Date(current.getFullYear(), current.getMonth(), 1);
        const monthEnd = new Date(current.getFullYear(), current.getMonth() + 1, 0);

        timeline.push({
          id: `m-${monthStart.toISOString().split('T')[0]}`,
          label: getMonthYear(monthStart),
          date: monthStart,
          start: monthStart,
          end: monthEnd,
          type: 'month',
        });

        current.setMonth(current.getMonth() + 1);
      }
    } else {
      // Quarter view
      while (current <= projectEnd) {
        const quarter = Math.floor(current.getMonth() / 3) + 1;
        const quarterStart = new Date(current.getFullYear(), (quarter - 1) * 3, 1);
        const quarterEnd = new Date(current.getFullYear(), quarter * 3, 0);

        timeline.push({
          id: `q-${quarterStart.toISOString().split('T')[0]}`,
          label: `Q${quarter} ${current.getFullYear()}`,
          date: quarterStart,
          start: quarterStart,
          end: quarterEnd,
          type: 'quarter',
        });

        current.setMonth(current.getMonth() + 3);
      }
    }

    return timeline;
  };

  // Calculate task bar position
  const calculateTaskBar = (task, timeline) => {
    const taskStart = new Date(task.startDate);
    const taskEnd = new Date(task.endDate);

    let startIndex = -1;
    let endIndex = -1;

    timeline.forEach((period, idx) => {
      if (taskStart >= period.start && taskStart <= period.end && startIndex === -1) {
        startIndex = idx;
      }
      if (taskEnd >= period.start && taskEnd <= period.end) {
        endIndex = idx;
      }
    });

    if (startIndex === -1) startIndex = 0;
    if (endIndex === -1) endIndex = timeline.length - 1;

    const duration = endIndex - startIndex + 1;
    const offset = startIndex;

    return { startIndex, endIndex, duration, offset };
  };

  const getPhaseColor = (phaseName) => {
    const colors = {
      'Discovery & Planning': '#004b87',
      'Infrastructure Setup': '#0066cc',
      'Migration': '#00a8ff',
      'Testing & Validation': '#27ae60',
      'Cutover & Support': '#e67e22',
      'default': '#004b87',
    };
    return colors[phaseName] || colors.default;
  };

  const getTaskPhase = (taskId) => {
    if (!taskId) return 'default';
    return activeProject.phases?.find(p => p.id === taskId)?.name || 'Unknown';
  };

  const timeline = generateTimeline();
  const cellWidth = ganttZoom === 'quarter' ? 100 : ganttZoom === 'month' ? 80 : 40;
  const timelineWidth = timeline.length * cellWidth;

  const statusColors = {
    'not-started': '#555',
    'in-progress': '#f39c12',
    'completed': '#27ae60',
  };

  const statusIcons = {
    'not-started': '○',
    'in-progress': '◐',
    'completed': '●',
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ margin: '0 0 12px', fontSize: '16px', fontWeight: '600' }}>
          📊 {activeProject.name}
        </h3>
        <p style={{ margin: '0 0 12px', fontSize: '12px', color: 'var(--tx3)' }}>
          {activeProject.startDate} → {activeProject.endDate}
        </p>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
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
              style={{ display: 'inline-block', width: '140px' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <Badge variant="info">{activeProject.wbs?.length || 0} Tasks</Badge>
            <Badge variant="warning">{activeProject.milestones?.length || 0} Milestones</Badge>
          </div>
        </div>
      </div>

      {/* Gantt Chart */}
      <Card style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto', overflowY: 'auto', maxHeight: '600px' }}>
          <table style={{ width: '100%', minWidth: '1200px', borderCollapse: 'collapse' }}>
            {/* Header with timeline */}
            <thead>
              <tr style={{ background: 'var(--bg3)', borderBottom: '2px solid var(--bd)' }}>
                <th style={{
                  padding: '12px',
                  textAlign: 'left',
                  fontSize: '11px',
                  fontWeight: '600',
                  color: 'var(--tx3)',
                  width: '200px',
                  minWidth: '200px',
                  position: 'sticky',
                  left: 0,
                  background: 'var(--bg3)',
                  zIndex: 10,
                }}>
                  Task Name
                </th>
                <th style={{
                  width: `${timelineWidth}px`,
                  minWidth: `${timelineWidth}px`,
                }}>
                  <div style={{ display: 'flex' }}>
                    {timeline.map((period) => (
                      <div
                        key={period.id}
                        style={{
                          width: `${cellWidth}px`,
                          height: '40px',
                          padding: '4px',
                          textAlign: 'center',
                          fontSize: '10px',
                          fontWeight: '600',
                          color: 'var(--tx3)',
                          borderRight: '1px solid var(--bd)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {period.label}
                      </div>
                    ))}
                  </div>
                </th>
              </tr>
            </thead>

            {/* Task rows */}
            <tbody>
              {activeProject.wbs?.map((task, idx) => {
                const barInfo = calculateTaskBar(task, timeline);
                const phaseColor = getPhaseColor(task.name);
                const status = task.status || 'not-started';

                return (
                  <tr
                    key={task.id}
                    style={{
                      borderBottom: '1px solid var(--bd)',
                      background: selectedTask?.id === task.id ? 'rgba(91, 76, 245, 0.1)' : 'transparent',
                    }}
                    onClick={() => setSelectedTask(task)}
                  >
                    {/* Task info */}
                    <td style={{
                      padding: '12px',
                      fontSize: '12px',
                      fontWeight: '500',
                      color: 'var(--tx2)',
                      position: 'sticky',
                      left: 0,
                      background: selectedTask?.id === task.id ? 'rgba(91, 76, 245, 0.1)' : 'var(--bg)',
                      zIndex: 5,
                      verticalAlign: 'middle',
                      cursor: 'pointer',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          color: statusColors[status],
                          fontSize: '14px',
                          fontWeight: 'bold',
                        }}>
                          {statusIcons[status]}
                        </span>
                        <div>
                          <div>{task.name}</div>
                          <div style={{ fontSize: '10px', color: 'var(--tx3)' }}>
                            {task.estimatedDays} days
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Timeline bars */}
                    <td style={{ padding: '8px', verticalAlign: 'middle' }}>
                      <div style={{ display: 'flex', height: '32px' }}>
                        {timeline.map((period, periodIdx) => {
                          const isBarStart = periodIdx === barInfo.startIndex;
                          const isBarEnd = periodIdx === barInfo.endIndex;
                          const isBarPart = periodIdx >= barInfo.startIndex && periodIdx <= barInfo.endIndex;

                          if (isBarPart) {
                            return (
                              <div
                                key={`${task.id}-${period.id}`}
                                style={{
                                  width: `${cellWidth}px`,
                                  height: '32px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  paddingLeft: isBarStart ? '4px' : '0',
                                  paddingRight: isBarEnd ? '4px' : '0',
                                  boxSizing: 'border-box',
                                }}
                              >
                                {isBarStart || isBarEnd ? (
                                  <div
                                    style={{
                                      height: '16px',
                                      flex: 1,
                                      background: phaseColor,
                                      borderRadius: isBarStart ? '3px 0 0 3px' : isBarEnd ? '0 3px 3px 0' : '0',
                                      position: 'relative',
                                      cursor: 'pointer',
                                      transition: '0.2s',
                                      opacity: 0.8,
                                    }}
                                    onMouseEnter={(e) => {
                                      e.target.style.opacity = '1';
                                      e.target.style.height = '20px';
                                      e.target.style.margin = '-2px 0';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.target.style.opacity = '0.8';
                                      e.target.style.height = '16px';
                                      e.target.style.margin = '0';
                                    }}
                                    title={`${task.name} (${task.startDate} to ${task.endDate})`}
                                  />
                                ) : (
                                  <div
                                    style={{
                                      height: '16px',
                                      width: '100%',
                                      background: phaseColor,
                                      cursor: 'pointer',
                                      transition: '0.2s',
                                      opacity: 0.8,
                                    }}
                                    onMouseEnter={(e) => {
                                      e.target.style.opacity = '1';
                                      e.target.style.height = '20px';
                                      e.target.style.margin = '-2px 0';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.target.style.opacity = '0.8';
                                      e.target.style.height = '16px';
                                      e.target.style.margin = '0';
                                    }}
                                    title={`${task.name} (${task.startDate} to ${task.endDate})`}
                                  />
                                )}
                              </div>
                            );
                          }

                          // Empty cell
                          return (
                            <div
                              key={`${task.id}-${period.id}-empty`}
                              style={{
                                width: `${cellWidth}px`,
                                height: '32px',
                                borderRight: '1px solid var(--bd)',
                              }}
                            />
                          );
                        })}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Task Details */}
      {selectedTask && (
        <Card title="Task Details" style={{ marginTop: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--tx3)', marginBottom: '4px' }}>Task Name</div>
              <div style={{ fontSize: '13px', fontWeight: '500' }}>{selectedTask.name}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--tx3)', marginBottom: '4px' }}>Status</div>
              <Badge variant={selectedTask.status === 'completed' ? 'success' : selectedTask.status === 'in-progress' ? 'warning' : 'info'}>
                {selectedTask.status}
              </Badge>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--tx3)', marginBottom: '4px' }}>Duration</div>
              <div style={{ fontSize: '13px', fontWeight: '500' }}>{selectedTask.estimatedDays} days</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--tx3)', marginBottom: '4px' }}>Owner</div>
              <div style={{ fontSize: '13px', fontWeight: '500' }}>{selectedTask.owner || 'Unassigned'}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--tx3)', marginBottom: '4px' }}>Start Date</div>
              <div style={{ fontSize: '13px', fontWeight: '500' }}>{selectedTask.startDate}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--tx3)', marginBottom: '4px' }}>End Date</div>
              <div style={{ fontSize: '13px', fontWeight: '500' }}>{selectedTask.endDate}</div>
            </div>
          </div>
          {selectedTask.description && (
            <div style={{ marginTop: '12px', padding: '12px', background: 'var(--bg3)', borderRadius: '6px' }}>
              <div style={{ fontSize: '11px', color: 'var(--tx3)', marginBottom: '4px' }}>Description</div>
              <div style={{ fontSize: '12px', color: 'var(--tx2)' }}>{selectedTask.description}</div>
            </div>
          )}
        </Card>
      )}

      {/* Legend */}
      <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <Card title="Status Legend">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { status: 'not-started', label: 'Not Started', icon: '○' },
              { status: 'in-progress', label: 'In Progress', icon: '◐' },
              { status: 'completed', label: 'Completed', icon: '●' },
            ].map(item => (
              <div key={item.status} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: statusColors[item.status], fontSize: '14px', fontWeight: 'bold' }}>
                  {item.icon}
                </span>
                <span style={{ fontSize: '12px' }}>{item.label}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Phase Colors">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {activeProject.phases?.slice(0, 5).map(phase => (
              <div key={phase.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '2px',
                  background: getPhaseColor(phase.name),
                }} />
                <span style={{ fontSize: '12px' }}>{phase.name}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Project Info">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div>
              <div style={{ fontSize: '10px', color: 'var(--tx3)', marginBottom: '2px' }}>Total Duration</div>
              <div style={{ fontSize: '12px', fontWeight: '500' }}>
                {Math.ceil((projectEnd - projectStart) / (1000 * 60 * 60 * 24))} days
              </div>
            </div>
            <div>
              <div style={{ fontSize: '10px', color: 'var(--tx3)', marginBottom: '2px' }}>Tasks</div>
              <div style={{ fontSize: '12px', fontWeight: '500' }}>
                {activeProject.wbs?.length || 0} total
              </div>
            </div>
            <div>
              <div style={{ fontSize: '10px', color: 'var(--tx3)', marginBottom: '2px' }}>Team Size</div>
              <div style={{ fontSize: '12px', fontWeight: '500' }}>
                {activeProject.team?.length || 0} members
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

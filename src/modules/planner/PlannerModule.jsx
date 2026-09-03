/**
 * PlannerModule - Delivery planner and project management
 */
import { useState } from 'react';
import { usePlannerStore } from '../../plannerStore';
import { useAuthStore } from '../../authStore';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Tabs from '../../components/ui/Tabs';
import WBSView from './views/WBSView';
import TeamView from './views/TeamView';
import GanttView from './views/GanttView';
import RACIView from './views/RACIView';

export default function PlannerModule() {
  const activeProject = usePlannerStore(state => state.activeProject);
  const projects = usePlannerStore(state => state.projects);
  const selectProject = usePlannerStore(state => state.selectProject);
  const activeView = usePlannerStore(state => state.activeView);
  const setActiveView = usePlannerStore(state => state.setActiveView);
  const hasPermission = useAuthStore(state => state.hasPermission);

  if (!activeProject) {
    return (
      <div className="content">
        <div style={{ maxWidth: '1000px' }}>
          <h1 style={{ margin: '0 0 24px', fontSize: '28px', fontWeight: '600' }}>
            📅 Delivery Planner
          </h1>

          <Card title="Select a Project">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {projects.map((project) => (
                <Card
                  key={project.id}
                  hoverable
                  onClick={() => selectProject(project)}
                  style={{ cursor: 'pointer' }}
                >
                  <h3 style={{ margin: '0 0 8px', fontSize: '14px', fontWeight: '600' }}>
                    {project.name}
                  </h3>
                  <p style={{ margin: '0 0 12px', fontSize: '12px', color: 'var(--tx3)' }}>
                    {project.description}
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div>
                      <div style={{ fontSize: '10px', color: 'var(--tx3)' }}>Team</div>
                      <div style={{ fontSize: '13px', fontWeight: '600' }}>{project.team?.length || 0}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '10px', color: 'var(--tx3)' }}>WBS Items</div>
                      <div style={{ fontSize: '13px', fontWeight: '600' }}>{project.wbs?.length || 0}</div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const tabs = [
    {
      id: 'wbs',
      label: '🗂 Work Breakdown Structure',
      content: <WBSView />,
    },
    {
      id: 'team',
      label: '👥 Team & Roles',
      content: <TeamView />,
    },
    {
      id: 'gantt',
      label: '📊 Gantt Chart',
      content: <GanttView />,
    },
    {
      id: 'raci',
      label: '🎯 RACI Matrix',
      content: <RACIView />,
    },
  ];

  return (
    <div className="content">
      <div style={{ maxWidth: '1400px' }}>
        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div>
              <h1 style={{ margin: '0 0 4px', fontSize: '28px', fontWeight: '600' }}>
                📅 {activeProject.name}
              </h1>
              <p style={{ margin: '0', fontSize: '13px', color: 'var(--tx3)' }}>
                {activeProject.description}
              </p>
            </div>
            <Button variant="secondary" onClick={() => selectProject(null)}>
              ← Back to Projects
            </Button>
          </div>

          {/* Project Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px' }}>
            <Card style={{ padding: '12px' }}>
              <div style={{ fontSize: '10px', color: 'var(--tx3)', marginBottom: '4px' }}>Duration</div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--ac)' }}>
                {activeProject.wbs?.length || 0} phases
              </div>
            </Card>
            <Card style={{ padding: '12px' }}>
              <div style={{ fontSize: '10px', color: 'var(--tx3)', marginBottom: '4px' }}>Team Size</div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--grn)' }}>
                {activeProject.team?.length || 0} members
              </div>
            </Card>
            <Card style={{ padding: '12px' }}>
              <div style={{ fontSize: '10px', color: 'var(--tx3)', marginBottom: '4px' }}>Status</div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--gold)' }}>
                {activeProject.status}
              </div>
            </Card>
            <Card style={{ padding: '12px' }}>
              <div style={{ fontSize: '10px', color: 'var(--tx3)', marginBottom: '4px' }}>Milestones</div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--amb)' }}>
                {activeProject.milestones?.length || 0}
              </div>
            </Card>
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          background: 'var(--bg2)',
          border: '1px solid var(--bd)',
          borderRadius: '12px',
          overflow: 'hidden',
        }}>
          <Tabs
            tabs={tabs}
            defaultActive={tabs.findIndex(t => t.id === activeView)}
            onChange={(tab) => setActiveView(tab.id)}
            variant="line"
          />
        </div>
      </div>
    </div>
  );
}

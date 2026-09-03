import { create } from 'zustand';
import { supabase } from './supabaseClient';

const DEMO_PROJECTS = [
  {
    id: '1',
    name: 'Cloud Migration Initiative',
    description: 'Enterprise cloud infrastructure migration',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'active',
    phases: [
      { id: 'p1', name: 'Discovery & Planning', order: 1 },
      { id: 'p2', name: 'Infrastructure Setup', order: 2 },
      { id: 'p3', name: 'Migration', order: 3 },
      { id: 'p4', name: 'Testing & Validation', order: 4 },
      { id: 'p5', name: 'Cutover & Support', order: 5 },
    ],
    wbs: [
      { id: 'w1', parentId: null, name: 'Phase 1: Discovery', description: 'Initial assessment', order: 1, startDate: new Date().toISOString().split('T')[0], endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], status: 'in-progress', owner: 'u1', estimatedDays: 14 },
      { id: 'w2', parentId: null, name: 'Phase 2: Design', description: 'Solution architecture', order: 2, startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], endDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], status: 'not-started', owner: 'u2', estimatedDays: 14 },
      { id: 'w3', parentId: null, name: 'Phase 3: Build & Deploy', description: 'Infrastructure deployment', order: 3, startDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], endDate: new Date(Date.now() + 56 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], status: 'not-started', owner: 'u2', estimatedDays: 28 },
    ],
    team: [
      { id: 't1', userId: 'u1', name: 'Alice Johnson', role: 'PM', startDate: new Date().toISOString().split('T')[0], endDate: null, allocationPercent: 100 },
      { id: 't2', userId: 'u2', name: 'Bob Smith', role: 'Lead Architect', startDate: new Date().toISOString().split('T')[0], endDate: null, allocationPercent: 100 },
      { id: 't3', userId: 'u3', name: 'Carol White', role: 'DevOps', startDate: new Date().toISOString().split('T')[0], endDate: null, allocationPercent: 80 },
    ],
    raci: [
      { id: 'r1', taskId: 'w1', roleId: 'PM', responsibility: 'R' },
      { id: 'r2', taskId: 'w1', roleId: 'Lead Architect', responsibility: 'A' },
      { id: 'r3', taskId: 'w2', roleId: 'Lead Architect', responsibility: 'R' },
      { id: 'r4', taskId: 'w2', roleId: 'PM', responsibility: 'A' },
      { id: 'r5', taskId: 'w3', roleId: 'DevOps', responsibility: 'R' },
    ],
    milestones: [
      { id: 'm1', name: 'Discovery Complete', date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], status: 'pending' },
      { id: 'm2', name: 'Design Review', date: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], status: 'pending' },
    ],
  },
];

const DEMO_ROLES = [
  { id: '1', name: 'Project Manager', description: 'Overall project leadership' },
  { id: '2', name: 'Lead Architect', description: 'Technical architecture' },
  { id: '3', name: 'DevOps Engineer', description: 'Infrastructure & deployment' },
  { id: '4', name: 'Developer', description: 'Application development' },
  { id: '5', name: 'QA Lead', description: 'Quality assurance' },
  { id: '6', name: 'Business Analyst', description: 'Requirements & analysis' },
];

export const usePlannerStore = create((set, get) => ({
  projects: DEMO_PROJECTS,
  activeProject: DEMO_PROJECTS[0] || null,
  roles: DEMO_ROLES,
  expandedWBSNodes: new Set(),
  selectedWBSItem: null,
  ganttZoom: 'month',
  isLoading: false,
  error: null,

  // Project management
  fetchProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ projects: data || DEMO_PROJECTS, isLoading: false });
      return data || DEMO_PROJECTS;
    } catch (err) {
      console.warn('Could not fetch projects, using demo data:', err.message);
      set({ projects: DEMO_PROJECTS, isLoading: false });
      return DEMO_PROJECTS;
    }
  },

  createProject: async (project) => {
    try {
      const newProject = {
        ...project,
        id: crypto.randomUUID(),
        wbs: [],
        team: [],
        raci: [],
        milestones: [],
        created_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('projects')
        .insert([newProject])
        .select()
        .single();

      if (error) throw error;

      set(state => ({
        projects: [data, ...state.projects],
        activeProject: data,
      }));

      return data;
    } catch (err) {
      console.error('Error creating project:', err.message);
      set({ error: err.message });
      throw err;
    }
  },

  updateProject: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      set(state => ({
        projects: state.projects.map(p => p.id === id ? data : p),
        activeProject: state.activeProject?.id === id ? data : state.activeProject,
      }));

      return data;
    } catch (err) {
      console.error('Error updating project:', err.message);
      set({ error: err.message });
      throw err;
    }
  },

  deleteProject: async (id) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        projects: state.projects.filter(p => p.id !== id),
        activeProject: state.activeProject?.id === id ? null : state.activeProject,
      }));

      return true;
    } catch (err) {
      console.error('Error deleting project:', err.message);
      set({ error: err.message });
      throw err;
    }
  },

  selectProject: (project) => {
    set({ activeProject: project });
  },

  // WBS management
  addWBSItem: (item) => {
    set(state => {
      if (!state.activeProject) return state;
      return {
        activeProject: {
          ...state.activeProject,
          wbs: [...state.activeProject.wbs, item],
        },
      };
    });
  },

  updateWBSItem: (itemId, updates) => {
    set(state => {
      if (!state.activeProject) return state;
      return {
        activeProject: {
          ...state.activeProject,
          wbs: state.activeProject.wbs.map(item =>
            item.id === itemId ? { ...item, ...updates } : item
          ),
        },
      };
    });
  },

  deleteWBSItem: (itemId) => {
    set(state => {
      if (!state.activeProject) return state;
      return {
        activeProject: {
          ...state.activeProject,
          wbs: state.activeProject.wbs.filter(item => item.id !== itemId),
        },
      };
    });
  },

  // Team management
  addTeamMember: (member) => {
    set(state => {
      if (!state.activeProject) return state;
      return {
        activeProject: {
          ...state.activeProject,
          team: [...state.activeProject.team, member],
        },
      };
    });
  },

  updateTeamMember: (memberId, updates) => {
    set(state => {
      if (!state.activeProject) return state;
      return {
        activeProject: {
          ...state.activeProject,
          team: state.activeProject.team.map(member =>
            member.id === memberId ? { ...member, ...updates } : member
          ),
        },
      };
    });
  },

  removeTeamMember: (memberId) => {
    set(state => {
      if (!state.activeProject) return state;
      return {
        activeProject: {
          ...state.activeProject,
          team: state.activeProject.team.filter(member => member.id !== memberId),
        },
      };
    });
  },

  // RACI management
  updateRACICell: (taskId, roleId, responsibility) => {
    set(state => {
      if (!state.activeProject) return state;
      const existing = state.activeProject.raci.find(
        r => r.taskId === taskId && r.roleId === roleId
      );

      let newRaci;
      if (existing) {
        newRaci = state.activeProject.raci.map(r =>
          r.taskId === taskId && r.roleId === roleId
            ? { ...r, responsibility }
            : r
        );
      } else {
        newRaci = [...state.activeProject.raci, {
          id: crypto.randomUUID(),
          taskId,
          roleId,
          responsibility,
        }];
      }

      return {
        activeProject: {
          ...state.activeProject,
          raci: newRaci,
        },
      };
    });
  },

  // UI state
  toggleWBSNode: (nodeId) => {
    set(state => {
      const newExpanded = new Set(state.expandedWBSNodes);
      if (newExpanded.has(nodeId)) {
        newExpanded.delete(nodeId);
      } else {
        newExpanded.add(nodeId);
      }
      return { expandedWBSNodes: newExpanded };
    });
  },

  selectWBSItem: (item) => {
    set({ selectedWBSItem: item });
  },

  setGanttZoom: (zoom) => {
    set({ ganttZoom: zoom });
  },

  clearError: () => set({ error: null }),
}));

import { create } from 'zustand';
import { isSupabaseConfigured, supabase } from './supabaseClient';

const DEMO_AUDIT_LOGS = [
  {
    id: '1',
    userId: 'u1',
    username: 'admin',
    action: 'CREATE',
    resource: 'catalogue',
    resourceId: 'cat1',
    resourceName: 'Cloud Migration (Tier 1)',
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    details: 'Created new pricing catalogue',
    changes: { before: {}, after: { name: 'Cloud Migration (Tier 1)', type: 'Migration' } },
  },
  {
    id: '2',
    userId: 'u2',
    username: 'analyst',
    action: 'UPDATE',
    resource: 'catalogue',
    resourceId: 'cat2',
    resourceName: 'App Development Platform',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    details: 'Updated pricing parameters',
    changes: { before: { baseCost: 25000 }, after: { baseCost: 30000 } },
  },
  {
    id: '3',
    userId: 'u1',
    username: 'admin',
    action: 'DELETE',
    resource: 'catalogue',
    resourceId: 'cat3',
    resourceName: 'Legacy Template',
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    details: 'Deleted archived catalogue',
    changes: { before: { name: 'Legacy Template' }, after: {} },
  },
];

const DEMO_PRICING_TYPES = [
  { id: '1', name: 'Cloud Migration', description: 'Infrastructure cloud transition', icon: '☁️', category: 'Infrastructure', active: true },
  { id: '2', name: 'App Development', description: 'Custom application development', icon: '💻', category: 'Development', active: true },
  { id: '3', name: 'Data Architecture', description: 'Enterprise data solutions', icon: '📊', category: 'Data', active: true },
  { id: '4', name: 'Security Implementation', description: 'Security hardening & compliance', icon: '🔒', category: 'Security', active: true },
  { id: '5', name: 'Change Management', description: 'Organizational change consulting', icon: '🔄', category: 'Consulting', active: false },
];

const SYSTEM_STATUS_INIT = {
  api: 'operational',
  database: 'connected',
  supabase: 'configured',
  lastBackup: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  uptime: '99.8%',
  version: '1.0.0',
};

const DEMO_ROLES = [
  {
    id: 'r1',
    name: 'Admin',
    description: 'Full system access',
    permissions: { create: true, edit: true, delete: true, admin: true, export: true },
    users: 3,
    active: true,
  },
  {
    id: 'r2',
    name: 'Analyst',
    description: 'Can create and edit catalogues',
    permissions: { create: true, edit: true, delete: false, admin: false, export: true },
    users: 5,
    active: true,
  },
  {
    id: 'r3',
    name: 'Viewer',
    description: 'Read-only access',
    permissions: { create: false, edit: false, delete: false, admin: false, export: true },
    users: 12,
    active: true,
  },
];

const normalizeAuditLog = (log) => ({
  ...log,
  userId: log.userId || log.user_id,
  resource: log.resource || log.resource_type,
  resourceId: log.resourceId || log.resource_id,
  details: log.details || log.detail,
  timestamp: log.timestamp,
});

export const useAdminStore = create((set, get) => ({
  roles: DEMO_ROLES,
  auditLogs: DEMO_AUDIT_LOGS,
  pricingTypes: DEMO_PRICING_TYPES,
  systemStatus: SYSTEM_STATUS_INIT,
  selectedUser: null,
  editingRole: null,
  isLoading: false,
  error: null,

  // Audit log management
  fetchAuditLogs: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      let query = supabase.from('audit_logs').select('*');

      if (filters.userId) {
        query = query.eq('user_id', filters.userId);
      }
      if (filters.action) {
        query = query.eq('action', filters.action);
      }
      if (filters.resource) {
        query = query.eq('resource_type', filters.resource);
      }

      const { data, error } = await query.order('timestamp', { ascending: false });

      if (error) throw error;
      const logs = data?.length ? data.map(normalizeAuditLog) : DEMO_AUDIT_LOGS;
      set({ auditLogs: logs, isLoading: false });
      return logs;
    } catch (err) {
      console.warn('Could not fetch audit logs, using demo data:', err.message);
      set({ auditLogs: DEMO_AUDIT_LOGS, isLoading: false });
      return DEMO_AUDIT_LOGS;
    }
  },

  logAction: async (action) => {
    try {
      const newLog = {
        id: crypto.randomUUID(),
        ...action,
        timestamp: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('audit_logs')
        .insert([newLog])
        .select()
        .single();

      if (error) throw error;

      set(state => ({
        auditLogs: [data, ...state.auditLogs],
      }));

      return data;
    } catch (err) {
      console.error('Error logging action:', err.message);
      // Still add to local logs even if Supabase fails
      set(state => ({
        auditLogs: [{
          id: crypto.randomUUID(),
          ...action,
          timestamp: new Date().toISOString(),
        }, ...state.auditLogs],
      }));
    }
  },

  // Pricing types management
  fetchPricingTypes: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('pricing_types')
        .select('*')
        .order('name');

      if (error) throw error;
      set({ pricingTypes: data || DEMO_PRICING_TYPES, isLoading: false });
      return data || DEMO_PRICING_TYPES;
    } catch (err) {
      console.warn('Could not fetch pricing types, using demo data:', err.message);
      set({ pricingTypes: DEMO_PRICING_TYPES, isLoading: false });
      return DEMO_PRICING_TYPES;
    }
  },

  createPricingType: async (pricingType) => {
    try {
      const newType = {
        ...pricingType,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('pricing_types')
        .insert([newType])
        .select()
        .single();

      if (error) throw error;

      set(state => ({
        pricingTypes: [...state.pricingTypes, data],
      }));

      return data;
    } catch (err) {
      console.error('Error creating pricing type:', err.message);
      set({ error: err.message });
      throw err;
    }
  },

  updatePricingType: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('pricing_types')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      set(state => ({
        pricingTypes: state.pricingTypes.map(t => t.id === id ? data : t),
      }));

      return data;
    } catch (err) {
      console.error('Error updating pricing type:', err.message);
      set({ error: err.message });
      throw err;
    }
  },

  deletePricingType: async (id) => {
    try {
      const { error } = await supabase
        .from('pricing_types')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        pricingTypes: state.pricingTypes.filter(t => t.id !== id),
      }));

      return true;
    } catch (err) {
      console.error('Error deleting pricing type:', err.message);
      set({ error: err.message });
      throw err;
    }
  },

  // System status
  fetchSystemStatus: async () => {
    try {
      // In real app, would fetch from backend
      set({ systemStatus: SYSTEM_STATUS_INIT });
      return SYSTEM_STATUS_INIT;
    } catch (err) {
      console.error('Error fetching system status:', err.message);
      set({ error: err.message });
    }
  },

  updateSystemStatus: (updates) => {
    set(state => ({
      systemStatus: { ...state.systemStatus, ...updates },
    }));
  },

  fetchRoles: async () => {
    if (!isSupabaseConfigured) {
      return get().roles;
    }

    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .order('name');

      if (error) throw error;
      const roles = data?.length ? data.map(role => ({
        ...role,
        permissions: role.permissions || {},
        active: role.active ?? true,
      })) : DEMO_ROLES;
      set({ roles, isLoading: false });
      return roles;
    } catch (err) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  // Selection
  selectUser: (user) => {
    set({ selectedUser: user });
  },

  selectRole: (role) => {
    set({ editingRole: role });
  },

  addRole: async (role) => {
    const newRole = {
      ...role,
      active: true,
    };

    if (!isSupabaseConfigured) {
      const localRole = { ...newRole, id: crypto.randomUUID(), users: 0 };
      set({ roles: [...get().roles, localRole] });
      return localRole;
    }

    let { data, error } = await supabase.from('roles').insert([newRole]).select().single();
    if (error) {
      const fallback = await supabase
        .from('roles')
        .insert([{ name: newRole.name }])
        .select()
        .single();
      if (fallback.error) throw error;
      data = fallback.data;
    }
    const roles = [...get().roles, data];
    set({ roles });
    return data;
  },

  updateRole: async (roleId, updates) => {
    if (isSupabaseConfigured) {
      const result = await supabase.from('roles').update(updates).eq('id', roleId).select().single();
      if (result.error) {
        const fallback = await supabase
          .from('roles')
          .update({ name: updates.name })
          .eq('id', roleId)
          .select()
          .single();
        if (fallback.error) throw result.error;
        updates = fallback.data;
      } else {
        updates = result.data;
      }
    }
    const roles = get().roles.map(role => role.id === roleId ? { ...role, ...updates } : role);
    set({ roles });
  },

  deleteRole: async (roleId) => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('roles').delete().eq('id', roleId);
      if (error) throw error;
    }
    const roles = get().roles.filter(role => role.id !== roleId);
    set({ roles });
  },

  clearError: () => set({ error: null }),
}));

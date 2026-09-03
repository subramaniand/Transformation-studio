import { create } from 'zustand';
import { supabase } from './supabaseClient';

// Demo users for offline/initial use
const DEMO_USERS = [
  { id: 'u1', username: 'admin', password: 'admin123', name: 'Admin User', role: 'admin', email: 'admin@co.com', active: true, created: '2024-01-01', function: 'Operations' },
  { id: 'u2', username: 'analyst', password: 'analyst123', name: 'Jane Analyst', role: 'analyst', email: 'jane@co.com', active: true, created: '2024-01-05', function: 'Finance' },
  { id: 'u3', username: 'viewer', password: 'view123', name: 'Bob Viewer', role: 'viewer', email: 'bob@co.com', active: true, created: '2024-01-10', function: 'Technology/IT' },
];

const ROLE_PERMISSIONS = {
  admin: { edit: 1, admin: 1, del: 1, create: 1, export: 1 },
  analyst: { edit: 1, admin: 0, del: 0, create: 1, export: 1 },
  viewer: { edit: 0, admin: 0, del: 0, create: 0, export: 1 },
};

export const useAuthStore = create((set, get) => ({
  user: null,
  users: [],
  isLoading: false,
  error: null,
  theme: 'ust-light',

  // Login user
  login: async (username, password) => {
    set({ isLoading: true, error: null });
    try {
      // First try Supabase
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .single();

      if (!error && data) {
        set({ user: data, isLoading: false });
        localStorage.setItem('auth_user', JSON.stringify(data));
        return { success: true, user: data };
      }

      // Fallback to demo users if no Supabase connection
      const demoUser = DEMO_USERS.find(u => u.username === username && u.password === password);
      if (demoUser) {
        set({ user: demoUser, isLoading: false });
        localStorage.setItem('auth_user', JSON.stringify(demoUser));
        return { success: true, user: demoUser };
      }

      throw new Error('Invalid username or password');
    } catch (err) {
      set({ error: err.message, isLoading: false });
      return { success: false, error: err.message };
    }
  },

  // Logout user
  logout: () => {
    set({ user: null });
    localStorage.removeItem('auth_user');
  },

  // Restore session
  restoreSession: () => {
    const stored = localStorage.getItem('auth_user');
    if (stored) {
      set({ user: JSON.parse(stored) });
    }
  },

  // Fetch all users (admin only)
  fetchUsers: async () => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase.from('users').select('*');
      if (error) throw error;
      set({ users: data || DEMO_USERS, isLoading: false });
    } catch (err) {
      console.warn('Could not fetch users from Supabase, using demo data');
      set({ users: DEMO_USERS, isLoading: false });
    }
  },

  // Update user
  updateUser: async (userId, updates) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;

      // Update local users list
      set(state => ({
        users: state.users.map(u => u.id === userId ? data : u),
        user: state.user?.id === userId ? data : state.user,
      }));

      if (data) {
        localStorage.setItem('auth_user', JSON.stringify(data));
      }

      return data;
    } catch (err) {
      console.error('Error updating user:', err.message);
      throw err;
    }
  },

  // Set theme
  setTheme: (theme) => {
    set({ theme });
    localStorage.setItem('theme', theme);
    document.documentElement.className = theme === 'default' ? '' : theme;
  },

  // Restore theme
  restoreTheme: () => {
    const stored = localStorage.getItem('theme') || 'default';
    set({ theme: stored });
    document.documentElement.className = stored === 'default' ? '' : stored;
  },

  // Check permission
  hasPermission: (permission) => {
    const { user } = get();
    if (!user) return false;
    return ROLE_PERMISSIONS[user.role]?.[permission] === 1;
  },
}));

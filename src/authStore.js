import { create } from 'zustand';
import { isSupabaseConfigured, supabase } from './supabaseClient';

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
  users: DEMO_USERS,
  isLoading: false,
  error: null,
  theme: 'ust-light',

  // Login user
  login: async (username, password) => {
    set({ isLoading: true, error: null });
    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('username', username)
          .eq('password', password)
          .single();

        if (!error && data) {
          set({ user: data, isLoading: false });
          return { success: true, user: data };
        }
      }

      // Fallback to demo users if no Supabase connection
      const demoUser = DEMO_USERS.find(u => u.username === username && u.password === password);
      if (demoUser) {
        set({ user: demoUser, isLoading: false });
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
  },

  // Fetch all users (admin only)
  fetchUsers: async () => {
    if (!isSupabaseConfigured) {
      return get().users;
    }

    set({ isLoading: true });
    try {
      const { data, error } = await supabase.from('users').select('*');
      if (error) throw error;
      const users = data?.length ? data : DEMO_USERS;
      set({ users, isLoading: false });
      return users;
    } catch (err) {
      console.warn('Could not fetch users from Supabase, using demo data');
      const users = DEMO_USERS;
      set({ users, isLoading: false });
      return users;
    }
  },

  // Add new user
  addUser: async (newUser) => {
    try {
      const user = {
        ...newUser,
        id: crypto.randomUUID(),
        created: new Date().toISOString().split('T')[0],
        active: true,
      };

      if (!isSupabaseConfigured) {
        const users = [...get().users, user];
        set({ users });
        return user;
      }

      const { data, error } = await supabase
        .from('users')
        .insert([user])
        .select()
        .single();

      if (error) throw error;

      set(state => ({
        users: [...state.users, data || user],
      }));

      return data || user;
    } catch (err) {
      console.error('Error adding user:', err.message);
      // Still add to local list even if Supabase fails
      set(state => ({
        users: [...state.users, user],
      }));
      return user;
    }
  },

  // Update user
  updateUser: async (userId, updates) => {
    if (!isSupabaseConfigured) {
      const users = get().users.map(user => user.id === userId ? { ...user, ...updates } : user);
      const updatedUser = users.find(user => user.id === userId);
      set({
        users,
        user: get().user?.id === userId ? updatedUser : get().user,
      });
      if (updatedUser?.id === get().user?.id) {
      }
      return updatedUser;
    }

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
        users: state.users.map(u => u.id === userId ? (data || { ...u, ...updates }) : u),
        user: state.user?.id === userId ? (data || { ...state.user, ...updates }) : state.user,
      }));
      return data;
    } catch (err) {
      console.error('Error updating user:', err.message);
      // Still update local list even if Supabase fails
      set(state => ({
        users: state.users.map(u => u.id === userId ? { ...u, ...updates } : u),
        user: state.user?.id === userId ? { ...state.user, ...updates } : state.user,
      }));
      return get().users.find(user => user.id === userId);
    }
  },

  // Delete user
  deleteUser: async (userId) => {
    if (!isSupabaseConfigured) {
      const users = get().users.filter(user => user.id !== userId);
      set({ users, user: get().user?.id === userId ? null : get().user });
      return true;
    }

    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      set(state => ({
        users: state.users.filter(u => u.id !== userId),
        user: state.user?.id === userId ? null : state.user,
      }));
      return true;
    } catch (err) {
      console.error('Error deleting user:', err.message);
      // Still delete from local list even if Supabase fails
      set(state => ({
        users: state.users.filter(u => u.id !== userId),
        user: state.user?.id === userId ? null : state.user,
      }));
      return true;
    }
  },

  // Set theme
  setTheme: (theme) => {
    set({ theme });
    document.documentElement.className = theme === 'default' ? '' : theme;
  },

  // Check permission
  hasPermission: (permission) => {
    const { user } = get();
    if (!user) return false;
    return ROLE_PERMISSIONS[user.role]?.[permission] === 1;
  },
}));

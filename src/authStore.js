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

const getStoredUsers = () => {
  try {
    const stored = localStorage.getItem('users');
    return stored ? JSON.parse(stored) : DEMO_USERS;
  } catch {
    return DEMO_USERS;
  }
};

const persistUsers = (users) => {
  localStorage.setItem('users', JSON.stringify(users));
};

export const useAuthStore = create((set, get) => ({
  user: null,
  users: getStoredUsers(),
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
          localStorage.setItem('auth_user', JSON.stringify(data));
          return { success: true, user: data };
        }
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
    if (!isSupabaseConfigured) {
      return get().users;
    }

    set({ isLoading: true });
    try {
      const { data, error } = await supabase.from('users').select('*');
      if (error) throw error;
      const users = data?.length ? data : getStoredUsers();
      persistUsers(users);
      set({ users, isLoading: false });
      return users;
    } catch (err) {
      console.warn('Could not fetch users from Supabase, using demo data');
      const users = getStoredUsers();
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
        persistUsers(users);
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
      persistUsers(get().users);

      return data || user;
    } catch (err) {
      console.error('Error adding user:', err.message);
      // Still add to local list even if Supabase fails
      set(state => ({
        users: [...state.users, {
          ...newUser,
          id: crypto.randomUUID(),
          created: new Date().toISOString().split('T')[0],
          active: true,
        }],
      }));
      throw err;
    }
  },

  // Update user
  updateUser: async (userId, updates) => {
    if (!isSupabaseConfigured) {
      const users = get().users.map(user => user.id === userId ? { ...user, ...updates } : user);
      const updatedUser = users.find(user => user.id === userId);
      persistUsers(users);
      set({
        users,
        user: get().user?.id === userId ? updatedUser : get().user,
      });
      if (updatedUser?.id === get().user?.id) {
        localStorage.setItem('auth_user', JSON.stringify(updatedUser));
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
      persistUsers(get().users);

      if (data) {
        localStorage.setItem('auth_user', JSON.stringify(data));
      }

      return data;
    } catch (err) {
      console.error('Error updating user:', err.message);
      // Still update local list even if Supabase fails
      set(state => ({
        users: state.users.map(u => u.id === userId ? { ...u, ...updates } : u),
        user: state.user?.id === userId ? { ...state.user, ...updates } : state.user,
      }));
      persistUsers(get().users);
      throw err;
    }
  },

  // Delete user
  deleteUser: async (userId) => {
    if (!isSupabaseConfigured) {
      const users = get().users.filter(user => user.id !== userId);
      persistUsers(users);
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
      persistUsers(get().users);

      return true;
    } catch (err) {
      console.error('Error deleting user:', err.message);
      // Still delete from local list even if Supabase fails
      set(state => ({
        users: state.users.filter(u => u.id !== userId),
        user: state.user?.id === userId ? null : state.user,
      }));
      persistUsers(get().users);
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

import { create } from 'zustand';
import { supabase } from './supabaseClient';

export const usePricingStore = create((set, get) => ({
  catalogues: [],
  currentCatalogue: null,
  isLoading: false,
  error: null,

  // Fetch catalogues
  fetchCatalogues: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('catalogues')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ catalogues: data || [], isLoading: false });
      return data || [];
    } catch (err) {
      console.error('Error fetching catalogues:', err.message);
      set({ error: err.message, isLoading: false });
      return [];
    }
  },

  // Create catalogue
  createCatalogue: async (catalogue) => {
    try {
      const newCat = {
        ...catalogue,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('catalogues')
        .insert([newCat])
        .select()
        .single();

      if (error) throw error;

      set(state => ({
        catalogues: [data, ...state.catalogues],
      }));

      return data;
    } catch (err) {
      console.error('Error creating catalogue:', err.message);
      set({ error: err.message });
      throw err;
    }
  },

  // Update catalogue
  updateCatalogue: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('catalogues')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      set(state => ({
        catalogues: state.catalogues.map(c => c.id === id ? data : c),
        currentCatalogue: state.currentCatalogue?.id === id ? data : state.currentCatalogue,
      }));

      return data;
    } catch (err) {
      console.error('Error updating catalogue:', err.message);
      set({ error: err.message });
      throw err;
    }
  },

  // Delete catalogue
  deleteCatalogue: async (id) => {
    try {
      const { error } = await supabase
        .from('catalogues')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        catalogues: state.catalogues.filter(c => c.id !== id),
        currentCatalogue: state.currentCatalogue?.id === id ? null : state.currentCatalogue,
      }));

      return true;
    } catch (err) {
      console.error('Error deleting catalogue:', err.message);
      set({ error: err.message });
      throw err;
    }
  },

  // Set current catalogue
  selectCatalogue: (catalogue) => {
    set({ currentCatalogue: catalogue });
  },

  // Clear error
  clearError: () => set({ error: null }),
}));

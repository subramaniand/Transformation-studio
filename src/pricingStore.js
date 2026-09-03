import { create } from 'zustand';
import { isSupabaseConfigured, supabase } from './supabaseClient';

const DEMO_TIERS = [
  { id: '1', name: 'Standard', costMultiplier: 1, color: '#004b87', description: 'Standard implementation' },
  { id: '2', name: 'Premium', costMultiplier: 1.5, color: '#e67e22', description: 'Premium with enhancements' },
  { id: '3', name: 'Enterprise', costMultiplier: 2.5, color: '#27ae60', description: 'Full enterprise solution' },
];

const DEMO_PARAMETER_GROUPS = [
  { id: 'g1', name: 'Base Parameters', order: 1 },
  { id: 'g2', name: 'Team Allocation', order: 2 },
  { id: 'g3', name: 'Risk & Quality', order: 3 },
  { id: 'g4', name: 'Infrastructure', order: 4 },
];

const DEMO_PARAMETERS = [
  { id: 'p1', groupId: 'g1', name: 'Base Cost', type: 'currency', defaultValue: 25000, min: 5000, max: 500000 },
  { id: 'p2', groupId: 'g1', name: 'Implementation Days', type: 'number', defaultValue: 90, min: 30, max: 365 },
  { id: 'p3', groupId: 'g2', name: 'Team Size', type: 'number', defaultValue: 5, min: 1, max: 50 },
  { id: 'p4', groupId: 'g2', name: 'Daily Rate per Person', type: 'currency', defaultValue: 1000, min: 500, max: 3000 },
  { id: 'p5', groupId: 'g3', name: 'Risk Level', type: 'select', defaultValue: 'medium', options: ['low', 'medium', 'high'] },
  { id: 'p6', groupId: 'g3', name: 'Quality Multiplier', type: 'number', defaultValue: 1.0, min: 0.5, max: 2.0 },
  { id: 'p7', groupId: 'g4', name: 'Infrastructure Cost', type: 'currency', defaultValue: 10000, min: 0, max: 100000 },
];

const DEMO_CATALOGUES = [
  {
    id: '1',
    name: 'Cloud Migration (Tier 1)',
    type: 'Migration',
    tier: 0,
    description: 'Basic cloud infrastructure setup',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    parameters: {
      'p1': 25000,
      'p2': 90,
      'p3': 5,
      'p4': 1000,
      'p5': 'medium',
      'p6': 1.0,
      'p7': 10000,
    },
    tiers: DEMO_TIERS,
    estimates: [
      {
        id: 'e1',
        scenarioName: 'Standard Implementation',
        adjustments: { 'p3': 5, 'p6': 1.0 },
        totalCost: 475000,
        notes: 'Standard 5-person team',
      },
      {
        id: 'e2',
        scenarioName: 'Accelerated Timeline',
        adjustments: { 'p3': 8, 'p6': 1.2, 'p5': 'high' },
        totalCost: 756000,
        notes: 'Larger team for faster delivery',
      },
    ],
  },
  {
    id: '2',
    name: 'App Development Platform',
    type: 'App Development',
    tier: 1,
    description: 'Full application development stack',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    parameters: {
      'p1': 50000,
      'p2': 180,
      'p3': 8,
      'p4': 1200,
      'p5': 'medium',
      'p6': 1.1,
      'p7': 25000,
    },
    tiers: DEMO_TIERS,
    estimates: [],
  },
  {
    id: '3',
    name: 'Data Lake Architecture',
    type: 'Data Architecture',
    tier: 2,
    description: 'Enterprise data architecture setup',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    parameters: {
      'p1': 75000,
      'p2': 120,
      'p3': 10,
      'p4': 1500,
      'p5': 'high',
      'p6': 1.2,
      'p7': 50000,
    },
    tiers: DEMO_TIERS,
    estimates: [],
  },
];

export const usePricingStore = create((set, get) => ({
  catalogues: DEMO_CATALOGUES,
  currentCatalogue: null,
  tiers: DEMO_TIERS,
  parameterGroups: DEMO_PARAMETER_GROUPS,
  parameters: DEMO_PARAMETERS,
  currentView: 'list',
  filters: { type: '', tier: null, search: '' },
  isLoading: false,
  error: null,

  // Fetch catalogues
  fetchCatalogues: async () => {
    set({ isLoading: true, error: null });
    if (!isSupabaseConfigured) {
      set({ isLoading: false });
      return get().catalogues;
    }

    try {
      const { data, error } = await supabase
        .from('catalogues')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      const catalogues = data?.length ? data : DEMO_CATALOGUES;
      set({ catalogues, isLoading: false });
      return catalogues;
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

  // View management
  setView: (view) => {
    set({ currentView: view });
  },

  // Filter management
  setFilters: (filters) => {
    set({ filters });
  },

  // Tier management
  addTier: (tier) => {
    set(state => ({
      tiers: [...state.tiers, { ...tier, id: crypto.randomUUID() }],
    }));
  },

  updateTier: (tierId, updates) => {
    set(state => ({
      tiers: state.tiers.map(t => t.id === tierId ? { ...t, ...updates } : t),
    }));
  },

  deleteTier: (tierId) => {
    set(state => ({
      tiers: state.tiers.filter(t => t.id !== tierId),
    }));
  },

  // Parameter management
  updateParameter: (parameterId, updates) => {
    set(state => ({
      parameters: state.parameters.map(p => p.id === parameterId ? { ...p, ...updates } : p),
    }));
  },

  // Estimate management
  addEstimate: (catalogueId, estimate) => {
    set(state => ({
      catalogues: state.catalogues.map(c =>
        c.id === catalogueId
          ? { ...c, estimates: [...(c.estimates || []), { ...estimate, id: crypto.randomUUID() }] }
          : c
      ),
      currentCatalogue: state.currentCatalogue?.id === catalogueId
        ? {
          ...state.currentCatalogue,
          estimates: [...(state.currentCatalogue.estimates || []), { ...estimate, id: crypto.randomUUID() }],
        }
        : state.currentCatalogue,
    }));
  },

  updateEstimate: (catalogueId, estimateId, updates) => {
    set(state => ({
      catalogues: state.catalogues.map(c =>
        c.id === catalogueId
          ? {
            ...c,
            estimates: c.estimates.map(e => e.id === estimateId ? { ...e, ...updates } : e),
          }
          : c
      ),
      currentCatalogue: state.currentCatalogue?.id === catalogueId
        ? {
          ...state.currentCatalogue,
          estimates: state.currentCatalogue.estimates.map(e =>
            e.id === estimateId ? { ...e, ...updates } : e
          ),
        }
        : state.currentCatalogue,
    }));
  },

  deleteEstimate: (catalogueId, estimateId) => {
    set(state => ({
      catalogues: state.catalogues.map(c =>
        c.id === catalogueId
          ? { ...c, estimates: c.estimates.filter(e => e.id !== estimateId) }
          : c
      ),
      currentCatalogue: state.currentCatalogue?.id === catalogueId
        ? {
          ...state.currentCatalogue,
          estimates: state.currentCatalogue.estimates.filter(e => e.id !== estimateId),
        }
        : state.currentCatalogue,
    }));
  },

  // Catalogue parameters
  updateCatalogueParameters: (catalogueId, parameters) => {
    set(state => ({
      catalogues: state.catalogues.map(c =>
        c.id === catalogueId ? { ...c, parameters } : c
      ),
      currentCatalogue: state.currentCatalogue?.id === catalogueId
        ? { ...state.currentCatalogue, parameters }
        : state.currentCatalogue,
    }));
  },

  // Estimate calculator
  calculateEstimate: (catalogue, adjustments = {}) => {
    const params = { ...catalogue.parameters, ...adjustments };
    const baseCost = params.p1 || 25000;
    const teamSize = params.p3 || 5;
    const dailyRate = params.p4 || 1000;
    const days = params.p2 || 90;
    const qualityMultiplier = params.p6 || 1.0;
    const infraCost = params.p7 || 10000;

    const laborCost = teamSize * dailyRate * days;
    const totalCost = Math.round((baseCost + laborCost + infraCost) * qualityMultiplier);

    return {
      baseCost,
      laborCost,
      infraCost,
      totalCost,
      teamSize,
      days,
    };
  },

  // Export functions
  exportJSON: (catalogue) => {
    return JSON.stringify(catalogue, null, 2);
  },

  exportCSV: (catalogues) => {
    const headers = ['Name', 'Type', 'Tier', 'Base Cost', 'Team Size', 'Days'];
    const rows = catalogues.map(c => [
      c.name,
      c.type,
      c.tier,
      c.parameters.p1 || 'N/A',
      c.parameters.p3 || 'N/A',
      c.parameters.p2 || 'N/A',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(',')),
    ].join('\n');

    return csvContent;
  },

  // Clear error
  clearError: () => set({ error: null }),
}));

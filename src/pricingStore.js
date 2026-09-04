import { create } from 'zustand';
import { isSupabaseConfigured, supabase } from './supabaseClient';

const DEMO_TIERS = [
  { id: '1', name: 'Very Simple', costMultiplier: 0.5, costLo: 50000, costHi: 100000, timeline: '4-8 weeks', team: '2-4', color: '#1a9e6e', description: 'Low-complexity change' },
  { id: '2', name: 'Simple', costMultiplier: 1, costLo: 100000, costHi: 250000, timeline: '8-16 weeks', team: '4-8', color: '#4a9d3f', description: 'Straightforward delivery' },
  { id: '3', name: 'Medium', costMultiplier: 2.5, costLo: 300000, costHi: 700000, timeline: '4-6 months', team: '8-14', color: '#c97b00', description: 'Moderate transformation' },
  { id: '4', name: 'Complex', costMultiplier: 7, costLo: 800000, costHi: 2000000, timeline: '9-15 months', team: '15-25', color: '#c05020', description: 'Complex enterprise change' },
  { id: '5', name: 'Very Complex', costMultiplier: 15, costLo: 2500000, costHi: 7000000, timeline: '18-36 months', team: '25-50', color: '#a32d2d', description: 'Large-scale transformation' },
];

const DEMO_PARAMETER_GROUPS = [
  { id: 'g1', name: 'Scale & Users', order: 1, icon: '👥' },
  { id: 'g2', name: 'Application Portfolio', order: 2, icon: '🗂' },
  { id: 'g3', name: 'Integration', order: 3, icon: '🔗' },
  { id: 'g4', name: 'Data & Infra', order: 4, icon: '🗄' },
  { id: 'g5', name: 'Security & Compliance', order: 5, icon: '🔒' },
  { id: 'g6', name: 'AI & ML', order: 6, icon: '🧠' },
  { id: 'g7', name: 'Testing & QA', order: 7, icon: '✅' },
  { id: 'g8', name: 'Change & Cutover', order: 8, icon: '🚀' },
  { id: 'g9', name: 'M&A Context', order: 9, icon: '🤝' },
];

const DEMO_PARAMETERS = [
  { id: 'p1', groupId: 'g1', name: 'Total users', type: 'number', defaultValue: 200, min: 0, max: 100000 },
  { id: 'p2', groupId: 'g1', name: 'Concurrent users', type: 'number', defaultValue: 80, min: 0, max: 100000 },
  { id: 'p3', groupId: 'g1', name: 'Geographic regions', type: 'number', defaultValue: 2, min: 1, max: 100 },
  { id: 'p4', groupId: 'g1', name: 'Business units', type: 'number', defaultValue: 3, min: 1, max: 100 },
  { id: 'p5', groupId: 'g2', name: 'Total applications', type: 'number', defaultValue: 15, min: 0, max: 10000 },
  { id: 'p6', groupId: 'g2', name: 'Custom-built apps', type: 'number', defaultValue: 8, min: 0, max: 10000 },
  { id: 'p7', groupId: 'g2', name: 'COTS products', type: 'number', defaultValue: 3, min: 0, max: 10000 },
  { id: 'p8', groupId: 'g2', name: 'Legacy / mainframe', type: 'number', defaultValue: 2, min: 0, max: 10000 },
  { id: 'p9', groupId: 'g2', name: 'Codebase (KLOC)', type: 'number', defaultValue: 50, min: 0, max: 100000 },
  { id: 'p10', groupId: 'g3', name: 'Internal integrations', type: 'number', defaultValue: 10, min: 0, max: 10000 },
  { id: 'p11', groupId: 'g3', name: '3rd-party APIs', type: 'number', defaultValue: 5, min: 0, max: 10000 },
  { id: 'p12', groupId: 'g3', name: 'COTS integrations', type: 'number', defaultValue: 2, min: 0, max: 10000 },
  { id: 'p13', groupId: 'g3', name: 'Upstream dependencies', type: 'number', defaultValue: 4, min: 0, max: 10000 },
  { id: 'p14', groupId: 'g3', name: 'Downstream dependencies', type: 'number', defaultValue: 4, min: 0, max: 10000 },
  { id: 'p15', groupId: 'g4', name: 'Data volume (TB)', type: 'number', defaultValue: 10, min: 0, max: 100000 },
  { id: 'p16', groupId: 'g4', name: 'Servers / VMs', type: 'number', defaultValue: 50, min: 0, max: 100000 },
  { id: 'p17', groupId: 'g4', name: 'Databases', type: 'number', defaultValue: 8, min: 0, max: 10000 },
  { id: 'p18', groupId: 'g4', name: 'Environments', type: 'number', defaultValue: 4, min: 1, max: 100 },
  { id: 'p19', groupId: 'g4', name: 'Cloud providers', type: 'number', defaultValue: 1, min: 1, max: 10 },
  { id: 'p20', groupId: 'g5', name: 'Compliance frameworks', type: 'number', defaultValue: 2, min: 0, max: 100 },
  { id: 'p21', groupId: 'g5', name: 'Data classification', type: 'number', defaultValue: 3, min: 1, max: 10 },
  { id: 'p22', groupId: 'g5', name: 'Identity providers', type: 'number', defaultValue: 1, min: 1, max: 20 },
  { id: 'p23', groupId: 'g5', name: 'Security posture', type: 'select', defaultValue: 'Standard', options: ['Basic', 'Standard', 'Enhanced', 'Advanced', 'Military-grade'] },
  { id: 'p24', groupId: 'g6', name: 'AI use cases', type: 'number', defaultValue: 0, min: 0, max: 1000 },
  { id: 'p25', groupId: 'g6', name: 'Custom ML models', type: 'number', defaultValue: 0, min: 0, max: 1000 },
  { id: 'p26', groupId: 'g6', name: 'MLOps maturity', type: 'select', defaultValue: 'None', options: ['None', 'Basic', 'Standard', 'Advanced', 'Full MLOps'] },
  { id: 'p27', groupId: 'g7', name: 'Test automation (%)', type: 'number', defaultValue: 40, min: 0, max: 100 },
  { id: 'p28', groupId: 'g7', name: 'Performance test scenarios', type: 'number', defaultValue: 4, min: 0, max: 1000 },
  { id: 'p29', groupId: 'g7', name: 'Regression cycle (weeks)', type: 'number', defaultValue: 2, min: 0, max: 100 },
  { id: 'p30', groupId: 'g8', name: 'Cutover strategy', type: 'select', defaultValue: 'Phased', options: ['Big bang', 'Phased', 'Parallel run', 'Strangler fig', 'Canary'] },
  { id: 'p31', groupId: 'g8', name: 'Rollback complexity', type: 'select', defaultValue: 'Standard', options: ['Simple', 'Standard', 'Complex', 'Very complex', 'Near impossible'] },
  { id: 'p32', groupId: 'g8', name: 'Training hours / user', type: 'number', defaultValue: 4, min: 0, max: 100 },
  { id: 'p33', groupId: 'g9', name: 'Duplicate systems', type: 'number', defaultValue: 0, min: 0, max: 1000 },
  { id: 'p34', groupId: 'g9', name: 'Operating models', type: 'number', defaultValue: 1, min: 1, max: 100 },
  { id: 'p35', groupId: 'g9', name: 'Legal entities', type: 'number', defaultValue: 1, min: 1, max: 100 },
];

const DEMO_CATALOGUES = [
  {
    id: '1',
    name: 'DC Exit Programme',
    type: 'DC Exit',
    tier: 3,
    description: 'Data centre exit and continuity transformation',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    parameters: {
      p1: 994,
      p2: 220,
      p3: 6,
      p4: 3,
      p5: 40,
      p6: 20,
      p7: 4,
      p8: 2,
      p9: 65,
      p10: 12,
      p11: 8,
      p12: 3,
      p13: 5,
      p14: 7,
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
    name: 'App Development',
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
    name: 'AWS Landing Zone',
    type: 'Landing Zone',
    tier: 2,
    description: 'Cloud landing zone and platform foundation',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    parameters: { p1: 300, p2: 120, p3: 4, p4: 2, p5: 20, p6: 12, p7: 2 },
    tiers: DEMO_TIERS,
    estimates: [],
  },
  {
    id: '4',
    name: 'Data Architecture',
    type: 'Data Architecture',
    tier: 2,
    description: 'Enterprise data architecture and modernisation',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    parameters: { p1: 800, p2: 180, p3: 5, p4: 3, p15: 120, p17: 18, p19: 2 },
    tiers: DEMO_TIERS,
    estimates: [],
  },
  {
    id: '5',
    name: 'Integration Services',
    type: 'Integration',
    tier: 1,
    description: 'Integration estate simplification and delivery',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    parameters: { p1: 120, p2: 80, p10: 18, p11: 12, p13: 8, p14: 10 },
    tiers: DEMO_TIERS,
    estimates: [],
  },
  {
    id: '6',
    name: 'Strategy & APR',
    type: 'Strategy & APR',
    tier: 1,
    description: 'Strategy, assessment and planning roadmap',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    parameters: { p1: 60, p2: 30, p3: 2, p4: 2 },
    tiers: DEMO_TIERS,
    estimates: [],
  },
  {
    id: '7',
    name: 'AI Transformation',
    type: 'Custom',
    tier: 2,
    description: 'AI and ML adoption across the enterprise',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    parameters: { p1: 20, p2: 6, p24: 5, p25: 2, p26: 'Standard' },
    tiers: DEMO_TIERS,
    estimates: [],
  },
  {
    id: '8',
    name: 'Migration',
    type: 'Migration',
    tier: 2,
    description: 'Application and platform migration delivery',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    parameters: {
      p1: 450,
      p2: 150,
      p3: 6,
      p4: 4,
      p5: 30,
      p6: 10,
      p7: 4,
      p8: 3,
      p9: 80,
    },
    tiers: DEMO_TIERS,
    estimates: [],
  },
];

const normalizeCatalogue = (catalogue) => ({
  ...catalogue,
  parameters: catalogue.parameters || catalogue.params || {},
  tiers: catalogue.tiers?.length ? catalogue.tiers : DEMO_TIERS,
  estimates: catalogue.estimates || [],
});

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
      const catalogues = data?.length ? data.map(normalizeCatalogue) : DEMO_CATALOGUES;
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
        params: catalogue.parameters || {},
        parameters: undefined,
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

      const normalizedCatalogue = normalizeCatalogue(data);
      set(state => ({
        catalogues: [normalizedCatalogue, ...state.catalogues],
      }));

      return normalizedCatalogue;
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
          ...(updates.parameters ? { params: updates.parameters, parameters: undefined } : {}),
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      set(state => ({
        catalogues: state.catalogues.map(c => c.id === id ? normalizeCatalogue(data) : c),
        currentCatalogue: state.currentCatalogue?.id === id ? normalizeCatalogue(data) : state.currentCatalogue,
      }));

      return normalizeCatalogue(data);
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

  updateCatalogueTier: async (catalogueId, tier) => {
    const catalogue = get().catalogues.find(item => item.id === catalogueId);
    if (!catalogue) return;

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('catalogues')
        .update({ tier, updated_at: new Date().toISOString() })
        .eq('id', catalogueId)
        .select()
        .single();
      if (error) throw error;
      const updatedCatalogue = normalizeCatalogue(data);
      set(state => ({
        catalogues: state.catalogues.map(item => item.id === catalogueId ? updatedCatalogue : item),
        currentCatalogue: state.currentCatalogue?.id === catalogueId ? updatedCatalogue : state.currentCatalogue,
      }));
      return updatedCatalogue;
    }

    const updatedCatalogue = { ...catalogue, tier };
    set(state => ({
      catalogues: state.catalogues.map(item => item.id === catalogueId ? updatedCatalogue : item),
      currentCatalogue: state.currentCatalogue?.id === catalogueId ? updatedCatalogue : state.currentCatalogue,
    }));
    return updatedCatalogue;
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

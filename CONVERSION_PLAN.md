# Transformation Studio - HTML to React Conversion Plan

## Executive Summary

The current vanilla HTML/JS app is partially converted to React (basic shell exists). This plan outlines completing the conversion from a monolithic `Content.jsx` component with inline modal logic to a fully modularized, maintainable React architecture with proper separation of concerns and reusable components.

**Estimated scope**: 60-80 new/refactored components, 15-20 Zustand store extensions, comprehensive CSS organization, and approximately 2-3 weeks of development time for a team of 1-2 developers.

---

## Current State Analysis

### What Exists
- **Infrastructure**: Vite + React 18 + Zustand + Supabase client ✓
- **Stores**: `authStore` (login, users, theme), `pricingStore` (catalogues CRUD) ✓
- **Base Components**: `App`, `LoginShell`, `Sidebar`, `Topbar`, `Content` ✓
- **Styling**: Comprehensive CSS with theme variables, BEM-like naming ✓
- **Auth**: Role-based permissions system (admin/analyst/viewer) ✓

### What's Missing
- **Module-specific components** for Pricing, Planner, and Admin features
- **Form components** for create/edit workflows
- **Modal system** with proper composition & stacking
- **Data models** for tiers, parameters, estimates, team, WBS, RACI
- **Sub-page navigation** within modules (Pricing: 3 views, Planner: 4 views)
- **Complex state management** for nested data structures
- **Shared UI components library** (cards, buttons, inputs, tables, dropdowns)
- **Error/loading/empty states** handling across all modules

---

## Component Architecture Overview

### 1. Core Layout (Existing - Refactor)
```
App.jsx (root)
├── LoginShell.jsx (auth gate) ✓
└── MainLayout.jsx (post-auth) [NEW wrapper]
    ├── Sidebar.jsx (module nav + context-aware sub-nav) ✓
    ├── Topbar.jsx (title + view toggles + theme) ✓
    └── ContentArea.jsx (module outlet) [NEW]
```

### 2. Shared UI Components Library (NEW - 25+ components)
Create `src/components/ui/` for reusable atomic components:

**Forms & Inputs** (10 components):
- FormField, TextInput, SelectInput, NumberInput, TextAreaInput, ChipInput, DatePicker, ColorPicker, Checkbox, Radio, Toggle

**Display** (10 components):
- Card, StatTile, Badge, Tag, Avatar, ProgressBar, StatusIndicator, Tooltip, Pills, Timeline

**Layout & Containers** (8 components):
- Modal, ModalForm, Dialog, Drawer, Tabs, Section, Grid, EmptyState

**Data Display** (4 components):
- Table, DataGrid, List, TreeView

**Controls** (5 components):
- Button, IconButton, ButtonGroup, ContextMenu, Select

### 3. Pricing Module (NEW - 15+ components)
Create `src/modules/pricing/` with:
- **Views** (4): CatalogueListView, ParametersView, EstimateView, JSONExportView
- **Modals** (3): CreateCatalogueModal, EditCatalogueModal, TierEditorModal
- **Components** (8): CatalogueCard, ParameterEditor, TierSelector, PricingChart, EstimateCalculator, JSONPreview, TierList, CatalogueHeader

### 4. Delivery Planner Module (NEW - 18+ components)
Create `src/modules/planner/` with:
- **Views** (4): WBSView, TeamView, GanttView, RACIView
- **Modals** (4): CreateWBSItemModal, EditWBSItemModal, AddTeamMemberModal, ImportTeamModal
- **Components** (10): WBSTree, WBSNode, TeamMemberCard, TeamRoleSelector, GanttTimeline, GanttBar, GanttLegend, RACIMatrix, RACICell, PhaseTimeline

### 5. Admin Module (NEW - 15+ components)
Create `src/modules/admin/` with:
- **Sections** (6): UserManagementSection, RoleManagementSection, PricingTypesSection, SettingsSection, AuditLogSection, SystemStatusSection
- **Modals** (5): CreateUserModal, EditUserModal, AssignRoleModal, CreatePricingTypeModal, SystemSettingsModal
- **Components** (10): UserTable, UserRow, PermissionMatrix, AuditLogTable, AuditLogEntry, SystemStatusCard, DatabaseStats, BackupStatus

### 6. Modal System & Contexts (NEW)
- **ModalProvider.jsx** - context-based modal stack manager
- **useModal.js** - hook to open/close modals
- **ConfirmDialog.jsx**, **FormModal.jsx**, **MultiStepModal.jsx**
- **NotificationContext** - toast notifications
- **ThemeContext** - centralize theme (or use authStore)

---

## Detailed Project Structure

```
src/
├── components/ui/                          # 25+ Reusable UI components
│   ├── Button.jsx
│   ├── Modal.jsx
│   ├── FormField.jsx
│   ├── Card.jsx
│   ├── Table.jsx
│   ├── Select.jsx
│   ├── TextInput.jsx
│   ├── Badge.jsx
│   ├── Avatar.jsx
│   ├── EmptyState.jsx
│   ├── Tabs.jsx
│   ├── Tooltip.jsx
│   ├── StatusIndicator.jsx
│   └── ... (12+ more)
│
├── components/layout/
│   ├── MainLayout.jsx          # Post-auth layout wrapper
│   ├── Sidebar.jsx             # Refactored from existing
│   ├── Topbar.jsx              # Refactored from existing
│   └── ContentArea.jsx          # NEW outlet for modules
│
├── components/
│   └── LoginShell.jsx           # Keep existing
│
├── modules/pricing/            # Pricing Catalogue Module (15+ components)
│   ├── PricingModule.jsx        # Entry point
│   ├── views/
│   │   ├── CatalogueListView.jsx
│   │   ├── ParametersView.jsx
│   │   ├── EstimateView.jsx
│   │   └── JSONExportView.jsx
│   ├── modals/
│   │   ├── CreateCatalogueModal.jsx
│   │   ├── EditCatalogueModal.jsx
│   │   └── TierEditorModal.jsx
│   ├── components/
│   │   ├── CatalogueCard.jsx
│   │   ├── ParameterEditor.jsx
│   │   ├── TierSelector.jsx
│   │   ├── PricingChart.jsx
│   │   ├── EstimateCalculator.jsx
│   │   ├── JSONPreview.jsx
│   │   └── TierList.jsx
│   ├── Pricing.css
│   └── types.js
│
├── modules/planner/            # Delivery Planner Module (18+ components)
│   ├── PlannerModule.jsx        # Entry point
│   ├── views/
│   │   ├── WBSView.jsx
│   │   ├── TeamView.jsx
│   │   ├── GanttView.jsx
│   │   └── RACIView.jsx
│   ├── modals/
│   │   ├── CreateWBSItemModal.jsx
│   │   ├── EditWBSItemModal.jsx
│   │   └── AddTeamMemberModal.jsx
│   ├── components/
│   │   ├── WBSTree.jsx
│   │   ├── WBSNode.jsx
│   │   ├── TeamMemberCard.jsx
│   │   ├── TeamRoleSelector.jsx
│   │   ├── GanttTimeline.jsx
│   │   ├── GanttBar.jsx
│   │   ├── RACIMatrix.jsx
│   │   ├── RACICell.jsx
│   │   ├── PhaseTimeline.jsx
│   │   └── AllocationChart.jsx
│   ├── Planner.css
│   └── types.js
│
├── modules/admin/              # Admin Panel Module (15+ components)
│   ├── AdminModule.jsx          # Entry point
│   ├── sections/
│   │   ├── UserManagementSection.jsx
│   │   ├── RoleManagementSection.jsx
│   │   ├── PricingTypesSection.jsx
│   │   ├── SettingsSection.jsx
│   │   ├── AuditLogSection.jsx
│   │   └── SystemStatusSection.jsx
│   ├── modals/
│   │   ├── CreateUserModal.jsx
│   │   ├── EditUserModal.jsx
│   │   ├── AssignRoleModal.jsx
│   │   └── CreatePricingTypeModal.jsx
│   ├── components/
│   │   ├── UserTable.jsx
│   │   ├── UserRow.jsx
│   │   ├── PermissionMatrix.jsx
│   │   ├── AuditLogTable.jsx
│   │   ├── AuditLogEntry.jsx
│   │   ├── SystemStatusCard.jsx
│   │   └── DatabaseStats.jsx
│   ├── Admin.css
│   └── types.js
│
├── context/                    # React Context providers
│   ├── ModalContext.jsx
│   ├── NotificationContext.jsx
│   └── ThemeContext.jsx
│
├── hooks/                      # Custom React hooks (10+ hooks)
│   ├── useModal.js
│   ├── useFormState.js
│   ├── useDebounce.js
│   ├── useLocalStorage.js
│   ├── usePagination.js
│   ├── useFilters.js
│   ├── useAsync.js
│   ├── usePermission.js
│   ├── useModule.js
│   └── useNotification.js
│
├── stores/                     # Zustand state management (5 stores)
│   ├── authStore.js            # Extend: roles, permissions, users
│   ├── pricingStore.js         # Extend: tiers, parameters, estimates
│   ├── plannerStore.js         # NEW: projects, WBS, team, RACI
│   ├── adminStore.js           # NEW: audit logs, system status, pricing types
│   └── uiStore.js              # NEW: modals, notifications, sidebar state
│
├── utils/                      # Utility functions & helpers (15+ files)
│   ├── catalogueUtils.js       # Calculate, export, validate catalogues
│   ├── ganttUtils.js           # Date calculations, timeline generation
│   ├── raciUtils.js            # Matrix validation
│   ├── wbsUtils.js             # Tree operations (flatten, find, validate)
│   ├── auditUtils.js           # Format log entries, filter
│   ├── formatters.js           # Date, currency, number formatting
│   ├── validators.js           # Email, required, phone validation
│   ├── classNames.js           # Conditional class concatenation
│   ├── colors.js               # Tier colors, theme constants
│   ├── errorHandler.js         # Error handling & logging
│   └── ... (5+ more)
│
├── api/                        # API & Backend integration
│   ├── supabaseClient.js       # Existing, keep as is
│   ├── catalogueApi.js         # Catalogue endpoints
│   ├── userApi.js              # User management endpoints
│   ├── plannerApi.js           # Planner endpoints
│   └── auditApi.js             # Audit log endpoints
│
├── types/                      # Type definitions (JSDoc)
│   ├── catalogue.js
│   ├── planner.js
│   ├── user.js
│   └── audit.js
│
├── styles/                     # Global & shared CSS
│   ├── variables.css           # CSS custom properties
│   ├── typography.css
│   ├── forms.css
│   ├── tables.css
│   ├── utilities.css
│   └── animations.css
│
├── App.jsx
├── App.css                     # Refactor for modular approach
└── index.jsx
```

---

## State Management: Data Structures

### Pricing Store Extensions
```javascript
{
  catalogues: [{
    id, name, type, tier, description, created_at, updated_at,
    parameters: {
      baseCost: 25000,
      implementationDays: 90,
      teamSize: 5,
      riskLevel: 'medium'
    },
    tiers: [{
      id, name, costMultiplier: 1.5, color: '#1a9e6e', description
    }],
    estimates: [{
      id, scenarioName, adjustments: {...}, totalCost, notes
    }]
  }],
  currentView: 'list' | 'parameters' | 'estimate' | 'json',
  selectedCatalogue: {...},
  editingTier: null,
  filters: { type: '', tier: null, search: '' }
}
```

### Planner Store (NEW)
```javascript
{
  projects: [{
    id, name, startDate, endDate, status: 'planning' | 'active' | 'completed',
    wbs: [{
      id, parentId, name, description, startDate, endDate,
      status: 'not-started' | 'in-progress' | 'completed',
      owner: userId, estimatedDays, actualDays
    }],
    team: [{
      id, userId, name, role: 'PM' | 'Dev' | 'QA' | 'BA' | 'Arch',
      startDate, endDate, allocationPercent: 100
    }],
    raci: [{
      taskId, roleId, responsibility: 'R' | 'A' | 'C' | 'I'
    }],
    milestones: [{
      id, name, date, status
    }]
  }],
  activeProject: {...},
  expandedWBSNodes: Set,
  selectedWBSItem: null,
  ganttZoom: 'week' | 'month' | 'quarter'
}
```

### Admin Store (NEW)
```javascript
{
  auditLogs: [{
    id, userId, action, resource, resourceId, timestamp,
    changes: { before: {...}, after: {...} }
  }],
  systemStatus: {
    api: 'operational' | 'degraded' | 'down',
    database: 'connected' | 'disconnected',
    supabase: 'configured' | 'unconfigured',
    lastBackup: ISO8601 timestamp
  },
  pricingTypes: [{ id, name, description, icon, category }],
  selectedUser: null,
  editingRole: null
}
```

### UI Store (NEW)
```javascript
{
  modals: {
    [modalName]: { isOpen: boolean, data?: any }
  },
  notifications: [{
    id, type: 'success' | 'error' | 'warning' | 'info',
    message, duration
  }],
  sidebarCollapsed: false,
  activeModule: 'pricing' | 'planner' | 'admin'
}
```

---

## Component Count Summary

| Category | Count | Notes |
|----------|-------|-------|
| UI Components | 25+ | Buttons, Modals, Forms, Tables, etc. |
| Layout | 3 | MainLayout, Sidebar, Topbar |
| Pricing Module | 15+ | Views, modals, components |
| Planner Module | 18+ | Views, modals, complex components |
| Admin Module | 15+ | Sections, modals, tables |
| Custom Hooks | 10+ | useFormState, useAsync, useModal, etc. |
| Stores/Context | 8 | Zustand + React Context |
| Utilities | 15+ | Validators, formatters, API helpers |
| **TOTAL** | **100+** | Major modularization effort |

---

## Implementation Phases

### Phase 1: Foundation (Week 1)
1. Create 15-20 core UI components (Button, Modal, Card, FormField, Table)
2. Implement ModalContext + useModal hook
3. Create 5-7 custom hooks (useFormState, useAsync, useLocalStorage)
4. Refactor existing components to use new UI lib
5. Extend authStore with role/permission data

### Phase 2: Pricing Module (Week 1-2)
1. Extend pricingStore with tiers, parameters, estimates data
2. Create PricingModule.jsx entry point
3. Build CatalogueListView
4. Build ParametersView with form validation
5. Build EstimateView with calculator logic
6. Build JSONExportView with export functionality
7. Create all modals & helper components

### Phase 3: Planner Module (Week 2-3)
1. Create plannerStore
2. Create PlannerModule.jsx entry point
3. Build WBSView with hierarchical tree component
4. Build TeamView with role assignment UI
5. Build GanttView with timeline (use Recharts or custom SVG)
6. Build RACIView with matrix editor
7. Create all modals & helper components

### Phase 4: Admin Module (Week 3)
1. Create adminStore
2. Create AdminModule.jsx entry point
3. Build all 6 sections with tables & forms
4. Create all modals
5. Implement audit log filtering/search
6. Implement system status dashboard

### Phase 5: Polish & Integration
1. Add loading skeletons across all views
2. Implement error boundaries
3. Add offline support (localStorage fallback)
4. Add animations/transitions
5. Performance optimization (code splitting, lazy load)
6. Comprehensive testing
7. Accessibility review (a11y)

---

## Key Technical Decisions

### 1. Form Handling
**Chosen**: Simple `useState` + `useFormState` hook
- Lightweight, no external dependencies
- Good enough for this app's form complexity
- Can migrate to React Hook Form if needed later

### 2. Chart/Timeline Libraries
**Chosen**: Recharts for consistency
- Lightweight, React-native, good for data viz
- Sufficient for Gantt bar chart and pricing charts
- Avoid: D3.js (overkill), Plotly (heavy), Victory (lesser known)

### 3. Date Handling
**Chosen**: `date-fns` (lightweight, tree-shakeable)
- Better than Moment.js for bundle size
- Supports timezone handling needed for Gantt

### 4. Modal System
**Chosen**: Context-based modal stack (not portal/conditional)
- Supports stacking multiple modals
- Cleaner than prop drilling 5 levels deep
- Can be extended for animations

### 5. Styling
**Chosen**: Keep existing CSS approach + convert to CSS Modules incrementally
- Avoid adding Tailwind/styled-components (reduce deps)
- Theme switching already works well
- CSS Modules for component scoping where needed

### 6. Type Safety
**Chosen**: JSDoc in types/ folder (not TypeScript)
- Faster initial implementation
- Can run `tsc --checkJs` for validation
- Easier migration path to TypeScript later

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Scope creep on UI library | Schedule slip | Define MVP set first, defer nice-to-haves |
| State management complexity | Bugs | Single source of truth, avoid derived state |
| Supabase delays | Blocking development | Strong localStorage fallback, mock responses |
| Gantt/RACI complexity | Quality issues | Use libraries, build MVP first |
| Missing features from HTML | Incomplete conversion | Document all features upfront |

---

## Success Criteria

1. Feature parity with original HTML implementation
2. All modules fully functional (Pricing, Planner, Admin)
3. No console errors or warnings in production
4. <3 second initial load time
5. All CRUD operations persist (localStorage + Supabase)
6. Role-based access control enforced
7. Theme switching seamless across all modules
8. Components <300 lines, stores focused
9. Code organized & maintainable
10. All tests passing

---

## Dependencies to Add

Current:
- react, react-dom, react-router-dom, zustand, @supabase/supabase-js

Recommended additions:
- `date-fns` (date utilities)
- `recharts` (charting library)
- `clsx` or `classnames` (conditional CSS)

Avoid adding:
- Tailwind CSS (not needed, CSS already works)
- TypeScript (too early, JSDoc sufficient)
- Redux (Zustand is lighter)
- Material-UI (too heavy, we have custom theme)

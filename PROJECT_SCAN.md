# Transformation Studio - React App Scan

⚠️ **INTERNAL DOCUMENTATION** - For team members only  
🔒 **This document should remain private** - Contains architecture & implementation details

**Scan Date**: 2026-09-04  
**Repository**: https://github.com/subramaniand/Transformation-studio (PRIVATE)  
**Current Branch**: `dev` (newly created)

---

## Project Overview

**Name**: UST Transformation Studio  
**Version**: 1.0.0  
**Type**: React + Vite SPA  
**Purpose**: Pricing & Delivery Planning Tool

---

## Tech Stack

### Frontend
- **React**: 18.3.1
- **React Router**: 6.20.0
- **State Management**: Zustand 4.4.1
- **Build Tool**: Vite 5.0.8

### Backend
- **Database/Auth**: Supabase 2.38.4

### Development
- **Package Manager**: npm
- **Vite Plugin**: React plugin for JSX

---

## Application Architecture

### Directory Structure
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (Button, Card, Modal, etc.)
│   ├── LoginShell.jsx
│   ├── Sidebar.jsx
│   ├── Content.jsx
│   └── Topbar.jsx
├── modules/            # Feature modules
│   ├── pricing/        # Pricing catalogue & estimates
│   │   ├── PricingModule.jsx
│   │   ├── views/
│   │   │   ├── CatalogueListView.jsx
│   │   │   ├── ParametersView.jsx
│   │   │   ├── EstimateView.jsx
│   │   │   ├── JSONExportView.jsx
│   │   └── modals/
│   │       └── CreateCatalogueModal.jsx
│   ├── planner/        # Project planning & delivery
│   │   ├── PlannerModule.jsx
│   │   └── views/
│   │       ├── GanttView.jsx
│   │       ├── TeamView.jsx
│   │       ├── WBSView.jsx
│   │       └── RACIView.jsx
│   └── admin/          # Administration & settings
│       ├── AdminModule.jsx
│       └── sections/
│           ├── UserManagementSection.jsx
│           ├── RoleManagementSection.jsx
│           ├── SettingsSection.jsx
│           ├── AuditLogSection.jsx
│           ├── SystemStatusSection.jsx
│           └── PricingTypesSection.jsx
├── hooks/              # Custom React hooks
│   ├── useFormState.js
│   ├── useAsync.js
│   ├── usePagination.js
│   └── useDebounce.js
├── context/            # React context
│   └── ModalContext.jsx
├── utils/              # Utility functions
│   ├── classNames.js
│   ├── formatters.js
│   └── validators.js
├── stores/             # Zustand state stores
│   ├── authStore.js
│   ├── adminStore.js
│   ├── plannerStore.js
│   └── pricingStore.js
├── App.jsx             # Main app component
├── App.css             # Global styles
├── index.jsx           # Entry point
└── supabaseClient.js   # Supabase configuration

public/
├── index.html
└── favicon.svg

docs/                   # Generated build output (docs deployment)
├── index.html
├── assets/
└── ...

supabase_init.sql       # Initial schema
supabase_roles_migration.sql  # Role migration schema
```

---

## Features by Module

### 📊 Pricing Module
**Location**: `src/modules/pricing/`  
**Purpose**: Manage pricing catalogues and generate estimates

**Features**:
- View pricing catalogues
- Create/edit pricing parameters
- Generate cost estimates
- Export to JSON
- Bulk pricing operations

**Key Files**:
- `pricingStore.js` - Zustand state management
- `CatalogueListView.jsx` - Main catalogue interface
- `ParametersView.jsx` - Pricing parameter configuration
- `EstimateView.jsx` - Generate and view estimates
- `JSONExportView.jsx` - Export functionality

**Dependencies**:
- Supabase for data persistence
- Modal component for create/edit dialogs

---

### 📅 Planner Module
**Location**: `src/modules/planner/`  
**Purpose**: Project delivery planning and team management

**Features**:
- Gantt chart visualization
- Team member allocation
- WBS (Work Breakdown Structure)
- RACI matrix
- Timeline management

**Key Files**:
- `plannerStore.js` - Zustand state management
- `GanttView.jsx` - Gantt chart view
- `TeamView.jsx` - Team allocation interface
- `WBSView.jsx` - Work breakdown structure
- `RACIView.jsx` - Responsibility matrix

**Dependencies**:
- Zustand for state
- React Router for navigation
- Supabase for persistence

---

### ⚙️ Admin Module
**Location**: `src/modules/admin/`  
**Purpose**: System administration, settings, and user management

**Features**:
- User management & permissions
- Role management (custom roles)
- System settings configuration
- Audit log viewing
- System status monitoring
- Pricing types management

**Key Files**:
- `adminStore.js` - Zustand state management
- `UserManagementSection.jsx` - User CRUD operations
- `RoleManagementSection.jsx` - Role creation and assignment
- `SettingsSection.jsx` - System-wide settings
- `AuditLogSection.jsx` - Activity logging
- `SystemStatusSection.jsx` - Health monitoring
- `PricingTypesSection.jsx` - Pricing type configuration

**Dependencies**:
- Supabase for data and auth
- Role-based access control (RBAC)
- Modal components for dialogs

---

## UI Components Library
**Location**: `src/components/ui/`

**Available Components**:
- `Button.jsx` - CTA buttons with variants
- `Card.jsx` - Content containers
- `Modal.jsx` - Dialog boxes
- `Input.jsx` - Text input fields
- `Select.jsx` - Dropdown selections
- `Table.jsx` - Data tables
- `Tabs.jsx` - Tabbed interfaces
- `Badge.jsx` - Status indicators
- `Avatar.jsx` - User avatars
- `EmptyState.jsx` - Empty state displays
- `LoadingSpinner.jsx` - Loading indicator
- `StatusIndicator.jsx` - Status visualization
- `FormField.jsx` - Form field wrapper

**Architecture**: Reusable, composable components with consistent styling

---

## State Management

### Zustand Stores
**Pattern**: Centralized state for each module

**Stores**:
1. **authStore.js** - Authentication & user session
2. **adminStore.js** - Admin panel state (users, roles, settings)
3. **plannerStore.js** - Planning data (teams, tasks, timeline)
4. **pricingStore.js** - Pricing data (catalogues, estimates)

**Benefits**:
- Minimal boilerplate
- Easy debugging with DevTools
- Type-safe with proper exports

---

## Routing Structure
**Framework**: React Router v6

**Main Routes**:
```
/
├── /pricing          → PricingModule
├── /planner          → PlannerModule
└── /admin            → AdminModule
```

**Auth Flow**:
- LoginShell wraps unauthenticated state
- Content component handles authenticated routes

---

## Database Schema
**Files**:
- `supabase_init.sql` - Initial schema
- `supabase_roles_migration.sql` - Role-based access schema

**Key Tables**:
- `users` - User accounts
- `roles` - Custom role definitions
- `pricing_catalogues` - Pricing data
- `projects` - Project/planning data
- `audit_logs` - System activity logging

---

## Build & Deployment

### Available Scripts
```bash
npm run dev       # Start dev server (Vite)
npm run build     # Production build
npm run preview   # Preview production build
npm run deploy    # Build & deploy to GitHub Pages
```

### Deployment
- **Service**: GitHub Pages
- **Trigger**: `npm run deploy` or `npm run build` + `gh-pages`
- **Docs Output**: `docs/` directory

---

## Current Git Status

### Branches
- `main` - Production (synced with remote)
- `dev` - **NEW** Integration branch (ready for feature consolidation)

### Recent Commits (Last 10)
1. `53b9b26` - Fix pricing catalogue interactions
2. `54af7c6` - Align pricing UI with reference
3. `21022b9` - Align branding and Supabase schema
4. `d77413d` - Align database schema with UI
5. `06467b4` - Improve Supabase settings
6. `e13db82` - Remove credential footer
7. `acd1a42` - Persist custom roles and users
8. `2ef3362` - Fix demo login fallback
9. `7677ac3` - Fix empty page after login
10. `2b9ce6e` - Fix three critical features

---

## Code Quality & Standards

### Conventions
- **JSX Components**: PascalCase naming
- **Functions/Utils**: camelCase naming
- **Constants**: UPPER_SNAKE_CASE
- **CSS**: BEM naming convention in App.css
- **Commits**: Conventional commits (feat, fix, refactor, etc.)

### Component Structure
- Functional components with hooks
- Props validation through prop-types or TypeScript
- Proper component composition
- Context API for cross-cutting concerns

---

## Security Considerations

### Authentication
- Supabase Auth integration
- Protected routes via auth context
- Session token management

### Data Access
- Role-based access control (RBAC)
- User permission validation
- Audit logging for compliance

### Environment Variables
- Supabase API keys (in `supabaseClient.js`)
- Deployment configuration (GitHub Pages)

---

## Performance Characteristics

### Code Splitting
- Module-based (Pricing, Planner, Admin)
- Lazy loading recommended for large views

### State Updates
- Zustand for efficient state management
- Minimal re-renders with proper selectors
- Context for UI-only state (modals)

### Network
- Supabase real-time subscriptions available
- Pagination hooks ready (`usePagination`)
- Debouncing available (`useDebounce`)

---

## Next Steps & Recommendations

### Immediate
1. ✅ **Set up dev branch** - COMPLETED
2. Create feature branches from `dev` for new work
3. Implement branch protection rules on GitHub

### Short Term
1. Add GitHub Actions CI/CD pipeline
2. Implement pre-commit hooks (linting, formatting)
3. Set up automated testing
4. Add TypeScript for type safety

### Medium Term
1. Expand test coverage
2. Implement error boundary components
3. Add analytics integration
4. Performance optimization (lazy loading, code splitting)

### Long Term
1. Accessibility audit (a11y)
2. Internationalization (i18n)
3. Mobile responsiveness improvements
4. Progressive Web App (PWA) support

---

## Useful Commands

### Development
```bash
npm run dev                    # Start dev server on localhost:5173
npm run build                  # Create production build
npm run preview                # Preview production build locally
```

### Git Workflow
```bash
# Create feature branch
git checkout dev
git pull origin dev
git checkout -b feature/description

# Push and create PR
git push -u origin feature/description

# After merge, update local dev
git checkout dev
git pull origin dev
```

### Cleanup
```bash
git branch -d merged-branch    # Delete local branch
git push origin -d branch-name # Delete remote branch
```

---

## Questions?

Refer to:
- `BRANCHING_STRATEGY.md` - For branching guidance
- `README.md` - For project setup
- Supabase docs - For database schema
- React Router docs - For routing questions
- Zustand docs - For state management

**Last Updated**: 2026-09-04

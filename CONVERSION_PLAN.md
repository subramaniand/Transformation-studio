# React Conversion Plan for Transformation Studio

## Project Structure
```
transformation-studio/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── LoginShell.jsx
│   │   ├── Sidebar.jsx
│   │   ├── Topbar.jsx
│   │   ├── Content.jsx
│   │   ├── Modal.jsx
│   │   └── ThemeSwitcher.jsx
│   ├── views/
│   │   ├── PricingCatalogue.jsx
│   │   ├── DeliveryPlanner.jsx
│   │   ├── AdminPanel.jsx
│   │   └── CatalogueForm.jsx
│   ├── hooks/
│   │   ├── useSupabase.js
│   │   ├── useAuth.js
│   │   └── useLocalStorage.js
│   ├── utils/
│   │   ├── supabaseClient.js
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   └── validators.js
│   ├── styles/
│   │   ├── theme.css
│   │   └── globals.css
│   ├── App.jsx
│   └── index.jsx
├── .env.local (not committed)
├── .env.example
├── package.json
└── vite.config.js
```

## Key Steps

### 1. Setup & Dependencies
- Create React app with Vite
- Install dependencies: supabase, react-router, zustand (state management)
- Configure GitHub Pages deployment

### 2. Supabase Configuration
- Create tables: users, catalogues, roles, settings, audit_logs
- Set up Row Level Security (RLS) policies
- Configure auth with JWT

### 3. Component Conversion
- Convert inline styles to CSS modules/Tailwind
- Create reusable components from HTML structure
- Extract state management logic

### 4. Features to Implement
- ✅ Authentication (login/logout)
- ✅ User management (admin only)
- ✅ Catalogue CRUD operations
- ✅ Pricing tier management
- ✅ Delivery planner views (WBS, Team, Timeline, RACI)
- ✅ Admin panel
- ✅ Theme switcher (default, light, dark)
- ✅ Export to JSON
- ✅ Real-time sync with Supabase

### 5. Deployment
- GitHub Pages setup (gh-pages branch)
- Environment variables configuration
- Build & deployment automation

## Prerequisites
1. GitHub account with public repository
2. Supabase project (free tier works)
3. Node.js 16+

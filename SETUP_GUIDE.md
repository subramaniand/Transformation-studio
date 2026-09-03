# Transformation Studio - React Setup Guide

Complete guide to set up the React app with Supabase integration and deploy to GitHub Pages.

## Prerequisites

- **Node.js** 16+ ([download](https://nodejs.org))
- **GitHub** account (free)
- **Supabase** account (free tier available at [supabase.com](https://supabase.com))

---

## Step 1: Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Name it: `transformation-studio`
3. Set to **Public** (required for GitHub Pages)
4. Click "Create repository"
5. Clone it locally:

```bash
git clone https://github.com/YOUR_USERNAME/transformation-studio.git
cd transformation-studio
```

---

## Step 2: Setup Supabase Project

### 2.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in:
   - **Database Password**: Save this securely
   - **Region**: Pick one closest to your users
4. Click "Create new project" (wait 2-3 minutes to initialize)

### 2.2 Get API Credentials
1. Navigate to **Settings → API**
2. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`

### 2.3 Create Database Tables

Go to **SQL Editor** and run this script:

```sql
-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'viewer',
  "function" TEXT,
  active BOOLEAN DEFAULT true,
  created TIMESTAMP DEFAULT now()
);

-- Create roles table
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL
);

-- Create catalogues table
CREATE TABLE catalogues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  tier INT DEFAULT 0,
  description TEXT,
  params JSONB DEFAULT '{}'::JSONB,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Create audit_logs table
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  detail TEXT,
  timestamp TIMESTAMP DEFAULT now()
);

-- Create settings table
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint TEXT,
  api_key TEXT
);

-- Insert demo users
INSERT INTO users (username, password, name, email, role, "function", active) VALUES
  ('admin', 'admin123', 'Admin User', 'admin@co.com', 'admin', 'Operations', true),
  ('analyst', 'analyst123', 'Jane Analyst', 'jane@co.com', 'analyst', 'Finance', true),
  ('viewer', 'view123', 'Bob Viewer', 'bob@co.com', 'viewer', 'Technology/IT', true);

-- Insert demo roles
INSERT INTO roles (name) VALUES ('admin'), ('analyst'), ('viewer');

-- Insert demo catalogues
INSERT INTO catalogues (name, type, tier, created_by) 
SELECT 'DC Exit Programme', 'DC Exit', 1, id FROM users WHERE username = 'admin' LIMIT 1;
```

### 2.4 Enable Row Level Security (Optional but Recommended)

For production, enable RLS on all tables:
1. Go to **Authentication → Policies**
2. For each table, add a policy allowing public read

---

## Step 3: Setup React Project

### 3.1 Copy Files to Repository
Copy all the React files from the scratch workspace to your cloned repository:

```
transformation-studio/
├── src/
│   ├── components/
│   │   ├── LoginShell.jsx       (→ components_LoginShell.jsx)
│   │   ├── Sidebar.jsx          (→ components_Sidebar.jsx)
│   │   ├── Topbar.jsx           (→ components_Topbar.jsx)
│   │   └── Content.jsx          (→ components_Content.jsx)
│   ├── App.jsx
│   ├── App.css
│   ├── index.jsx
│   ├── authStore.js
│   ├── pricingStore.js
│   └── supabaseClient.js
├── public/
│   └── index.html               (→ index.html)
├── package.json
├── vite.config.js
├── .env.example
├── .gitignore
└── README.md
```

### 3.2 Install Dependencies
```bash
npm install
```

### 3.3 Configure Environment
1. Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

2. Edit `.env.local` and paste your Supabase credentials:
```
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### 3.4 Test Locally
```bash
npm run dev
```

Open http://localhost:5173 and test with demo credentials:
- Username: `admin`, Password: `admin123`

---

## Step 4: Deploy to GitHub Pages

### 4.1 Push Code to GitHub
```bash
git add .
git commit -m "Initial commit: React + Supabase setup"
git push origin main
```

### 4.2 Enable GitHub Pages
1. Go to repository **Settings → Pages**
2. Under "Build and deployment":
   - Source: **GitHub Actions**
   - Leave as default

### 4.3 Create GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - name: Install dependencies
        run: npm install
      
      - name: Build
        run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
      
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### 4.4 Add Secrets to GitHub
1. Go to **Settings → Secrets and variables → Actions**
2. Click "New repository secret"
3. Add:
   - Name: `VITE_SUPABASE_URL`, Value: `https://YOUR_PROJECT.supabase.co`
   - Name: `VITE_SUPABASE_ANON_KEY`, Value: `your_anon_key`

### 4.5 Push Workflow
```bash
git add .github/workflows/deploy.yml
git commit -m "Add GitHub Pages deployment workflow"
git push origin main
```

Your app will automatically build and deploy to:
```
https://YOUR_USERNAME.github.io/transformation-studio/
```

---

## Step 5: Verify Deployment

1. Wait 1-2 minutes for the GitHub Actions workflow to complete
2. Go to **Actions** tab to see build status
3. Once green ✓, visit: `https://YOUR_USERNAME.github.io/transformation-studio/`
4. Test login with demo credentials

---

## Common Issues

### "Cannot find module" errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### Supabase connection fails
- ✓ Check `.env.local` exists with correct credentials
- ✓ Verify Supabase project is active (Settings → General)
- ✓ Check internet connection

### GitHub Pages shows blank page
- ✓ Verify workflow completed successfully (Actions tab)
- ✓ Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
- ✓ Check `vite.config.js` has correct `base` value

### Login fails with demo credentials
- ✓ Ensure you created users via SQL script in Step 2.3
- ✓ Check browser console for errors (F12)

---

## Next Steps

### 1. Customize Branding
- Edit `llogo-name` text in `components_LoginShell.jsx`
- Update SVG logo in components
- Modify color variables in `App.css`

### 2. Implement Full Features
- [ ] Catalogue CRUD operations
- [ ] Pricing parameter management
- [ ] Delivery planner views (WBS, Team, Gantt, RACI)
- [ ] Admin user management
- [ ] Real-time Supabase sync

### 3. Production Improvements
- [ ] Enable Row Level Security (RLS) on Supabase
- [ ] Implement proper authentication (instead of plain password)
- [ ] Add error handling and logging
- [ ] Set up environment-specific configs
- [ ] Add unit and integration tests

### 4. Custom Domain (Optional)
- [ ] Register domain
- [ ] In **Settings → Pages**, add custom domain
- [ ] Update DNS records per GitHub instructions

---

## Project Structure Reference

```
transformation-studio/
├── src/
│   ├── components/
│   │   ├── LoginShell.jsx      # Login form
│   │   ├── Sidebar.jsx         # Navigation + catalogues
│   │   ├── Topbar.jsx          # Header + theme switcher
│   │   └── Content.jsx         # Main content area
│   ├── App.jsx                 # Main app component
│   ├── App.css                 # All styling
│   ├── index.jsx               # React entry point
│   ├── authStore.js            # Auth state (Zustand)
│   ├── pricingStore.js         # Pricing state (Zustand)
│   └── supabaseClient.js       # Supabase client setup
├── public/
│   └── index.html              # HTML template
├── .github/workflows/
│   └── deploy.yml              # GitHub Pages workflow
├── package.json                # Dependencies
├── vite.config.js              # Vite config
└── .env.local                  # Environment vars (not committed)
```

---

## Support

- **React Docs**: https://react.dev
- **Supabase Docs**: https://supabase.com/docs
- **Vite Docs**: https://vitejs.dev
- **GitHub Pages**: https://docs.github.com/en/pages

---

**Ready to go!** 🚀

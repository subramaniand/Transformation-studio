# Transformation Studio - Quick Start (5 Minutes)

Fast-track setup for experienced developers.

---

## 1️⃣ GitHub Repo (1 min)

```bash
# Create new repo on GitHub: transformation-studio (public)
git clone https://github.com/YOUR_USERNAME/transformation-studio.git
cd transformation-studio
```

---

## 2️⃣ Supabase Setup (2 min)

**URL**: https://supabase.com

1. Create project (free tier)
2. Go to **Settings → API**
3. Copy `Project URL` and `anon public` key

**In Supabase SQL Editor**, paste:
```bash
cat > /tmp/init.sql << 'EOF'
# Copy content from supabase_init.sql file
EOF
```

Or run `supabase_init.sql` provided in files.

---

## 3️⃣ React Setup (1 min)

```bash
# Copy all files to repo (organize in src/, public/, etc.)
npm install

# Create .env.local
echo "VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co" > .env.local
echo "VITE_SUPABASE_ANON_KEY=your_anon_key" >> .env.local

# Test
npm run dev
# Open http://localhost:5173
# Login: admin / admin123
```

---

## 4️⃣ Deploy to GitHub Pages (1 min)

```bash
# Push to GitHub
git add .
git commit -m "Initial commit"
git push origin main

# Add repository secrets:
# Settings → Secrets and variables → Actions
# VITE_SUPABASE_URL
# VITE_SUPABASE_ANON_KEY

# Create .github/workflows/deploy.yml (provided)
git add .github/workflows/deploy.yml
git commit -m "Add deployment workflow"
git push origin main

# Wait 2-3 minutes for build
# Visit: https://YOUR_USERNAME.github.io/transformation-studio/
```

---

## ⚡ Essential Commands

```bash
npm run dev           # Start dev server (localhost:5173)
npm run build         # Build for production
npm run preview       # Preview build
npm run deploy        # Build + deploy to GitHub Pages
```

---

## 🔑 Demo Users

| Username | Password |
|----------|----------|
| admin | admin123 |
| analyst | analyst123 |
| viewer | view123 |

---

## 📍 Key Files to Copy

```
From scratch workspace →  To repository:

App.jsx                 →  src/App.jsx
App.css                 →  src/App.css
index.jsx               →  src/index.jsx
index.html              →  public/index.html

components_LoginShell.jsx   →  src/components/LoginShell.jsx
components_Sidebar.jsx      →  src/components/Sidebar.jsx
components_Topbar.jsx       →  src/components/Topbar.jsx
components_Content.jsx      →  src/components/Content.jsx

authStore.js            →  src/authStore.js
pricingStore.js         →  src/pricingStore.js
supabaseClient.js       →  src/supabaseClient.js

package.json            →  package.json
vite.config.js          →  vite.config.js
.env.example            →  .env.example
.gitignore              →  .gitignore

deploy.yml              →  .github/workflows/deploy.yml
```

---

## ✅ Verify After Deploy

```bash
# 1. Check workflow status
GitHub → Actions → Latest workflow

# 2. Visit deployed URL
https://YOUR_USERNAME.github.io/transformation-studio/

# 3. Test login with demo credentials

# 4. Check browser console (F12) for errors
```

---

## 🐛 Quick Fixes

**Blank page after deploy?**
```bash
# Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
# Check: vite.config.js has correct base path
```

**Can't login?**
```bash
# Verify: .env.local exists with correct credentials
# Check: Supabase project is active
# Ensure: supabase_init.sql was run
```

**Workflow fails?**
```bash
# Check: GitHub secrets are set (Settings → Secrets)
# Verify: Credentials have hyphens, not underscores
# Rerun: Actions → Re-run workflow
```

---

## 🚀 Architecture Overview

```
LoginShell.jsx
    ↓
authStore.login()
    ↓
Supabase (or localStorage fallback)
    ↓
App.jsx → Sidebar + Topbar + Content
    ↓
usePricingStore.fetchCatalogues()
    ↓
Supabase catalogues table
```

---

## 📊 Tech Stack

- **Frontend**: React 18 + Vite
- **State**: Zustand
- **Backend**: Supabase (PostgreSQL)
- **Deployment**: GitHub Pages
- **CI/CD**: GitHub Actions

---

## 📚 Full Docs

- **Setup Details**: See `SETUP_GUIDE.md`
- **File Reference**: See `FILES_CREATED.md`
- **Architecture**: See `CONVERSION_PLAN.md`
- **Complete Docs**: See `README_FINAL.md`

---

## 🔐 For Production

```bash
# In supabase_init.sql, uncomment RLS policies
# Enable Row Level Security on all tables
# Use Supabase Auth instead of passwords
# Rotate API keys regularly
# Enable HTTPS (GitHub Pages does this)
```

---

## 💬 Support

**Issue → Check → Solution**

| Problem | Check | Solution |
|---------|-------|----------|
| Blank page | Browser console errors | Hard refresh, check env vars |
| Can't login | Supabase credentials | Recreate .env.local |
| Deploy fails | GitHub Actions logs | Check secrets, rerun workflow |
| Styles wrong | CSS imports | Clear cache, rebuild |

---

## 🎯 Next After Setup

1. ✅ Test login works
2. ✅ Test logout works
3. ✅ Test theme switcher
4. ✅ Verify sidebar navigation
5. 🔜 Implement catalogue CRUD
6. 🔜 Add parameter forms
7. 🔜 Build planner views
8. 🔜 Add export feature

---

**Ready?** Start with Step 1 above! 🚀

*Total time: ~5 minutes to deployment*

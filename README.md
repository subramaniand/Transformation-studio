# Transformation Studio - React + Supabase

**A modern, production-ready React app for transformation project pricing and delivery planning.**

Converted from the original HTML/vanilla JS version with full Supabase backend integration and GitHub Pages deployment.

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/YOUR_USERNAME/transformation-studio.git
cd transformation-studio
npm install
```

### 2. Configure Supabase
Create `.env.local`:
```
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for complete instructions.

### 3. Develop Locally
```bash
npm run dev
```

### 4. Deploy to GitHub Pages
```bash
npm run build
npm run deploy
```

---

## 📋 Features

### ✅ Implemented
- **Authentication**: Login/logout with role-based access control
- **Three User Roles**: Admin, Analyst, Viewer with different permissions
- **Theme Switcher**: Default, Light, and Dark themes
- **Sidebar Navigation**: Module switcher and catalogue list
- **State Management**: Zustand for auth and pricing data
- **Supabase Integration**: Real-time database sync
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Demo Data**: Pre-loaded demo users for testing
- **Offline Mode**: Falls back to localStorage if Supabase unavailable

### 🔜 To Implement
- [ ] Catalogue CRUD (Create, Read, Update, Delete)
- [ ] Pricing parameter management
- [ ] Delivery planner views:
  - WBS (Work Breakdown Structure)
  - Team & Roles
  - Timeline / Gantt chart
  - RACI Matrix
- [ ] Admin panel for user management
- [ ] Export to JSON
- [ ] Audit logging
- [ ] Real-time collaboration features

---

## 🛠️ Tech Stack

- **Frontend**: React 18.3 + Vite
- **State Management**: Zustand
- **Backend**: Supabase (PostgreSQL + Auth)
- **Deployment**: GitHub Pages
- **Styling**: CSS custom properties (dark mode ready)

---

## 📁 Project Structure

```
src/
├── components/
│   ├── LoginShell.jsx      Login form & auth UI
│   ├── Sidebar.jsx         Navigation & module switcher
│   ├── Topbar.jsx          Header & theme controls
│   └── Content.jsx         Main content area
├── App.jsx                 Main app component
├── App.css                 All styling (CSS variables)
├── index.jsx               React entry point
├── authStore.js            Auth state (Zustand)
├── pricingStore.js         Pricing data state (Zustand)
└── supabaseClient.js       Supabase client setup

public/
└── index.html              HTML template

.github/workflows/
└── deploy.yml              GitHub Pages CI/CD

.env.local (not committed)  Environment variables
.env.example                Environment template
```

---

## 🔐 Security Notes

### ⚠️ Current (Development)
- Passwords stored as plain text (demo only)
- No Row Level Security (RLS) enabled
- Public read access to all tables

### ✅ Production Checklist
- [ ] Enable Supabase RLS policies
- [ ] Use proper authentication (JWT, Supabase Auth)
- [ ] Hash passwords or use OAuth
- [ ] Add API key rotation
- [ ] Enable HTTPS (GitHub Pages provides this)
- [ ] Audit sensitive data access
- [ ] Set up encryption at rest

---

## 📚 Supabase Schema

### Users Table
```sql
id          UUID PRIMARY KEY
username    TEXT UNIQUE
password    TEXT
name        TEXT
email       TEXT
role        TEXT (admin|analyst|viewer)
function    TEXT
active      BOOLEAN
created     TIMESTAMP
```

### Catalogues Table
```sql
id          UUID PRIMARY KEY
name        TEXT
type        TEXT
tier        INT (0-4)
description TEXT
params      JSONB
created_by  UUID → users.id
created_at  TIMESTAMP
updated_at  TIMESTAMP
```

### Additional Tables
- `roles` - Role definitions
- `audit_logs` - Activity tracking
- `settings` - Application settings

---

## 🎨 Theme System

Three built-in themes using CSS custom properties:

1. **Default** (Dark blue)
   - Primary accent: #004B87
   - Background: #0f1419

2. **UST Light**
   - Primary accent: #003D82
   - Background: #ffffff

3. **UST Dark**
   - Primary accent: #00D4FF
   - Background: #0f1419

Switch via top-right theme buttons or programmatically:
```javascript
useAuthStore(state => state.setTheme)('ust-light')
```

---

## 🧑‍💻 Demo Users

| Username | Password | Role | Function |
|----------|----------|------|----------|
| admin | admin123 | admin | Operations |
| analyst | analyst123 | analyst | Finance |
| viewer | view123 | viewer | Technology/IT |

---

## 🚀 Deployment

### GitHub Pages
Automatically deployed on every `main` branch push via GitHub Actions.

**URL**: `https://YOUR_USERNAME.github.io/transformation-studio/`

### Custom Domain (Optional)
1. Add CNAME record in domain registrar pointing to `YOUR_USERNAME.github.io`
2. Go to Settings → Pages → Custom domain
3. Enter your domain

### Environment Variables
Add to GitHub repository **Settings → Secrets and variables → Actions**:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

---

## 🔧 Development

### Commands
```bash
npm run dev       # Start dev server (http://localhost:5173)
npm run build     # Build for production
npm run preview   # Preview production build
npm run deploy    # Build & deploy to GitHub Pages
```

### Browser DevTools
- React DevTools extension recommended
- Console: Check for Supabase connection status

### Debugging
```javascript
// Check auth state
useAuthStore.setState({ user: null })

// Check pricing data
usePricingStore(state => console.log(state.catalogues))

// Test Supabase connection
testSupabaseConnection()
```

---

## 📖 Documentation

- **Setup & Deployment**: [SETUP_GUIDE.md](./SETUP_GUIDE.md)
- **Conversion Details**: [CONVERSION_PLAN.md](./CONVERSION_PLAN.md)
- **React Docs**: https://react.dev
- **Supabase Docs**: https://supabase.com/docs
- **Vite Docs**: https://vitejs.dev

---

## 🐛 Troubleshooting

### App loads blank
```bash
# Check for errors
npm run build

# Hard refresh browser
Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
```

### Can't login
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env.local`
- Check Supabase project is active
- Ensure users were created via SQL script
- Check browser console for detailed errors (F12)

### Build fails
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### GitHub Actions fail
1. Check **Actions** tab for error logs
2. Verify `VITE_SUPABASE_*` secrets are set
3. Ensure main branch is up-to-date

---

## 🤝 Contributing

To extend features:

1. Create a feature branch: `git checkout -b feat/feature-name`
2. Make changes and test locally: `npm run dev`
3. Commit: `git commit -m "Add feature-name"`
4. Push: `git push origin feat/feature-name`
5. Open Pull Request

---

## 📝 License

This project is provided as-is. Modify freely for your organization.

---

## 🆘 Support

- **Issues**: Open an issue on GitHub
- **Questions**: Check docs or reach out to your team
- **Deployment Help**: See [SETUP_GUIDE.md](./SETUP_GUIDE.md)

---

**Built with ❤️ for UST Transformation Studio**

Last updated: 2026-09-03

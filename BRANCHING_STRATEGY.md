# Transformation Studio - Git Branching Strategy

⚠️ **INTERNAL DOCUMENTATION** - For team members only  
🔒 **This document should remain private** - Contains internal process details

## Overview
This repository follows a **GitHub Flow with Trunk-Based Development** approach, optimized for continuous delivery while maintaining stability.

---

## Branch Types & Naming Conventions

### 1. **main** (Production Branch)
- **Purpose**: Production-ready code only
- **Protection**: Requires PR reviews and CI checks before merge
- **Deployment**: Automatically deploys to production
- **Merge Policy**: Only merge via PR, never direct push
- **Format**: `main`

### 2. **dev** (Development Integration Branch)
- **Purpose**: Integration branch for feature consolidation before main
- **Protection**: Requires PR reviews (can be more lenient than main)
- **Scope**: Accumulates tested features ready for release
- **Merge Policy**: Accept PRs from feature, bugfix, and enhancement branches
- **Format**: `dev`

### 3. **Feature Branches** (from `dev`)
- **Purpose**: Develop new features
- **Naming**: `feature/module-name-description`
- **Examples**:
  - `feature/pricing-bulk-import`
  - `feature/planner-gantt-export`
  - `feature/admin-audit-logs`
- **Base**: Branch from `dev`
- **Merge**: PR to `dev`, delete after merge

### 4. **Bugfix Branches** (from `dev`)
- **Purpose**: Fix bugs in development
- **Naming**: `bugfix/module-name-issue-number`
- **Examples**:
  - `bugfix/pricing-calculation-error`
  - `bugfix/planner-date-sync-123`
- **Base**: Branch from `dev`
- **Merge**: PR to `dev`, delete after merge

### 5. **Hotfix Branches** (from `main`)
- **Purpose**: Emergency fixes for production issues
- **Naming**: `hotfix/module-name-issue`
- **Examples**:
  - `hotfix/auth-login-crash`
  - `hotfix/pricing-export-500-error`
- **Base**: Branch from `main` (or `dev` if urgent dev fix)
- **Merge**: PR to both `main` AND `dev`, delete after merge
- **Urgency**: High priority, bypass non-critical reviews if needed

### 6. **Release Branches** (from `dev`)
- **Purpose**: Prepare release, version bumps, and release notes
- **Naming**: `release/v1.2.0`
- **Examples**:
  - `release/v1.0.0`
  - `release/v1.2.3`
- **Base**: Branch from `dev`
- **Merge**: 
  1. PR to `main` (triggers production deployment)
  2. Merge back to `dev`
- **Version**: Update version in `package.json`

### 7. **Experimental/Research Branches**
- **Purpose**: Proof-of-concepts, experimental features, tech exploration
- **Naming**: `experimental/description` or `research/description`
- **Examples**:
  - `experimental/ai-pricing-suggestions`
  - `research/dark-mode-implementation`
- **Base**: Can branch from `dev` or `main`
- **Cleanup**: Delete when no longer needed (don't merge to main)

---

## Workflow Diagrams

### Standard Feature Development
```
main (stable)
  ↓
dev (integration)
  ↓
feature/pricing-module
  ├─→ [Development]
  ├─→ [Testing]
  └─→ [PR Review] → Merge to dev
  
(Repeat for multiple features)

dev → [Accumulate features] → release/v1.1.0 → PR to main
```

### Hotfix Flow
```
main (production)
  ↓
hotfix/critical-bug
  ├─→ [Fix & Test]
  └─→ [PR Review]
      ├─→ Merge to main (emergency deploy)
      └─→ Cherry-pick to dev
```

### Release Process
```
dev (feature-complete)
  ↓
release/v1.1.0
  ├─→ Version bump
  ├─→ Release notes
  ├─→ Final testing
  └─→ PR to main (deploy)
      └─→ Merge back to dev
```

---

## Project Module Structure

Your app consists of three main modules:

### Pricing Module (`src/modules/pricing/`)
- Catalogue management
- Pricing parameters
- Estimates and exports
- **Related branches**: `feature/pricing-*`, `bugfix/pricing-*`

### Planner Module (`src/modules/planner/`)
- Gantt chart views
- Team management
- RACI matrices
- WBS (Work Breakdown Structure)
- **Related branches**: `feature/planner-*`, `bugfix/planner-*`

### Admin Module (`src/modules/admin/`)
- User management
- Role management
- Settings
- Audit logs
- **Related branches**: `feature/admin-*`, `bugfix/admin-*`

---

## GitHub Repository Settings (Recommended)

### Branch Protection Rules for `main`
- ✅ Require pull request reviews before merging
- ✅ Require status checks to pass before merging
- ✅ Require branches to be up to date before merging
- ✅ Dismiss stale pull request approvals when new commits are pushed
- ✅ Require code review from code owners (optional)

### Branch Protection Rules for `dev`
- ✅ Require pull request reviews before merging (but can use 1 reviewer)
- ✅ Require status checks to pass before merging
- ⚠️ Can dismiss stale reviews (more lenient than main)

---

## Common Workflows

### Creating a Feature
```bash
# Update dev branch
git checkout dev
git pull origin dev

# Create feature branch
git checkout -b feature/your-feature-name

# Make commits
git add .
git commit -m "feat: your feature description"

# Push and create PR
git push origin feature/your-feature-name
# Create PR on GitHub: dev ← feature/your-feature-name
```

### Creating a Bugfix
```bash
git checkout dev
git pull origin dev

git checkout -b bugfix/issue-description

# Fix and commit
git add .
git commit -m "fix: your bug description"

git push origin bugfix/issue-description
# Create PR on GitHub: dev ← bugfix/issue-description
```

### Creating a Hotfix (Production Issue)
```bash
git checkout main
git pull origin main

git checkout -b hotfix/critical-issue

# Fix and test thoroughly
git add .
git commit -m "hotfix: critical production issue"

git push origin hotfix/critical-issue
# Create TWO PRs:
# 1. main ← hotfix/critical-issue (merge immediately)
# 2. dev ← hotfix/critical-issue (or cherry-pick)
```

### Releasing a Version
```bash
git checkout dev
git pull origin dev

git checkout -b release/v1.1.0

# Update version
# Edit package.json version
# Add release notes

git add .
git commit -m "chore: release v1.1.0"
git push origin release/v1.1.0

# Create PR: main ← release/v1.1.0
# After merge to main, merge release back to dev

git checkout dev
git merge release/v1.1.0
git push origin dev
```

---

## Commit Message Conventions

Use conventional commits for clarity:

```
type(scope): subject

body (optional)
footer (optional)
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code refactoring (no feature/bug)
- `perf`: Performance improvement
- `style`: Code style (formatting, missing semicolons)
- `test`: Test additions/updates
- `docs`: Documentation
- `chore`: Build process, dependencies, etc.

**Scope** (your modules):
- `pricing`: Pricing module
- `planner`: Planner module
- `admin`: Admin module
- `ui`: UI components
- `auth`: Authentication
- `db`: Database/Supabase

**Examples**:
```
feat(pricing): add bulk import functionality
fix(planner): correct gantt chart date calculations
refactor(admin): simplify user role assignment
```

---

## Best Practices

1. **Keep branches short-lived**: Merge within 3-5 days to avoid conflicts
2. **Keep commits atomic**: One logical change per commit
3. **Write meaningful commit messages**: Future you will thank you
4. **Test locally before pushing**: Use `npm run dev` and test features
5. **Keep dev stable**: Only merge tested, reviewed code
6. **Sync frequently**: Pull from base branch regularly to minimize conflicts
7. **Delete merged branches**: Clean up after merging to keep repo tidy
8. **Use descriptive PR titles**: Reference issue numbers when applicable
9. **Review before merging**: At least one other reviewer
10. **Don't force push to shared branches**: Only to personal feature branches

---

## CI/CD Integration

Your workflows should trigger:
- **On PR to `dev`**: Lint, build, unit tests
- **On PR to `main`**: Lint, build, unit tests, integration tests
- **On merge to `main`**: Build and deploy to production
- **On merge to `dev`**: Build (verification only)

---

## Troubleshooting

### Merge Conflicts
```bash
git merge --abort  # Cancel merge
git pull origin dev  # Get latest
git merge feature/your-branch  # Try again
# Manually resolve conflicts, then commit
```

### Accidentally Committed to Wrong Branch
```bash
# Create new branch from current state
git checkout -b feature/new-branch

# Reset old branch
git checkout old-branch
git reset --hard HEAD~1

# Push new branch
git push origin feature/new-branch
```

### Need to Cherry-Pick a Commit
```bash
git log origin/source-branch  # Find commit hash
git cherry-pick <commit-hash>
git push origin your-branch
```

---

## Questions?
Refer to this document when:
- Creating a new branch
- Deciding where to merge
- Setting up PR reviews
- Planning a release

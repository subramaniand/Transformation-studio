# Security & Privacy Guide

**Status**: ⚠️ CURRENTLY PUBLIC - Ready to make private  
**Repository**: https://github.com/subramaniand/Transformation-studio

---

## 🔒 Making the Repository Private

### Step 1: Change Repository Visibility

**Via GitHub Web UI**:
1. Go to your repo
2. Click **Settings** → **General**
3. Scroll to **Danger Zone**
4. Click **Change repository visibility**
5. Select **Private**
6. Type repo name to confirm
7. Click **Make this repository private**

**Via GitHub CLI**:
```bash
gh repo edit --visibility private
```

**What This Does**:
- 🔐 Only invited collaborators can see the code
- 🚫 Public cannot discover/access the repo
- 📊 No search engine indexing
- ✅ GitHub Pages deployment can still be public (if needed)

---

## 📋 What's Already Protected

### ✅ Environment Variables (Not Committed)
```bash
.env.local                 # NOT in git (ignored)
.env.production.local      # NOT in git (ignored)
.env.*.local               # NOT in git (ignored)
```

**Configured in `.gitignore`**:
```
.env.local
.env.*.local
```

### ✅ Code Security Measures
- Supabase credentials loaded from environment only
- No hardcoded API keys in source code
- Placeholder values used as fallbacks
- Session management properly configured

### ✅ Dependencies Secure
- No vulnerable packages (regularly audit with `npm audit`)
- Locked dependencies in `package-lock.json`

---

## 🔐 Additional Security Steps

### 1. Create `.env.local` Template (For Team Members)

Create a `.env.example` file to show what's needed:

```bash
# .env.example (THIS FILE SHOULD BE PUBLIC)
# Copy this to .env.local and fill in actual values

# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Other environment variables (if any)
VITE_API_ENDPOINT=https://api.example.com
```

**Note**: `.env.example` should be public (helps new team members). Actual `.env.local` never committed.

### 2. Supabase Security Best Practices

**For Production**:
```javascript
// Already implemented in supabaseClient.js
{
  auth: {
    persistSession: false,      // Don't persist to local storage
    autoRefreshToken: false,    // Manual token management
  }
}
```

**Additional Recommendations**:
- Use Row-Level Security (RLS) in Supabase
- Set up proper database policies
- Use service role key only on backend (never in frontend)
- Rotate API keys regularly
- Monitor Supabase logs for suspicious activity

### 3. GitHub Repository Settings

**Recommended Protection Rules**:

For `main` branch:
```
✅ Require pull request reviews (2 minimum)
✅ Require status checks to pass
✅ Require branches up to date
✅ Require signed commits
✅ Dismiss stale PR approvals
```

For `dev` branch:
```
✅ Require pull request reviews (1 minimum)
✅ Require status checks to pass
```

### 4. Secrets Management (If Needed)

For GitHub Actions or CI/CD, store secrets:

```bash
# Via GitHub CLI
gh secret set SECRET_NAME --body "secret-value"

# Or via GitHub Web UI
Settings → Secrets and variables → Actions → New repository secret
```

Never commit secrets to any branch!

### 5. Audit Git History

Check if any secrets were ever accidentally committed:

```bash
# Search git history for common secrets patterns
git log -p | grep -i "password\|secret\|key\|token" | head -20

# Use truffleHog or similar tools for automated scanning
npx truffleHog --regex
```

If found, use `git-filter-branch` or `BFG Repo-Cleaner` to remove.

---

## 👥 Access Control

### Inviting Collaborators

**Via GitHub Web UI**:
1. Settings → Collaborators and teams
2. Click "Add people"
3. Enter username/email
4. Set permission level:
   - **Pull** - Can pull/clone (read-only)
   - **Push** - Can push to branches (write)
   - **Admin** - Can change settings (admin)

**Recommended**:
- Team leads: Admin
- Developers: Push
- Consultants: Pull
- Clients: Custom access (if needed)

### Removing Access

```bash
gh repo remove-collaborator username
```

---

## 📝 What to Remove from README (If Public Later)

If you ever make this public in the future, remove/redact:

❌ **Remove**:
- Supabase connection details
- API endpoints and keys
- Internal server IPs
- Database schema details
- Authentication flow details
- Internal team names/emails
- Deployment procedures
- Infrastructure details

✅ **Keep** (if public):
- Feature overview
- How to use the app
- Installation instructions (public package setup)
- Contributing guidelines
- License
- Contact information

---

## 🛡️ Branch Protection Checklist

### Before Making Private, Set Up Protections

```bash
# Check current rules
gh api repos/{owner}/{repo}/branches/main/protection

# Protect main branch (via CLI or web UI)
gh api repos/{owner}/{repo}/branches/main/protection \
  -f required_status_checks='{"strict":true,"contexts":[]}' \
  -f required_pull_request_reviews='{"dismiss_stale_reviews":true,"require_code_owner_reviews":false,"required_approving_review_count":2}'
```

---

## 🚨 Security Incident Response

**If you accidentally commit a secret**:

1. **Immediate**: Rotate the secret (regenerate API key, etc.)
2. **Short-term**: Use `git revert` to undo commit
3. **Long-term**: Use `git-filter-branch` or `BFG` to remove from history

```bash
# Example: Remove .env file from history
bfg --delete-files .env

# Or revert specific commit
git revert <commit-hash>
git push origin main
```

---

## 📊 Regular Security Audits

### Monthly
```bash
npm audit                    # Check for vulnerabilities
npm audit fix                # Auto-fix where possible
git log --oneline -20        # Check recent commits
gh repo view --json isPrivate # Verify privacy status
```

### Quarterly
```bash
# Review collaborators
gh api repos/{owner}/{repo}/collaborators --jq '.[] | {login, permission}'

# Check for forgotten branches
git branch -a

# Review GitHub Actions secrets
gh secret list
```

---

## 🔗 Additional Resources

- [GitHub Private Repository Docs](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/managing-repository-settings/setting-repository-visibility)
- [Supabase Security Docs](https://supabase.com/docs/guides/self-hosting/security/ssl-enforcement)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [GitHub Security Best Practices](https://docs.github.com/en/code-security/security-overview)

---

## 📋 Pre-Private Checklist

Before making the repo private, verify:

- [ ] No `.env` files committed
- [ ] No API keys in code
- [ ] No passwords in git history
- [ ] `.gitignore` has all sensitive files
- [ ] Collaborators list is correct
- [ ] Branch protection rules set
- [ ] No public GitHub Pages with sensitive data
- [ ] Documentation redacted if needed

---

## 🎯 Next Steps

1. **Today**: Review this guide and checklist
2. **This Week**: 
   - Make repository private
   - Set up branch protections
   - Review collaborators
3. **Ongoing**: 
   - Run `npm audit` monthly
   - Review access quarterly
   - Rotate secrets annually

---

**Last Updated**: 2026-09-04  
**Review Every**: 6 months

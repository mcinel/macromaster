# 📋 GitHub Pages Deployment Checklist

Use this checklist to ensure a smooth deployment process.

---

## Pre-Deployment ✅

### Code Preparation
- [ ] All features working locally
- [ ] No TypeScript errors (`npm run build` succeeds)
- [ ] Environment variables configured locally
- [ ] Test all execution modes (Demo, Web, Hybrid)
- [ ] Test macro creation and execution
- [ ] Test on mobile/tablet viewports

### Repository Setup
- [ ] GitHub repository created
- [ ] Code pushed to `main` branch
- [ ] `.github/workflows/deploy.yml` committed
- [ ] `.gitignore` file committed
- [ ] No sensitive keys in code (all in `.env`)

---

## GitHub Configuration ✅

### Pages Settings
- [ ] Navigate to Settings → Pages
- [ ] Source set to "GitHub Actions"
- [ ] Custom domain configured (if applicable)
- [ ] HTTPS enforcement enabled (after DNS propagation)

### Secrets Configuration
- [ ] Navigate to Settings → Secrets and variables → Actions
- [ ] Added: `VITE_SUPABASE_URL`
- [ ] Added: `VITE_SUPABASE_ANON_KEY`
- [ ] Added: `VITE_OPENAI_API_KEY`
- [ ] Verified secret names start with `VITE_`
- [ ] No service role key in frontend secrets

---

## Supabase Configuration ✅

### Database Setup
- [ ] KV store table exists and accessible
- [ ] Row Level Security (RLS) policies configured
- [ ] Authentication enabled
- [ ] CORS configured for your domain

### API Keys
- [ ] Anon/public key copied to GitHub Secrets
- [ ] Service role key kept secure (NOT in frontend)
- [ ] Project URL noted for secrets

### Edge Functions (Optional)
- [ ] Functions deployed to Supabase
- [ ] Function routes accessible
- [ ] CORS headers configured in functions

---

## OpenAI Configuration ✅

### API Setup
- [ ] OpenAI API key created
- [ ] Key added to GitHub Secrets
- [ ] Billing configured (if using paid tier)
- [ ] Rate limits understood
- [ ] Model confirmed (gpt-4o-mini)

---

## Deployment ✅

### Initial Deployment
- [ ] Pushed code to `main` branch
- [ ] Checked Actions tab for workflow run
- [ ] Workflow completed successfully (green checkmark)
- [ ] No build errors in logs
- [ ] Deployment time noted (~2 minutes)

### Verification
- [ ] Accessed live URL: `https://USERNAME.github.io/REPO/`
- [ ] Homepage loads correctly
- [ ] No console errors (check browser DevTools)
- [ ] Images and assets load
- [ ] Navigation works
- [ ] Dark mode toggles

---

## Functional Testing ✅

### Core Features
- [ ] Dashboard displays correctly
- [ ] Macro Creator opens
- [ ] AI macro generation works (with OpenAI API)
- [ ] Generated macros appear in preview
- [ ] Macros save to library
- [ ] Macros can be edited
- [ ] Macros can be deleted

### Execution Modes
- [ ] Demo mode works (simulated execution)
- [ ] Web mode works (browser APIs)
- [ ] Hybrid mode works (smart fallbacks)
- [ ] Android mode shows appropriate warnings
- [ ] Execution logs display correctly
- [ ] Running macros tracked in tab

### Settings
- [ ] Settings page loads
- [ ] Execution mode changes save
- [ ] Dark mode persists
- [ ] All toggles functional

### Mobile Experience
- [ ] Responsive design works
- [ ] Touch interactions smooth
- [ ] Scrollbars hidden (as requested)
- [ ] No horizontal scroll
- [ ] Text readable on small screens

---

## Performance ✅

### Loading Speed
- [ ] Initial load < 3 seconds
- [ ] Lighthouse score > 90
- [ ] Images optimized
- [ ] No blocking resources

### Functionality
- [ ] Smooth animations
- [ ] No lag in macro execution
- [ ] Toasts appear promptly
- [ ] No memory leaks (test extended usage)

---

## Security ✅

### Frontend Security
- [ ] No API keys in code
- [ ] No service role key exposed
- [ ] All secrets in GitHub Secrets
- [ ] HTTPS enforced
- [ ] Content Security Policy considered

### Backend Security
- [ ] Supabase RLS enabled
- [ ] Authentication required for sensitive ops
- [ ] Input validation on all forms
- [ ] Rate limiting configured
- [ ] CORS properly configured

---

## Documentation ✅

### User Documentation
- [ ] README.md updated with live URL
- [ ] Features documented
- [ ] Usage instructions clear
- [ ] Screenshots/demo included

### Developer Documentation
- [ ] Deployment process documented
- [ ] Environment variables listed
- [ ] Architecture diagrams included
- [ ] Contributing guidelines (if open source)

---

## Post-Deployment ✅

### Monitoring
- [ ] Set up uptime monitoring (UptimeRobot, etc.)
- [ ] Configure error tracking (optional)
- [ ] Add analytics (optional)
- [ ] Monitor Supabase usage dashboard

### User Feedback
- [ ] Share with test users
- [ ] Collect feedback
- [ ] Create issue tracker
- [ ] Plan iterations

### Continuous Deployment
- [ ] Understand git workflow
- [ ] Test before pushing to main
- [ ] Monitor Actions for failed builds
- [ ] Keep dependencies updated

---

## Custom Domain (If Applicable) ✅

### DNS Configuration
- [ ] Domain purchased
- [ ] DNS records added:
  - [ ] A records for apex domain (if applicable)
  - [ ] CNAME record for subdomain
- [ ] Records verified (use `nslookup` or `dig`)
- [ ] Waited 24-48 hours for propagation

### GitHub Configuration
- [ ] Custom domain added in Pages settings
- [ ] DNS check passed (green checkmark)
- [ ] HTTPS certificate provisioned
- [ ] "Enforce HTTPS" enabled

---

## Troubleshooting Common Issues ✅

### Issue: Blank Page
- [ ] Check browser console for errors
- [ ] Verify environment variables
- [ ] Check base path configuration
- [ ] Verify build succeeded

### Issue: 404 on Refresh
- [ ] Check `404.html` exists in dist
- [ ] Verify workflow creates redirect
- [ ] Test direct navigation to routes

### Issue: API Calls Fail
- [ ] Verify Supabase URL in secrets
- [ ] Check API key is correct
- [ ] Verify CORS configuration
- [ ] Check network tab for errors

### Issue: Build Fails
- [ ] Check Actions log for errors
- [ ] Verify TypeScript compiles locally
- [ ] Check all dependencies installed
- [ ] Verify secrets are set

---

## Rollback Plan ✅

In case of critical issues:

### Option 1: Revert Commit
```bash
git revert HEAD
git push origin main
```

### Option 2: Deploy Previous Version
```bash
git reset --hard COMMIT_HASH
git push -f origin main
```

### Option 3: Disable Site Temporarily
- [ ] Go to Settings → Pages
- [ ] Change source to "None"
- [ ] Fix issues locally
- [ ] Re-enable when ready

---

## Success Criteria ✅

Your deployment is successful when:

- ✅ Site loads at public URL
- ✅ All core features work
- ✅ No console errors
- ✅ Mobile responsive
- ✅ HTTPS enabled
- ✅ Performance acceptable
- ✅ Users can create and run macros
- ✅ AI generation works
- ✅ Data persists in Supabase

---

## Maintenance Schedule

### Weekly
- [ ] Check uptime status
- [ ] Review Supabase usage
- [ ] Monitor OpenAI API usage
- [ ] Check for security updates

### Monthly
- [ ] Update dependencies
- [ ] Review analytics
- [ ] Backup data
- [ ] Performance audit

### Quarterly
- [ ] Major feature updates
- [ ] User feedback implementation
- [ ] Security audit
- [ ] Documentation update

---

## Resources

- **Deployment Guide:** `/GITHUB_PAGES_DEPLOYMENT.md`
- **Quick Start:** `/DEPLOY_QUICK_START.md`
- **GitHub Pages Docs:** https://docs.github.com/pages
- **Supabase Docs:** https://supabase.com/docs
- **Support:** Create issue in repository

---

## Notes

**Date Deployed:** _____________

**Deployed By:** _____________

**Live URL:** _____________

**Custom Domain:** _____________

**Supabase Project ID:** _____________

**GitHub Repository:** _____________

---

**Deployment Status: 🚀 Ready for Launch!**

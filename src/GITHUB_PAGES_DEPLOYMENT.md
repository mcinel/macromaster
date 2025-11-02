# GitHub Pages Deployment Guide

## Overview
This guide walks you through deploying your Android Automation App to GitHub Pages for free static hosting.

## Prerequisites
- GitHub account
- Your app code in a GitHub repository
- Basic familiarity with Git commands

---

## Step 1: Prepare Your Repository

### 1.1 Create a GitHub Repository (if not already done)

```bash
# Initialize git in your project (if not already initialized)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Android Automation App"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### 1.2 Important: Update Environment Variables

Since this is a static deployment, you'll need to handle the Supabase configuration:

**Option A: Use Environment Variables (Recommended for Security)**
- During GitHub Actions build, secrets will be injected
- Follow Step 3 to set up GitHub Secrets

**Option B: Public Configuration (Less Secure)**
- Supabase ANON key is safe to expose (it's client-side anyway)
- Service role key should NEVER be in frontend code

---

## Step 2: GitHub Actions Workflow (Already Created!)

A GitHub Actions workflow file has been created at `.github/workflows/deploy.yml`.

This workflow:
- ✅ Triggers on push to `main` branch
- ✅ Builds your React app
- ✅ Injects environment variables from GitHub Secrets
- ✅ Deploys to GitHub Pages automatically
- ✅ Handles routing for single-page apps

---

## Step 3: Configure GitHub Repository Settings

### 3.1 Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** tab
3. Scroll to **Pages** section (left sidebar)
4. Under **Source**, select:
   - Source: **GitHub Actions**
5. Click **Save**

### 3.2 Add GitHub Secrets (Required for Supabase)

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add the following secrets:

| Secret Name | Value | Where to Find It |
|-------------|-------|------------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Supabase Dashboard → Settings → API |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon/public key | Supabase Dashboard → Settings → API |
| `VITE_OPENAI_API_KEY` | Your OpenAI API key | OpenAI Dashboard → API Keys |

**Note:** The `SUPABASE_SERVICE_ROLE_KEY` should NOT be in the frontend. It should only be used in Supabase Edge Functions (server-side).

---

## Step 4: Deploy!

### 4.1 Push Your Code

```bash
# Make sure the .github/workflows/deploy.yml file is committed
git add .github/workflows/deploy.yml
git commit -m "Add GitHub Pages deployment workflow"
git push origin main
```

### 4.2 Monitor Deployment

1. Go to your repository on GitHub
2. Click the **Actions** tab
3. You should see a workflow run in progress
4. Click on it to see the build logs
5. Wait for the green checkmark ✅

### 4.3 Access Your Deployed App

Your app will be available at:
```
https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/
```

For example:
- Username: `john-doe`
- Repo: `automation-app`
- URL: `https://john-doe.github.io/automation-app/`

---

## Step 5: Configure Custom Domain (Optional)

### 5.1 Add Custom Domain

1. Go to **Settings** → **Pages**
2. Under **Custom domain**, enter your domain (e.g., `automateapp.com`)
3. Click **Save**

### 5.2 Update DNS Records

Add these DNS records at your domain provider:

**For apex domain (example.com):**
```
A Record:
  Host: @
  Points to: 185.199.108.153
  
A Record:
  Host: @
  Points to: 185.199.109.153
  
A Record:
  Host: @
  Points to: 185.199.110.153
  
A Record:
  Host: @
  Points to: 185.199.111.153
```

**For subdomain (www.example.com or app.example.com):**
```
CNAME Record:
  Host: www (or app)
  Points to: YOUR_USERNAME.github.io
```

### 5.3 Enable HTTPS

GitHub Pages automatically provides free SSL certificates via Let's Encrypt.
- Wait 24 hours for DNS propagation
- GitHub will automatically provision the certificate
- Check "Enforce HTTPS" in the Pages settings

---

## Troubleshooting

### Issue: 404 Error on Page Refresh

**Cause:** Single-page apps need special routing configuration

**Solution:** The workflow includes a `404.html` that redirects to `index.html`. This is already handled!

### Issue: Environment Variables Not Working

**Check:**
1. Secrets are correctly named (must start with `VITE_`)
2. Secrets are added in repository settings
3. Workflow has access to secrets
4. You've pushed code after adding secrets (trigger a new build)

**Re-trigger deployment:**
```bash
git commit --allow-empty -m "Trigger deployment"
git push origin main
```

### Issue: Build Fails

**Check the Actions log:**
1. Go to Actions tab
2. Click on the failed workflow
3. Expand the failing step
4. Look for error messages

**Common issues:**
- Missing dependencies: Check package.json
- TypeScript errors: Fix them locally first
- Environment variable issues: Verify secrets

### Issue: Supabase Functions Not Working

**Note:** Supabase Edge Functions run on Supabase infrastructure, not GitHub Pages.

**Your deployed app will:**
- ✅ Work: Frontend UI, client-side features
- ✅ Work: Supabase Auth (client-side)
- ✅ Work: Supabase Database queries (via client)
- ✅ Work: AI macro generation (if API keys configured)
- ⚠️ Limited: Server-side functions (need Supabase deployment)

**To keep using Edge Functions:**
- Deploy them separately to Supabase (see Step 6)
- Your GitHub Pages frontend will call them remotely

---

## Step 6: Deploy Supabase Edge Functions (Optional)

If you want to use the server-side execution features:

### 6.1 Install Supabase CLI

```bash
npm install -g supabase
```

### 6.2 Login to Supabase

```bash
supabase login
```

### 6.3 Link Your Project

```bash
supabase link --project-ref YOUR_PROJECT_ID
```

### 6.4 Deploy Functions

```bash
supabase functions deploy server
```

Your functions will be available at:
```
https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-c7d9e72f/*
```

---

## Architecture After Deployment

```
┌─────────────────────────────────────────┐
│        GitHub Pages (Frontend)          │
│   https://username.github.io/repo/      │
│                                          │
│  • React App (Static Files)             │
│  • Client-side execution                │
│  • UI Components                        │
└──────────────┬──────────────────────────┘
               │
               │ API Calls
               │
┌──────────────▼──────────────────────────┐
│      Supabase (Backend Services)        │
│   https://project.supabase.co           │
│                                          │
│  • Authentication                        │
│  • Database (KV Store)                  │
│  • Edge Functions (Server Routes)       │
│  • Storage (File uploads)               │
└─────────────────────────────────────────┘
```

---

## Continuous Deployment

After initial setup, any push to the `main` branch will automatically:
1. Build the app
2. Run tests (if configured)
3. Deploy to GitHub Pages
4. Update your live site

**Workflow:**
```bash
# Make changes locally
git add .
git commit -m "Add new feature"
git push origin main

# GitHub Actions automatically:
# 1. Builds your app
# 2. Deploys to Pages
# 3. Your site updates in ~2 minutes!
```

---

## Monitoring & Analytics (Optional)

### Add Google Analytics

1. Get your GA4 tracking ID
2. Add to your `index.html` or App.tsx:

```typescript
// In App.tsx
useEffect(() => {
  // Google Analytics
  const script = document.createElement('script');
  script.src = 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX';
  script.async = true;
  document.head.appendChild(script);
  
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
}, []);
```

### Monitor Uptime

Free services:
- **UptimeRobot**: https://uptimerobot.com
- **StatusCake**: https://www.statuscake.com
- **Pingdom**: https://www.pingdom.com (limited free tier)

---

## Cost Breakdown

| Service | Cost | Limit |
|---------|------|-------|
| GitHub Pages | **FREE** | 100GB bandwidth/month, 1GB storage |
| Supabase Free Tier | **FREE** | 500MB database, 1GB file storage, 2GB bandwidth |
| Custom Domain | **$10-15/year** | (optional) |
| **Total** | **$0-15/year** | 🎉 |

---

## Alternatives to GitHub Pages

If you need more features or hit limits:

| Service | Free Tier | Best For |
|---------|-----------|----------|
| **Vercel** | Unlimited sites, 100GB bandwidth | Next.js, serverless functions |
| **Netlify** | 100GB bandwidth, 300 build mins | JAMstack, form handling |
| **Cloudflare Pages** | Unlimited bandwidth, 500 builds/month | Global CDN, edge computing |
| **Firebase Hosting** | 10GB storage, 360MB/day bandwidth | Google ecosystem integration |

---

## Security Checklist

Before deploying, verify:

- [ ] `SUPABASE_SERVICE_ROLE_KEY` is NOT in frontend code
- [ ] API keys are stored as GitHub Secrets
- [ ] Supabase Row Level Security (RLS) is enabled
- [ ] CORS is properly configured in Supabase
- [ ] Authentication is required for sensitive operations
- [ ] Input validation on all user inputs
- [ ] Rate limiting configured in Supabase

---

## Next Steps

1. ✅ Deploy to GitHub Pages (follow this guide)
2. 🎨 Customize your domain (optional)
3. 📊 Add analytics (optional)
4. 🔒 Review security settings
5. 📱 Test on mobile devices
6. 🚀 Share with users!

---

## Support & Resources

- **GitHub Pages Docs**: https://docs.github.com/pages
- **GitHub Actions Docs**: https://docs.github.com/actions
- **Supabase Docs**: https://supabase.com/docs
- **Vite Deployment Guide**: https://vitejs.dev/guide/static-deploy

---

## Summary

You now have a **free, automated deployment pipeline** that:
- ✅ Builds and deploys on every push
- ✅ Handles environment variables securely
- ✅ Provides HTTPS automatically
- ✅ Scales to handle traffic
- ✅ Costs $0 (unless you want a custom domain)

**Happy deploying! 🚀**

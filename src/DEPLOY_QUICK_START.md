# 🚀 Quick Start: Deploy to GitHub Pages in 5 Minutes

## Step 1: Push Your Code to GitHub

```bash
# If you haven't already initialized git:
git init
git add .
git commit -m "Initial commit"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

## Step 2: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** tab
3. Click **Pages** in the left sidebar
4. Under **Source**, select **GitHub Actions**
5. Click **Save**

## Step 3: Add Secrets

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add these three secrets:

```
Name: VITE_SUPABASE_URL
Value: [Your Supabase project URL]

Name: VITE_SUPABASE_ANON_KEY
Value: [Your Supabase anon key]

Name: VITE_OPENAI_API_KEY
Value: [Your OpenAI API key]
```

**Where to find these:**
- Supabase: Dashboard → Settings → API
- OpenAI: https://platform.openai.com/api-keys

## Step 4: Trigger Deployment

```bash
# The workflow file is already committed, so just push:
git commit --allow-empty -m "Trigger deployment"
git push origin main
```

## Step 5: Check Your Live Site! 🎉

1. Go to **Actions** tab in your repo
2. Wait for the green checkmark (takes ~2 minutes)
3. Your site is live at:
   ```
   https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/
   ```

---

## What If Base Path Doesn't Work?

If your app shows broken links or blank page, update the base path:

### Option A: Repository is named `YOUR_USERNAME.github.io`
Your site will be at `https://YOUR_USERNAME.github.io/` (no subpath)

**Action:** No changes needed! The default base path `/` works.

### Option B: Repository has a different name (e.g., `automation-app`)
Your site will be at `https://YOUR_USERNAME.github.io/automation-app/`

**Action:** The workflow already handles this! GitHub Pages sets the base path automatically.

---

## Troubleshooting

### ❌ Blank Page After Deploy

**Fix:** Check browser console for errors. Usually CORS or API key issues.

```bash
# Make sure secrets are added correctly
# Then re-trigger deployment:
git commit --allow-empty -m "Fix environment variables"
git push
```

### ❌ 404 on Page Refresh

**Fix:** Already handled! The workflow creates a `404.html` redirect.

### ❌ Build Fails

**Fix:** Check the Actions log for specific errors.

Common issues:
- TypeScript errors → Fix them locally and push again
- Missing dependencies → Check package.json
- Missing secrets → Add them in Settings

---

## Custom Domain (Optional)

### Use Your Own Domain

1. Buy a domain (e.g., from Namecheap, GoDaddy)
2. Go to **Settings** → **Pages** → **Custom domain**
3. Enter your domain: `automateapp.com`
4. Add DNS records at your domain provider:

```
CNAME Record:
  Host: www
  Points to: YOUR_USERNAME.github.io
```

5. Wait 24 hours for DNS propagation
6. Enable "Enforce HTTPS"

---

## What's Deployed?

✅ **Working:**
- Full UI and all components
- Client-side macro execution (Demo, Web, Hybrid modes)
- AI macro generation (via OpenAI API)
- Supabase authentication
- Macro storage in Supabase database

⚠️ **Limited:**
- Server-side execution requires Supabase Edge Functions deployed separately
- See `/GITHUB_PAGES_DEPLOYMENT.md` for full Edge Functions deployment

---

## Continuous Deployment

From now on, every push to `main` automatically deploys:

```bash
# Make changes
git add .
git commit -m "Add new feature"
git push

# ✨ Automatically builds and deploys in ~2 minutes!
```

---

## Monitor Your Deployment

**View Deployment Status:**
- Repository → Actions tab → See workflow runs

**View Live Site:**
- Repository → Environments → github-pages → View deployment

**View Usage:**
- Settings → Pages → Shows domain and build status

---

## Cost: $0/year 🎉

- GitHub Pages: Free (100GB bandwidth/month)
- Supabase: Free tier (500MB DB, 2GB bandwidth)
- SSL Certificate: Free (via Let's Encrypt)

**Optional:**
- Custom domain: ~$10-15/year

---

## Next Steps

1. ✅ Deploy using this guide
2. 📱 Test your live site
3. 🎨 Add custom domain (optional)
4. 📊 Add analytics (optional)
5. 🚀 Share with users!

**Full documentation:** See `/GITHUB_PAGES_DEPLOYMENT.md`

---

**Your app is ready to go live! 🚀**

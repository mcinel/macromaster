# 🚀 Quick Guide: Push Your Code to GitHub

## ⚡ Fast Track (5 Minutes)

### Step 1: Install Git (if needed)
```bash
# Check if Git is installed
git --version

# If not installed, download from: https://git-scm.com/downloads
```

### Step 2: Configure Git
```bash
# Set your name
git config --global user.name "Your Name"

# Set your email (use your GitHub email)
git config --global user.email "your.email@example.com"
```

### Step 3: Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `android-automation-app`
3. Description: `AI-powered Android automation app with macro generation`
4. **Public** (required for free GitHub Pages)
5. **DO NOT** check any boxes (no README, gitignore, or license)
6. Click **Create repository**

### Step 4: Initialize and Push
```bash
# Navigate to your project folder (where App.tsx is located)
cd /path/to/your/project

# Initialize Git
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: Android Automation App with AI macro generation"

# Rename branch to main
git branch -M main

# Connect to GitHub (REPLACE YOUR_USERNAME!)
git remote add origin https://github.com/YOUR_USERNAME/android-automation-app.git

# Push to GitHub
git push -u origin main
```

**When prompted for password:** Use a Personal Access Token (not your GitHub password)

### Step 5: Get Personal Access Token
If you don't have one:

1. Go to https://github.com/settings/tokens
2. Click **Generate new token (classic)**
3. Name: `Android Automation App`
4. Scopes: Select `repo` and `workflow`
5. Click **Generate token**
6. **Copy the token** (you won't see it again!)
7. Use this as your password when pushing

---

## ✅ Verify It Worked

1. Go to `https://github.com/YOUR_USERNAME/android-automation-app`
2. You should see all your files!

---

## 🚨 Important: Fix Workflow Location

I noticed your workflows are in `/workflows/` but they need to be in `/.github/workflows/`.

**Good news:** I've already created them in the correct location for you!

**Delete the old ones:**
```bash
# Remove the incorrectly placed workflows
rm -rf workflows/
```

Or manually delete the `/workflows/` folder.

---

## 📝 Files That Will Be Pushed

Your `.gitignore` prevents these from being uploaded:
- ❌ `node_modules/` (dependencies)
- ❌ `dist/` (build output)
- ❌ `.env` files (secrets)
- ❌ Firebase debug logs

Everything else will be uploaded:
- ✅ All your source code
- ✅ Components
- ✅ Utilities
- ✅ Configuration files
- ✅ Documentation
- ✅ GitHub Actions workflows (in `.github/workflows/`)

---

## 🎯 After Pushing - Next Steps

### 1. Enable GitHub Pages
- Repository → **Settings** → **Pages**
- Source: **GitHub Actions**
- Save

### 2. Add Secrets
- Repository → **Settings** → **Secrets and variables** → **Actions**
- Click **New repository secret**

Add these 3 secrets:

| Name | Value | Where to Get |
|------|-------|--------------|
| `VITE_SUPABASE_URL` | Your Supabase URL | Supabase Dashboard → Settings → API |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key | Supabase Dashboard → Settings → API |
| `VITE_OPENAI_API_KEY` | Your OpenAI key | OpenAI Dashboard → API Keys |

### 3. Deploy!
Once secrets are added, the GitHub Actions workflow will automatically run and deploy your app!

**Your site will be live at:**
```
https://YOUR_USERNAME.github.io/android-automation-app/
```

---

## 🔄 Making Changes Later

After initial push, when you make changes:

```bash
# 1. Make your changes to files

# 2. Stage changes
git add .

# 3. Commit
git commit -m "Description of what you changed"

# 4. Push
git push

# Deployment happens automatically! 🎉
```

---

## 🐛 Common Issues

### Issue: "fatal: not a git repository"
```bash
# You're in the wrong directory
# Navigate to your project folder first
cd /path/to/your/android-automation-app
```

### Issue: "remote origin already exists"
```bash
# Remove and re-add
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/android-automation-app.git
```

### Issue: "Authentication failed"
You need a Personal Access Token, not your GitHub password.
See "Step 5: Get Personal Access Token" above.

### Issue: "Updates were rejected"
```bash
# Someone else pushed or you made changes on GitHub
# Pull first, then push
git pull origin main --rebase
git push origin main
```

### Issue: Workflow not running
Make sure workflows are in `.github/workflows/` not `/workflows/`
I've already created them in the correct location!

---

## 📚 Full Documentation

For more details, see:
- **Complete Git Guide:** `GIT_SETUP_GUIDE.md`
- **GitHub Pages Deployment:** `DEPLOY_QUICK_START.md`
- **Firebase Deployment:** `FIREBASE_QUICK_START.md`

---

## ✅ Checklist

- [ ] Git installed and configured
- [ ] GitHub account created
- [ ] GitHub repository created (public)
- [ ] Code committed locally
- [ ] Connected to GitHub remote
- [ ] Pushed to GitHub successfully
- [ ] Verified files on GitHub
- [ ] Deleted old `/workflows/` folder
- [ ] GitHub Pages enabled (Settings → Pages)
- [ ] Secrets added (3 required)
- [ ] Workflow running (check Actions tab)

---

## 🎉 Summary

```bash
# Quick commands (copy-paste ready):

git init
git add .
git commit -m "Initial commit: Android Automation App"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/android-automation-app.git
git push -u origin main

# Then delete old workflows folder:
rm -rf workflows/
```

**Replace `YOUR_USERNAME` with your actual GitHub username!**

**After pushing:**
1. Enable GitHub Pages in Settings
2. Add 3 secrets
3. Wait ~2 minutes
4. Your app is live! 🚀

---

**Need help?** See `GIT_SETUP_GUIDE.md` for detailed troubleshooting!

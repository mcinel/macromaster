# 🚀 Export from Figma Make to GitHub

## Overview

Your code is currently in **Figma Make** (cloud-based). To push it to GitHub, you need to:
1. **Download** your code from Figma Make to your computer
2. **Push** it to GitHub from your computer

---

## 📥 Step 1: Download Your Code from Figma Make

### Option A: Export Project (Recommended)

1. **In Figma Make**, look for an **Export** or **Download** button
   - Usually in the top-right corner
   - Or in a menu (⋮ or ≡)
   - Or in File menu

2. **Export as ZIP file**
   - Select "Download project" or "Export"
   - Choose format: **ZIP** or **Source code**
   - Save to your computer

3. **Extract the ZIP file**
   - Right-click the downloaded ZIP
   - Select "Extract All" (Windows) or double-click (Mac)
   - Choose a location like `Documents/android-automation-app/`

### Option B: Copy Files Manually

If there's no export button:

1. **Create a new folder** on your computer:
   ```
   Documents/android-automation-app/
   ```

2. **Copy each file** from Figma Make to your local folder
   - You'll need to manually recreate the folder structure
   - This is tedious but works

### Option C: Use Figma Make's Git Integration (If Available)

Some Figma Make projects have built-in Git/GitHub integration:

1. Look for a **Git** or **GitHub** icon in Figma Make
2. Click **Connect to GitHub** or **Push to repository**
3. Follow the authentication flow
4. If this works, you're done! Skip to Step 3.

---

## 📁 Step 2: Verify Your Downloaded Code

After downloading, check that you have:

```
android-automation-app/
├── App.tsx
├── README.md
├── package.json          ← Important!
├── components/
├── utils/
├── supabase/
├── .github/
│   └── workflows/
│       ├── deploy.yml
│       └── firebase-deploy.yml
└── ... (all other files)
```

**Important files to verify:**
- ✅ `package.json` - Dependencies
- ✅ `.gitignore` - Git ignore rules
- ✅ `.github/workflows/` - Deployment workflows
- ✅ All your `.tsx` files

---

## 🔧 Step 3: Install Git (If Not Already Installed)

### Check if Git is installed:

```bash
git --version
```

If you see a version number, **skip to Step 4**.

### Install Git:

**Windows:**
- Download: https://git-scm.com/download/win
- Run installer, click "Next" through all options
- Restart your terminal/command prompt

**Mac:**
```bash
# Using Homebrew (recommended)
brew install git

# Or download from: https://git-scm.com/download/mac
```

**Linux:**
```bash
# Debian/Ubuntu
sudo apt-get install git

# Fedora
sudo dnf install git
```

### Verify installation:
```bash
git --version
# Should show: git version 2.x.x
```

---

## 📤 Step 4: Push to GitHub from Your Computer

### 4.1: Open Terminal in Your Project Folder

**Windows:**
- Open File Explorer
- Navigate to your `android-automation-app` folder
- Click in the address bar
- Type `cmd` and press Enter
- Terminal opens in the right location!

**Mac:**
- Open Finder
- Navigate to your folder
- Right-click the folder
- Select "New Terminal at Folder"

**Linux:**
- Navigate to folder in file manager
- Right-click → "Open Terminal Here"

### 4.2: Configure Git (First Time Only)

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### 4.3: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `android-automation-app`
3. Description: `AI-powered Android automation app`
4. **Public** (required for free GitHub Pages)
5. **DO NOT** check any boxes
6. Click **Create repository**
7. **Copy the repository URL**

### 4.4: Initialize and Push

```bash
# Initialize Git
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: Android Automation App from Figma Make"

# Rename branch to main
git branch -M main

# Connect to GitHub (REPLACE YOUR_USERNAME!)
git remote add origin https://github.com/YOUR_USERNAME/android-automation-app.git

# Push to GitHub
git push -u origin main
```

**When prompted for password:** Use a **Personal Access Token**, not your GitHub password.

### 4.5: Get Personal Access Token

1. Go to https://github.com/settings/tokens
2. Click **Generate new token (classic)**
3. Name: `Android Automation App`
4. Select scopes:
   - ✅ `repo`
   - ✅ `workflow`
5. Click **Generate token**
6. **Copy the token** (starts with `ghp_...`)
7. Use as password when pushing

---

## ✅ Step 5: Verify on GitHub

1. Go to `https://github.com/YOUR_USERNAME/android-automation-app`
2. You should see all your files!
3. Check that `.github/workflows/` exists
4. Verify `package.json` is there

**Success! Your code is on GitHub! 🎉**

---

## 🚀 Step 6: Deploy Your App

Now that your code is on GitHub, deploy it:

### Option A: GitHub Pages (Easiest)

1. **Enable Pages**
   - Repository → Settings → Pages
   - Source: **GitHub Actions**
   - Save

2. **Add Secrets**
   - Settings → Secrets and variables → Actions
   - Click **New repository secret**
   - Add these 3 secrets:

   | Name | Value |
   |------|-------|
   | `VITE_SUPABASE_URL` | Your Supabase URL |
   | `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key |
   | `VITE_OPENAI_API_KEY` | Your OpenAI API key |

3. **Trigger Deployment**
   - Go to Actions tab
   - Workflow should run automatically
   - Wait ~2 minutes

4. **Live at:**
   ```
   https://YOUR_USERNAME.github.io/android-automation-app/
   ```

📖 **Full Guide:** `DEPLOY_QUICK_START.md`

### Option B: Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Update .firebaserc with your project ID
# (Edit the file, replace "your-project-id")

# Build and deploy
npm run build
firebase deploy --only hosting
```

📖 **Full Guide:** `FIREBASE_QUICK_START.md`

---

## 🔄 Making Changes Later

### Workflow: Figma Make → Local → GitHub

**If you continue developing in Figma Make:**

1. Make changes in Figma Make
2. Download/export updated code
3. Replace local files
4. Push updates:
   ```bash
   git add .
   git commit -m "Update from Figma Make"
   git push
   ```

**Or develop locally going forward:**

1. Make changes in your local files
2. Push to GitHub:
   ```bash
   git add .
   git commit -m "Description of changes"
   git push
   ```
3. Deployment happens automatically!

---

## 🎯 Quick Summary

```
Figma Make (cloud)
       ↓ Export/Download
Your Computer (local files)
       ↓ git push
GitHub (repository)
       ↓ GitHub Actions
Live Website (deployed)
```

---

## 📋 Complete Checklist

- [ ] Download code from Figma Make
- [ ] Extract to local folder
- [ ] Verify all files present
- [ ] Install Git
- [ ] Configure Git (name, email)
- [ ] Create GitHub repository
- [ ] Initialize Git locally
- [ ] Push to GitHub
- [ ] Verify on GitHub
- [ ] Enable GitHub Pages
- [ ] Add secrets
- [ ] Deploy!

---

## 🐛 Troubleshooting

### Can't find export button in Figma Make

**Try:**
- Look for menu icons (⋮, ≡, ⋯)
- Check File menu
- Look for "Download", "Export", "Save"
- Try right-clicking in the file tree

### Downloaded ZIP doesn't include all files

**Fix:**
- Check if there's a "Download all files" option
- Verify you're not just downloading one file
- Try downloading the entire project, not individual files

### Missing package.json after download

**Important:** You need `package.json` for deployment to work.

**If missing:**
- Check if Figma Make has it in the file list
- You may need to create it manually (see below)

**Basic package.json:**
```json
{
  "name": "android-automation-app",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.1",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.38",
    "tailwindcss": "^4.0.0",
    "typescript": "^5.4.5",
    "vite": "^5.2.11"
  }
}
```

### Git commands not working

**Check:**
- Are you in the right folder? (Run `dir` on Windows or `ls` on Mac/Linux)
- Is Git installed? (Run `git --version`)
- Did you run `git init` first?

---

## 💡 Tips

1. **Keep local copy:** Don't delete your local folder after pushing
2. **Use Git going forward:** Easier than re-exporting from Figma Make
3. **Test locally:** Run `npm install` and `npm run dev` to test
4. **Bookmark this guide:** You'll reference it when making updates

---

## 🆘 Still Stuck?

### Can't export from Figma Make?

**Contact Figma Make support** or check their documentation for export instructions.

### Need help with Git?

Read: `GIT_SETUP_GUIDE.md` - Complete Git tutorial

### Need help deploying?

Read: `START_HERE_DEPLOYMENT.md` - Choose your platform

---

## ⚡ Quick Commands (After Download)

```bash
# Navigate to your folder
cd path/to/android-automation-app

# Configure Git
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Initialize and push
git init
git add .
git commit -m "Initial commit from Figma Make"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/android-automation-app.git
git push -u origin main
```

---

**Ready to export? Start with Step 1! 📥**

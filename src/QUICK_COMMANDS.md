# ⚡ Quick Commands Reference

## 🚀 Push to GitHub (Copy-Paste Ready)

```bash
# Navigate to your project
cd /path/to/your/android-automation-app

# Configure Git (first time only)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Initialize and push
git init
git add .
git commit -m "Initial commit: Android Automation App with AI macro generation"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/android-automation-app.git
git push -u origin main
```

**⚠️ Replace `YOUR_USERNAME` with your GitHub username!**

**Password:** Use Personal Access Token from https://github.com/settings/tokens

---

## 🔥 Deploy to Firebase

```bash
# Install Firebase CLI (first time only)
npm install -g firebase-tools

# Login
firebase login

# Update .firebaserc file with your project ID
# Then build and deploy:
npm run build
firebase deploy --only hosting
```

**Live at:** `https://YOUR_PROJECT_ID.web.app`

---

## 📄 Deploy to GitHub Pages

After pushing code to GitHub:

1. **Enable Pages:** Settings → Pages → Source: GitHub Actions
2. **Add Secrets:** Settings → Secrets → Actions
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_OPENAI_API_KEY`
3. **Wait:** ~2 minutes for deployment

**Live at:** `https://YOUR_USERNAME.github.io/android-automation-app/`

---

## 🔄 Update Your App (After Initial Deploy)

```bash
# Make your changes to code

# Stage, commit, and push
git add .
git commit -m "Description of changes"
git push

# Deployment happens automatically! 🎉
```

---

## 🔑 Get Your Secrets

### Supabase
```
1. Go to: https://supabase.com/dashboard
2. Select your project
3. Settings → API
4. Copy:
   - Project URL (VITE_SUPABASE_URL)
   - anon/public key (VITE_SUPABASE_ANON_KEY)
```

### OpenAI
```
1. Go to: https://platform.openai.com/api-keys
2. Create new secret key
3. Copy key (VITE_OPENAI_API_KEY)
```

---

## 🛠️ Useful Git Commands

```bash
# Check status
git status

# View changes
git diff

# View commit history
git log --oneline

# Undo changes (not committed)
git checkout -- filename.txt

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Update from GitHub
git pull
```

---

## 🧪 Test Locally

```bash
# Install dependencies
npm install

# Create .env.local file
# Add your environment variables

# Start development server
npm run dev

# Build for production
npm run build

# Test production build locally (Firebase)
firebase serve
```

---

## 📦 Package Management

```bash
# Install dependencies
npm install

# Update dependencies
npm update

# Check for security issues
npm audit

# Fix security issues
npm audit fix
```

---

## 🔥 Firebase Commands

```bash
# Login
firebase login

# List projects
firebase projects:list

# Use specific project
firebase use YOUR_PROJECT_ID

# Deploy
firebase deploy --only hosting

# Deploy to preview channel
firebase hosting:channel:deploy preview

# View releases
firebase hosting:releases:list

# Serve locally
firebase serve

# Get CI token (for GitHub Actions)
firebase login:ci
```

---

## 📊 Check Deployment Status

### GitHub Pages
```
1. Go to: https://github.com/YOUR_USERNAME/android-automation-app
2. Click: Actions tab
3. View: Latest workflow run
```

### Firebase
```
1. Go to: https://console.firebase.google.com
2. Select: Your project
3. Click: Hosting
4. View: Deployment history
```

---

## 🐛 Quick Fixes

### Reset Git remote
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/android-automation-app.git
```

### Force push (use carefully!)
```bash
git push -f origin main
```

### Clear Git cache
```bash
git rm -r --cached .
git add .
git commit -m "Clear cache"
```

### Re-trigger deployment
```bash
git commit --allow-empty -m "Trigger deployment"
git push
```

---

## 📱 Open Useful URLs

### Your Repositories
```
GitHub: https://github.com/YOUR_USERNAME
```

### Service Dashboards
```
Supabase: https://supabase.com/dashboard
OpenAI: https://platform.openai.com
Firebase: https://console.firebase.google.com
```

### Settings
```
GitHub Tokens: https://github.com/settings/tokens
GitHub SSH Keys: https://github.com/settings/keys
```

---

## 🎯 Quick Start Path

**Choose ONE:**

### Path A: GitHub Pages
```bash
# 1. Push to GitHub (see top of this file)
# 2. Enable Pages in Settings
# 3. Add 3 secrets
# ✅ Done!
```

### Path B: Firebase
```bash
# 1. Push to GitHub (see top of this file)
# 2. Run: npm install -g firebase-tools
# 3. Run: firebase login
# 4. Update .firebaserc
# 5. Run: npm run build && firebase deploy
# ✅ Done!
```

---

## 📚 Documentation Quick Access

| Need to... | Read this file |
|------------|----------------|
| Push code to GitHub | `PUSH_TO_GITHUB.md` |
| Choose deployment platform | `START_HERE_DEPLOYMENT.md` |
| Deploy to GitHub Pages | `DEPLOY_QUICK_START.md` |
| Deploy to Firebase | `FIREBASE_QUICK_START.md` |
| Learn Git in detail | `GIT_SETUP_GUIDE.md` |
| Compare platforms | `DEPLOYMENT_OPTIONS_COMPARISON.md` |
| Step-by-step checklist | `COMPLETE_SETUP_CHECKLIST.md` |

---

## ⏱️ Time Estimates

| Task | Time |
|------|------|
| Push to GitHub | 5 min |
| Deploy to GitHub Pages | 5 min |
| Deploy to Firebase | 5 min |
| Test deployment | 5 min |
| **Total** | **15-20 min** |

---

## 🎓 Learn More

```
Git: https://git-scm.com/doc
GitHub: https://docs.github.com
Firebase: https://firebase.google.com/docs
```

---

## 📞 Get Help

1. Check error messages in terminal
2. Review GitHub Actions logs
3. Check browser DevTools console
4. Search documentation files
5. Read platform-specific docs

---

**Keep this file handy for quick reference! 📌**

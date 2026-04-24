# DEPLOYMENT - Master Guide

Everything you need to deploy the email management system.

## 🚀 Quick Start (5 Minutes)

### Windows Users

```bash
cd "c:\PSA Ticketing and Schedule Web Portal"
.\deploy.bat
```

### macOS/Linux Users

```bash
cd "c:\PSA Ticketing and Schedule Web Portal"
chmod +x deploy.sh
./deploy.sh
```

This will:
1. ✅ Push to GitHub
2. ✅ Deploy to Supabase
3. ✅ Verify everything works

---

## 📋 What Gets Deployed

### To GitHub
- All frontend files (HTML, CSS, JS)
- Database migrations
- Edge Functions (TypeScript)
- Configuration files
- Documentation

### To Supabase
- **send-email function** - Sends personalized emails via SendGrid
- **retry-failed-email function** - Retries failed emails
- Environment variables for Edge Functions

---

## 🔧 Prerequisites Checklist

- [ ] Git installed (`git --version` in terminal)
- [ ] Node.js 16+ (`node --version`)
- [ ] Supabase CLI (`supabase --version`)
- [ ] `.env.local` file created with credentials
- [ ] GitHub account with repo created
- [ ] Supabase project created
- [ ] SendGrid API key obtained

### Missing Something?

**Git**: https://git-scm.com/download  
**Node.js**: https://nodejs.org  
**Supabase CLI**: `npm install -g supabase`  
**Environment Variables**: Create `.env.local` from `.env.example`

---

## 📚 Detailed Guides

### GitHub Deployment
👉 **[GITHUB_DEPLOYMENT_GUIDE.md](GITHUB_DEPLOYMENT_GUIDE.md)**
- How to set up Git
- Committing code
- Pushing to GitHub
- Branch management
- Troubleshooting

### Supabase Deployment
👉 **[SUPABASE_DEPLOY_GUIDE.md](SUPABASE_DEPLOY_GUIDE.md)**
- Deploying Edge Functions
- Database migrations
- Setting environment variables
- Monitoring deployments
- Troubleshooting

---

## 🤖 Automated CI/CD

### GitHub Actions Workflows

Located in `.github/workflows/`

**verify.yml** - Runs on every push/PR
- Verifies all files exist
- Checks configuration
- Scans for exposed secrets
- Status in Actions tab

**deploy.yml** - Runs on push to main
- Deploys Edge Functions to Supabase
- Sets environment variables
- Verifies deployment

### Setup for Automation

1. Go to GitHub repo Settings
2. Click Secrets and Variables > Actions
3. Add these secrets:
   ```
   SUPABASE_PROJECT_ID=your-project-id
   SUPABASE_ACCESS_TOKEN=your-token
   SENDGRID_API_KEY=your-api-key
   ```
4. Done! Deployments now automatic

---

## 📝 Typical Workflow

### Day-to-Day Development

```bash
# 1. Make changes to code
# Edit email-dashboard.js, add new template, etc.

# 2. Test locally
# http://localhost:8000/email-dashboard.html

# 3. Deploy (choose one)

# Option A: Use deploy script (easiest)
.\deploy.bat

# Option B: Manual Git
git add -A
git commit -m "[EmailSystem] Add new feature"
git push origin main

# 4. Monitor deployment
# GitHub Actions > Latest run > View logs
```

### After Push

```
Git Push
   ↓
GitHub Actions verify.yml runs
   ↓
GitHub Actions deploy.yml runs
   ↓
Edge Functions deployed to Supabase
   ↓
Deployment complete ✅
```

---

## 🐛 Troubleshooting

### Deploy Script Issues

```bash
# Check if prerequisites are installed
git --version
supabase --version
node --version

# Check .env.local exists
dir .env.local

# Check git status
git status
```

### GitHub Deployment Issues

See **[GITHUB_DEPLOYMENT_GUIDE.md](GITHUB_DEPLOYMENT_GUIDE.md)** > Troubleshooting

```bash
# Check remote is set
git remote -v

# Update remote if needed
git remote set-url origin https://github.com/rmallillin-cpu/PSA-Ticketing-and-Scheduling.git
```

### Supabase Deployment Issues

See **[SUPABASE_DEPLOY_GUIDE.md](SUPABASE_DEPLOY_GUIDE.md)** > Troubleshooting

```bash
# Check if logged in
supabase auth list

# Check functions status
supabase functions list --project-id your-project-id
```

### Email Not Sending

1. Check SendGrid API key is correct
2. Verify sender email is verified in SendGrid
3. Check Edge Function logs in Supabase Dashboard
4. Check browser console for errors

---

## 🔐 Security Best Practices

### DO ✅
- ✅ Keep `.env.local` in `.gitignore`
- ✅ Use GitHub Secrets for CI/CD
- ✅ Rotate API keys regularly
- ✅ Use strong passwords
- ✅ Enable 2FA on GitHub

### DON'T ❌
- ❌ Never commit `.env.local`
- ❌ Never hardcode API keys
- ❌ Never commit `.env` files
- ❌ Never share API keys
- ❌ Never push credentials to GitHub

### Check for Exposed Secrets

```bash
# Search for API keys in code
git log -p | grep "SG\."  # SendGrid
git log -p | grep "AKIA"  # AWS
git log -p | grep "sk_"   # Generic API key
```

---

## 📊 Monitoring Deployments

### GitHub Actions

1. Go to repository > Actions tab
2. View latest workflow run
3. Click job to see detailed logs
4. Check for ✅ or ❌ status

### Supabase Dashboard

1. Go to https://app.supabase.com
2. Select your project
3. Go to Edge Functions
4. View function logs in Logs tab
5. Monitor database in Tables section

### Email Logs

1. Access email dashboard
2. Go to Logs tab
3. View sent/failed emails
4. Check error messages

---

## 🎯 Deployment Checklist

Before deploying to production:

```bash
# 1. Verify everything works locally
./deploy.bat --dry-run  # (or equivalent)

# 2. Check all files are committed
git status              # Should be clean

# 3. Verify environment
git log -1 --oneline    # Latest commit looks good

# 4. Check GitHub Actions pass
# Go to GitHub > Actions tab > verify latest run

# 5. Deploy when ready
./deploy.bat            # Windows
# or
./deploy.sh             # macOS/Linux

# 6. Monitor deployment
# GitHub Actions > deploy.yml run
# Supabase Dashboard > Functions

# 7. Verify in production
# Access email-dashboard.html
# Test with sample contact
# Check logs in dashboard
```

---

## 📦 Environment Setup

### Local Development

```bash
# Create .env.local from template
cp .env.example .env.local

# Edit with your credentials
# VITE_SUPABASE_URL=https://your-project.supabase.co
# VITE_SUPABASE_ANON_KEY=eyJhbGc...
# etc.
```

### Supabase Secrets (for Edge Functions)

Set in Supabase Dashboard > Edge Functions > Settings:
```
SENDGRID_API_KEY=SG.your-key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

### GitHub Secrets (for CI/CD)

Set in GitHub Repo Settings > Secrets:
```
SUPABASE_PROJECT_ID=your-project-id
SUPABASE_ACCESS_TOKEN=your-token
SENDGRID_API_KEY=your-api-key
```

---

## 📱 Accessing Your System

After successful deployment:

```
Frontend: https://yourdomain.com/email-dashboard.html
GitHub:   https://github.com/rmallillin-cpu/PSA-Ticketing-and-Scheduling/
Supabase: https://app.supabase.com/projects/your-project-id
```

---

## 🆘 Getting Help

### Documentation Files
- **EMAIL_SETUP_GUIDE.md** - Initial setup
- **EMAIL_QUICK_START.md** - 5-min quick start
- **EMAIL_SYSTEM_README.md** - Feature documentation
- **GITHUB_DEPLOYMENT_GUIDE.md** - GitHub guide
- **SUPABASE_DEPLOY_GUIDE.md** - Supabase guide
- **DEPLOYMENT.md** (this file) - Master guide

### Resources
- **Git**: https://git-scm.com/doc
- **GitHub**: https://docs.github.com
- **Supabase**: https://supabase.com/docs
- **SendGrid**: https://sendgrid.com/docs

---

## 🎉 You're All Set!

Your email management system is ready for deployment!

### Next Step: Deploy

```bash
# Windows
.\deploy.bat

# macOS/Linux
./deploy.sh
```

The deployment will:
1. ✅ Push to GitHub
2. ✅ Deploy to Supabase
3. ✅ Verify success
4. ✅ Show status

After deployment, you can:
- 📧 Send personalized emails
- 👥 Manage contacts
- 📋 Track email logs
- 🔄 Retry failed emails
- 📊 Monitor analytics

**Happy deploying!** 🚀

---

**Version**: 1.0.0  
**Last Updated**: April 24, 2026  
**Status**: Ready for Production ✅

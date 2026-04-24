# GitHub Deployment Guide

Complete guide for pushing your email management system to GitHub.

## Prerequisites

1. **Git installed** - Download from https://git-scm.com
2. **GitHub account** - Sign up at https://github.com
3. **Repository created** - https://github.com/rmallillin-cpu/PSA-Ticketing-and-Scheduling/
4. **Git configured locally**:
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "your-email@example.com"
   ```

## Initial Setup (First Time Only)

### Step 1: Clone Repository

```bash
cd "c:\PSA Ticketing and Schedule Web Portal"
git init
```

### Step 2: Add Remote

```bash
# Add GitHub as remote
git remote add origin https://github.com/rmallillin-cpu/PSA-Ticketing-and-Scheduling.git

# Verify remote is added
git remote -v
```

### Step 3: Create .gitignore

The `.gitignore` file is already created. It prevents sensitive files from being committed.

## Standard Deployment Workflow

### Method 1: Using Deploy Script (Easiest)

**Windows:**
```bash
.\deploy.bat
```

**macOS/Linux:**
```bash
chmod +x deploy.sh
./deploy.sh
```

The script will:
- Check prerequisites
- Stage all changes
- Commit with timestamp
- Push to GitHub
- Deploy to Supabase
- Verify deployment

### Method 2: Manual Git Commands

```bash
# 1. Check status
git status

# 2. Stage all files
git add -A

# 3. Commit with message
git commit -m "[EmailSystem] Add email management system features - $(date)"

# 4. Push to GitHub
git push origin main

# Or if using master branch:
git push origin master
```

### Method 3: GitHub Desktop App

1. Download GitHub Desktop: https://desktop.github.com
2. Sign in with GitHub account
3. Clone repository
4. Make changes
5. Commit changes in GitHub Desktop
6. Push to GitHub

## Understanding Git Flow

```
Local Changes
    ↓
git add -A          (Stage changes)
    ↓
git commit -m "msg" (Commit to local repo)
    ↓
git push            (Push to GitHub)
    ↓
GitHub Repository
```

## Commit Message Best Practices

Use descriptive commit messages:

```bash
# Good ✅
git commit -m "[EmailSystem] Add contact management features"
git commit -m "[EmailSystem] Fix email personalization placeholders"
git commit -m "[Database] Add email_logs table with indexes"

# Avoid ❌
git commit -m "Update"
git commit -m "Fix bug"
git commit -m "Stuff"
```

### Commit Message Format

```
[Component] Brief description

Optional longer description explaining:
- What changed
- Why it changed
- Any related issues
```

## Viewing Commit History

```bash
# View last 10 commits
git log --oneline -10

# View commits with details
git log --pretty=format:"%h %ad %s" --date=short

# View specific file history
git log -- filename.txt
```

## Making Changes and Pushing

### Workflow

```bash
# 1. Make changes to files locally
# Edit email-dashboard.js, config.js, etc.

# 2. Check what changed
git status

# 3. Review changes
git diff

# 4. Stage specific files (or all)
git add filename.js          # Specific file
git add .                    # All files
git add -u                   # All modified files

# 5. Commit
git commit -m "[EmailSystem] Description of changes"

# 6. Push to GitHub
git push origin main
```

## Handling Conflicts

If you have merge conflicts:

```bash
# 1. Identify conflicted files
git status

# 2. Edit conflicted files (marked with <<<, ===, >>>)

# 3. Stage resolved files
git add resolved-file.js

# 4. Commit merge
git commit -m "Resolve merge conflicts"

# 5. Push
git push origin main
```

## Syncing with GitHub

```bash
# Fetch latest changes from GitHub
git fetch origin

# Merge changes into local branch
git merge origin/main

# Or pull in one command (fetch + merge)
git pull origin main

# Rebase (alternative to merge)
git rebase origin/main
```

## Branching Strategy

### For Feature Development

```bash
# Create feature branch
git checkout -b feature/email-scheduler

# Make changes and commit
git commit -m "[Feature] Add email scheduler"

# Push to GitHub
git push origin feature/email-scheduler

# Create Pull Request on GitHub
# Review and merge to main
```

### Branch Naming Convention

```
feature/description    - New feature
bugfix/description     - Bug fix
hotfix/description     - Urgent production fix
docs/description       - Documentation
refactor/description   - Code refactoring
```

## Tagging Releases

```bash
# Create tag for version
git tag -a v1.0.0 -m "Email System v1.0.0"

# Push tags to GitHub
git push origin v1.0.0

# Or push all tags
git push origin --tags

# View all tags
git tag -l
```

## GitHub Actions Integration

### Automatic Deployment

The workflows in `.github/workflows/` automatically:

1. **Verify on every push/PR** (verify.yml):
   - Checks all files exist
   - Verifies configuration
   - Scans for exposed secrets

2. **Deploy on push to main** (deploy.yml):
   - Deploys Edge Functions to Supabase
   - Sets environment variables
   - Verifies deployment

### Monitor Workflows

```bash
# View workflow runs locally
gh run list

# View specific run
gh run view <run-id>

# Watch workflow in real-time
gh run watch
```

Or view on GitHub: Actions tab > Select workflow

## Troubleshooting

### Issue: "Permission denied" when pushing

**Solution:**
```bash
# Use HTTPS (doesn't require SSH key)
git remote set-url origin https://github.com/rmallillin-cpu/PSA-Ticketing-and-Scheduling.git

# Or set up SSH keys
# Follow: https://docs.github.com/en/authentication/connecting-to-github-with-ssh
```

### Issue: "Branch has diverged"

**Solution:**
```bash
# Rebase local changes on top of remote
git pull --rebase origin main

# Or merge
git pull origin main
```

### Issue: "Changes not showing on GitHub"

**Solution:**
```bash
# Verify push succeeded
git log origin/main

# Push again if needed
git push -u origin main
```

### Issue: "Accidentally committed file"

**Solution:**
```bash
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Or remove file from commit
git reset HEAD filename.txt
git checkout -- filename.txt

# Or undo last commit (discard changes)
git reset --hard HEAD~1
```

### Issue: ".env.local files committed accidentally"

**Solution:**
```bash
# Remove from history
git rm --cached .env.local

# Commit the removal
git commit -m "Remove .env.local from version control"

# Push
git push origin main

# Verify on GitHub (file should be gone)
```

## Secrets Management

### NEVER Commit These

- `.env.local` ❌
- API keys ❌
- Passwords ❌
- Secret tokens ❌
- SSH keys ❌

### Use GitHub Secrets Instead

For GitHub Actions to deploy:

1. Go to Repository Settings > Secrets > Actions
2. Add secrets:
   - `SUPABASE_PROJECT_ID`
   - `SUPABASE_ACCESS_TOKEN`
   - `SENDGRID_API_KEY`
3. Reference in workflows: `${{ secrets.SUPABASE_PROJECT_ID }}`

## Advanced: Accessing Repository

### Command Line

```bash
# Clone (download)
git clone https://github.com/rmallillin-cpu/PSA-Ticketing-and-Scheduling.git

# Pull updates
git pull

# Push changes
git push
```

### GitHub CLI

```bash
# Install: https://cli.github.com

# Clone
gh repo clone rmallillin-cpu/PSA-Ticketing-and-Scheduling

# View repo info
gh repo view

# Open in browser
gh repo view --web
```

### Web Interface

1. Go to https://github.com/rmallillin-cpu/PSA-Ticketing-and-Scheduling/
2. Click "Code" button
3. Click "Upload files" to upload manually
4. Click "Edit" to edit files online

## Deployment Checklist

Before pushing to production:

- [ ] All files committed locally
- [ ] No uncommitted changes (git status clean)
- [ ] .env.local is in .gitignore
- [ ] No API keys in code
- [ ] Tests pass (if applicable)
- [ ] Documentation updated
- [ ] Version number updated
- [ ] Ready to push

## Quick Reference Commands

```bash
# Essential commands
git status              # View current status
git add -A              # Stage all changes
git commit -m "msg"     # Commit changes
git push                # Push to GitHub
git pull                # Fetch and merge
git log                 # View history
git branch              # List branches
git checkout -b name    # Create branch
git tag -a v1.0 -m ""   # Create tag

# Useful commands
git diff                # View changes
git reset --soft HEAD~1 # Undo last commit
git revert HEAD         # Undo by creating new commit
git stash               # Temporarily save changes
git cherry-pick <hash>  # Apply specific commit
```

## Resources

- **Git Documentation**: https://git-scm.com/doc
- **GitHub Guides**: https://guides.github.com
- **GitHub CLI**: https://cli.github.com
- **Git Cheat Sheet**: https://github.github.com/training-kit/

## Next Steps

1. **Initial Push:**
   ```bash
   ./deploy.bat  # Windows
   # or
   ./deploy.sh   # macOS/Linux
   ```

2. **Ongoing Updates:**
   - Make changes
   - Run deploy script
   - Or use git commands manually

3. **Monitor:**
   - Check GitHub for commits
   - Check Actions for deployments
   - Check Supabase for live functions

---

**Your repository is ready for deployment!** 🚀

For questions, see GitHub documentation or ask for help in Issues tab.

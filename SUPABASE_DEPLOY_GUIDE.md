# Supabase Deployment Guide

This guide explains how to deploy the email management system to Supabase.

## Prerequisites

1. **Supabase CLI** installed:
   ```bash
   npm install -g supabase
   ```

2. **Supabase Access Token** (for automated deployments):
   - Go to https://app.supabase.com/account/tokens
   - Create a new token with access to your project
   - Save it securely

3. **Environment variables** set in `.env.local`:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-key
   SENDGRID_API_KEY=your-sendgrid-key
   ```

## Deployment Methods

### Method 1: Automated Deployment Script (Windows)

**Easiest option for Windows users**

```bash
# Simply run:
.\deploy.bat
```

This will:
- Check prerequisites
- Stage and commit changes to GitHub
- Push to GitHub
- Deploy Edge Functions to Supabase
- Verify deployment

### Method 2: Automated Deployment Script (macOS/Linux)

```bash
# Make script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

### Method 3: Manual Supabase CLI Commands

If you prefer more control, use these commands directly:

#### Deploy Edge Functions

```bash
# Get your project ID (from .env.local or Supabase Dashboard)
export SUPABASE_PROJECT_ID="your-project-id"

# Deploy send-email function
supabase functions deploy send-email --project-id $SUPABASE_PROJECT_ID

# Deploy retry-failed-email function
supabase functions deploy retry-failed-email --project-id $SUPABASE_PROJECT_ID
```

#### Push Database Migrations

```bash
# Push to your Supabase project
supabase db push --project-id $SUPABASE_PROJECT_ID

# View changes before pushing (dry-run)
supabase db push --project-id $SUPABASE_PROJECT_ID --dry-run
```

#### View Function Logs

```bash
# View logs for send-email function
supabase functions logs send-email --project-id $SUPABASE_PROJECT_ID

# Follow logs in real-time
supabase functions logs send-email --project-id $SUPABASE_PROJECT_ID --follow
```

#### List Deployed Functions

```bash
supabase functions list --project-id $SUPABASE_PROJECT_ID
```

### Method 4: GitHub Actions (Automatic on Push)

**Prerequisites:**

1. **Add GitHub Secrets** to your repository:
   - Go to Settings > Secrets and Variables > Actions
   - Add these secrets:
     - `SUPABASE_PROJECT_ID` - Your Supabase project ID
     - `SUPABASE_ACCESS_TOKEN` - Your Supabase access token
     - `SENDGRID_API_KEY` - Your SendGrid API key

2. **Workflow Configuration:**
   - The `.github/workflows/deploy.yml` file is already set up
   - It automatically deploys when you push to `main` or `master` branch
   - Only triggers on changes to `supabase/` directory

3. **How it works:**
   - Push changes to GitHub
   - GitHub Actions runs automatically
   - Edge Functions are deployed to Supabase
   - Deployment status appears in GitHub Actions tab

4. **Monitor Deployment:**
   - Go to your GitHub repo
   - Click "Actions" tab
   - Click latest workflow run
   - View deployment logs

## Setting Environment Variables for Edge Functions

Edge Functions need environment variables for SendGrid API key.

### In Supabase Dashboard:

1. Go to Edge Functions > Settings
2. Click "Secrets"
3. Add these secrets:
   - Name: `SENDGRID_API_KEY`
   - Value: Your SendGrid API key

4. Add Service Role Key (optional, for advanced features):
   - Name: `SUPABASE_SERVICE_ROLE_KEY`
   - Value: Your Supabase service role key

### Via Supabase CLI:

```bash
# Set secret for current project
supabase secrets set SENDGRID_API_KEY="your-sendgrid-key"
supabase secrets set SUPABASE_SERVICE_ROLE_KEY="your-service-key"

# If you want to use Gmail SMTP instead of Resend or SendGrid, set these secrets:
supabase secrets set EMAIL_PROVIDER="gmail"
supabase secrets set GMAIL_SMTP_USER="your-gmail-email@example.com"
supabase secrets set GMAIL_SMTP_PASS="your-app-password-or-smtp-password"
# Optional SMTP host/port if you need a custom provider:
supabase secrets set GMAIL_SMTP_HOST="smtp.gmail.com"
supabase secrets set GMAIL_SMTP_PORT="587"

# List all secrets
supabase secrets list

# Remove a secret
supabase secrets unset SENDGRID_API_KEY
```

## Testing Deployment

### Test send-email Function

```bash
# Using curl
curl -X POST https://your-project.supabase.co/functions/v1/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "recipientEmail": "test@example.com",
    "recipientName": "Test User",
    "subject": "Test Email",
    "body": "This is a test email",
    "senderEmail": "admin@yourdomain.com",
    "senderName": "Admin"
  }'
```

### Check Function Logs

```bash
# View recent logs
supabase functions logs send-email --project-id your-project-id --tail 50

# Watch logs in real-time
supabase functions logs send-email --project-id your-project-id --follow
```

## Troubleshooting

### Issue: "Function not found"

**Solution:**
```bash
# List all functions
supabase functions list --project-id your-project-id

# If functions are missing, redeploy:
supabase functions deploy send-email --project-id your-project-id
supabase functions deploy retry-failed-email --project-id your-project-id
```

### Issue: "SENDGRID_API_KEY not configured"

**Solution:**
```bash
# Set the secret
supabase secrets set SENDGRID_API_KEY="your-key"

# Verify it's set
supabase secrets list
```

### Issue: "Invalid access token"

**Solution:**
```bash
# Login to Supabase
supabase login

# Or set token directly
export SUPABASE_ACCESS_TOKEN="your-token"
```

### Issue: "Database migration failed"

**Solution:**
1. Check migration syntax in `supabase/migrations/*.sql`
2. View detailed error:
   ```bash
   supabase db push --project-id your-project-id --dry-run
   ```
3. Run migrations in Supabase Dashboard SQL Editor manually

## Deployment Checklist

Before deploying to production:

- [ ] Environment variables configured (.env.local)
- [ ] Supabase project created and accessible
- [ ] SendGrid account with API key
- [ ] GitHub repository set up
- [ ] GitHub Secrets configured (for GitHub Actions)
- [ ] Database migrations tested locally
- [ ] Edge Functions tested locally
- [ ] All files committed to GitHub
- [ ] Deployment script runs successfully

## CI/CD Pipeline Overview

The GitHub Actions workflows provide:

1. **Automatic Verification** (on every push/PR):
   - Checks all required files exist
   - Verifies configuration
   - Scans for exposed secrets
   - Validates documentation

2. **Automatic Deployment** (on push to main):
   - Deploys Edge Functions
   - Sets environment variables
   - Verifies deployment success

3. **Manual Rollback**:
   - Redeploy previous versions
   - Use `supabase functions deploy` with specific commit

## Next Steps

1. **First Deployment:**
   - Run `deploy.bat` (Windows) or `deploy.sh` (macOS/Linux)
   - Or manually run commands above

2. **Ongoing Deployments:**
   - Use GitHub Actions (automatic)
   - Or use deployment script
   - Or use manual CLI commands

3. **Monitoring:**
   - Check GitHub Actions for deployment status
   - View Edge Function logs in Supabase Dashboard
   - Monitor Supabase database status

4. **Updates:**
   - Make changes locally
   - Commit to GitHub
   - GitHub Actions automatically deploys
   - Or manually run deployment script

## Support

For issues:
1. Check logs in Supabase Dashboard
2. Review GitHub Actions workflow logs
3. Check browser console for frontend errors
4. Contact Supabase support if needed

---

**Happy deploying!** 🚀

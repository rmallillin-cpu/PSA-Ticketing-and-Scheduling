# Email Management System - Complete Setup Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Supabase Setup](#supabase-setup)
3. [SendGrid Configuration](#sendgrid-configuration)
4. [Environment Variables](#environment-variables)
5. [Database Migration](#database-migration)
6. [Edge Functions Deployment](#edge-functions-deployment)
7. [Frontend Integration](#frontend-integration)
8. [Authentication Setup](#authentication-setup)
9. [Testing](#testing)
10. [Deployment](#deployment)
11. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Tools
- Node.js 16+ and npm
- Supabase CLI (`npm install -g supabase`)
- Git (for version control)
- A text editor (VS Code recommended)

### Required Accounts
- Supabase account (https://supabase.com)
- SendGrid account (https://sendgrid.com)
- Optional: Vercel for deployment (https://vercel.com)

---

## Supabase Setup

### Step 1: Create Supabase Project

1. Go to https://app.supabase.com
2. Click "New Project"
3. Enter project details:
   - Name: "email-management-system"
   - Database password: Generate strong password (save it!)
   - Region: Choose closest to your location
4. Click "Create new project"
5. Wait for project to initialize (2-3 minutes)

### Step 2: Get Credentials

1. Go to project Settings > API
2. Copy the following:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **Anon Key** → `VITE_SUPABASE_ANON_KEY`
   - **Service Role Key** → `SUPABASE_SERVICE_ROLE_KEY`

### Step 3: Enable Authentication

1. Go to Authentication > Providers
2. Ensure Email is enabled (it's default)
3. Go to Authentication > URL Configuration
4. Set your app's URL:
   - Site URL: `http://localhost:3000` (for local development)
   - Or your production domain

### Step 4: Create Admin User

1. Go to Authentication > Users
2. Click "Invite"
3. Enter your email address
4. Click "Send invite"
5. Check email for invite link
6. Set password when invited

---

## SendGrid Configuration

### Step 1: Create SendGrid Account

1. Go to https://sendgrid.com
2. Click "Get Started For Free"
3. Complete signup process
4. Verify your email

### Step 2: Generate API Key

1. Go to Settings > API Keys
2. Click "Create API Key"
3. Give it a name: "Email Management System"
4. Select "Full Access" or specific permissions:
   - Mail Send: Full Access
   - Sender Verification: Full Access
5. Click "Create & Copy"
6. Save the key immediately (you won't see it again!)
7. Set as `SENDGRID_API_KEY` in environment variables

### Step 3: Verify Sender Email

1. Go to Settings > Sender Authentication
2. Click "Verify a Sender"
3. Enter sender email and details
4. Complete verification process
5. Add other sender identities as needed

### Step 4: Enable Event Webhooks (Optional)

1. Go to Settings > Mail Send
2. Click "Event Notification"
3. Add webhook URL (for delivery tracking):
   - `https://your-domain.com/api/webhooks/sendgrid`
4. Select events to track:
   - Delivery
   - Bounce
   - Open
   - Click

---

## Environment Variables

### Step 1: Create .env.local

```bash
# In project root directory
cp .env.example .env.local
```

### Step 2: Fill in Credentials

Edit `.env.local` with your actual values:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...your-key...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your-service-key...
SENDGRID_API_KEY=SG.your-api-key...
```

### Step 3: Add to .gitignore

Ensure `.env.local` is in `.gitignore`:

```bash
# In .gitignore
.env.local
.env.*.local
```

---

## Database Migration

### Step 1: Apply Schema

Option A: Using Supabase Dashboard

1. Go to SQL Editor in Supabase Dashboard
2. Click "New Query"
3. Open file: `supabase/migrations/20260424_email_management_system.sql`
4. Copy and paste the entire content
5. Click "Run"
6. Verify tables are created in Table Editor

Option B: Using Supabase CLI

```bash
# Start Supabase locally (development)
supabase start

# Apply migrations to remote project
supabase db push --project-id your-project-id
```

### Step 2: Apply RLS Policies

1. Go to SQL Editor in Supabase Dashboard
2. Click "New Query"
3. Open file: `supabase/migrations/20260424_rls_policies.sql`
4. Copy and paste the entire content
5. Click "Run"

### Step 3: Verify Database

1. Go to Table Editor
2. Verify these tables exist:
   - contacts
   - email_templates
   - email_logs
   - senders
   - email_campaigns
   - campaign_recipients
   - contact_groups
   - contact_group_members

3. Check sample data:
   - Click "senders" table
   - Verify 3 default senders are present

---

## Edge Functions Deployment

### Step 1: Install Supabase CLI

```bash
npm install -g supabase
```

### Step 2: Deploy Edge Functions

```bash
# Navigate to project root
cd "c:\PSA Ticketing and Schedule Web Portal"

# Deploy send-email function
supabase functions deploy send-email \
  --project-id your-project-id

# Deploy retry-failed-email function
supabase functions deploy retry-failed-email \
  --project-id your-project-id
```

### Step 3: Set Environment Variables for Functions

In Supabase Dashboard:

1. Go to Edge Functions > Settings
2. Add these secrets:
   - `SENDGRID_API_KEY`: Your SendGrid API key
   - `SUPABASE_SERVICE_ROLE_KEY`: Your service role key

### Step 4: Verify Functions

1. Go to Edge Functions in Dashboard
2. Click each function
3. Go to "Logs" tab
4. Test the function (should see logs)

---

## Frontend Integration

### Step 1: Add Supabase Library

Add to `email-dashboard.html` if not already there:

```html
<!-- In <head> section -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js"></script>
```

### Step 2: Copy Frontend Files

Ensure these files are in your project:
- `email-dashboard.html`
- `email-dashboard.css`
- `config.js`
- `supabase-client.js`
- `api-service.js`
- `email-composer.js`
- `email-dashboard.js`

### Step 3: Update HTML Head

In `email-dashboard.html`, update the head:

```html
<link rel="stylesheet" href="styles.css">
<link rel="stylesheet" href="email-dashboard.css">
```

### Step 4: Test Locally

```bash
# Start a local web server
# Option 1: Python
python -m http.server 8000

# Option 2: Node.js (http-server)
npx http-server

# Option 3: VS Code Live Server
# Install "Live Server" extension, then right-click index.html > "Open with Live Server"
```

Access at: `http://localhost:8000/email-dashboard.html`

---

## Authentication Setup

### Step 1: Create Login Page

If not already created, ensure `login.html` exists with:
- Email input field
- Password input field
- Login button
- Sign up link

### Step 2: Configure Redirects

In Supabase Dashboard:

1. Authentication > URL Configuration
2. Add redirect URLs:
   - `http://localhost:3000/email-dashboard.html` (local)
   - `https://yourdomain.com/email-dashboard.html` (production)

### Step 3: Enable RLS Policies

Verify RLS is enabled in your database:

```sql
-- Check RLS status
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

All should show `t` (true) for rowsecurity.

---

## Testing

### Step 1: Test Contact Management

1. Login to dashboard
2. Click "Add Contact"
3. Fill in form:
   - Name: "Test User"
   - Email: "test@example.com"
   - Tags: "Test"
4. Click "Save Contact"
5. Verify contact appears in list

### Step 2: Test Email Composition

1. Create a template:
   - Go to Templates tab
   - Click "New Template"
   - Fill in details
   - Click "Save Template"

2. Compose email:
   - Select template
   - Fill in subject and body
   - Use placeholders: {{name}}, {{email}}, {{sender}}
   - Select sender
   - Click "Preview"

### Step 3: Test Sending (Mock)

Note: This requires SendGrid to be configured with verified sender.

```javascript
// Test in browser console
const testEmail = {
  recipientEmail: 'your-test-email@example.com',
  recipientName: 'Test',
  subject: 'Test Email',
  body: 'This is a test email',
  senderEmail: 'admin@yourdomain.com',
  senderName: 'Admin'
};

// Send via API
const response = await fetch(
  'https://your-project.supabase.co/functions/v1/send-email',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + supabaseClient.auth.session().access_token
    },
    body: JSON.stringify(testEmail)
  }
);

console.log(await response.json());
```

### Step 4: Check Email Logs

1. Go to Logs tab
2. Filter by status
3. Verify sent emails appear with status "sent"

---

## Deployment

### Option 1: Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Add environment variables in Vercel Dashboard:
# - VITE_SUPABASE_URL
# - VITE_SUPABASE_ANON_KEY
# - (Note: SUPABASE_SERVICE_ROLE_KEY should NOT be exposed in frontend)
```

### Option 2: Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy

# Configure in netlify.toml:
[build]
  command = "echo 'Static site'"
  publish = "."

[context.production.environment]
  VITE_SUPABASE_URL = "your-url"
  VITE_SUPABASE_ANON_KEY = "your-key"
```

### Option 3: Deploy to Traditional Server

```bash
# Copy files to server
scp -r * user@server:/var/www/email-system/

# Ensure web server (Apache/Nginx) is configured
# Set CORS headers if needed
```

---

## Troubleshooting

### Issue: "Cannot find Supabase library"

**Solution:**
```html
<!-- Add to HTML head -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js"></script>
```

### Issue: "Authentication failed"

**Solution:**
1. Check email is verified in Supabase
2. Verify password is correct
3. Check URL Configuration redirects
4. Check browser console for errors

### Issue: "SendGrid API key invalid"

**Solution:**
1. Verify API key is correct
2. Check API key hasn't been regenerated
3. Verify API key has Mail Send permission
4. Check SENDGRID_API_KEY is set in Edge Function secrets

### Issue: "Edge Function not found"

**Solution:**
```bash
# Redeploy functions
supabase functions deploy send-email --project-id your-project-id
supabase functions deploy retry-failed-email --project-id your-project-id

# Check function logs
supabase functions logs send-email --project-id your-project-id
```

### Issue: "Email not sending"

**Checklist:**
1. Verify sender email is verified in SendGrid
2. Check email logs for error message
3. Verify recipient email is valid
4. Check SendGrid dashboard for bounces
5. Check browser console for JavaScript errors
6. Verify Edge Function environment variables

### Issue: "CORS Error"

**Solution:**
1. Check CORS headers in Edge Functions
2. Verify `corsHeaders` is in response
3. Check browser network tab for actual error
4. Verify `Access-Control-Allow-Origin` header

### Issue: "RLS Policy Denies Access"

**Solution:**
1. Verify user is authenticated
2. Check RLS policies are correct
3. Verify Edge Functions use service role key
4. Check policy conditions match your data

### Useful Debug Commands

```bash
# Check Supabase project status
supabase status --project-id your-project-id

# View function logs
supabase functions logs send-email --project-id your-project-id --follow

# Test API endpoint locally
curl -X POST http://localhost:54321/functions/v1/send-email \
  -H "Content-Type: application/json" \
  -d '{"recipientEmail":"test@example.com",...}'

# Check database
supabase db push --project-id your-project-id --dry-run
```

---

## Next Steps

1. **Customize Senders:** Edit senders in database or admin panel
2. **Create Templates:** Build email templates for your use cases
3. **Segment Contacts:** Use tags to organize contacts by category
4. **Enable Scheduling:** Implement scheduled email sending (feature flag available)
5. **Set up Tracking:** Enable SendGrid webhooks for delivery tracking
6. **Add Analytics:** Create dashboard for email performance metrics
7. **Implement Campaigns:** Use campaign features for bulk sends
8. **Auto Backups:** Set up database backups in Supabase settings

---

## Additional Resources

- **Supabase Docs:** https://supabase.com/docs
- **SendGrid Docs:** https://sendgrid.com/docs
- **Deno Docs:** https://deno.land/manual
- **JavaScript Fetch API:** https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API

---

## Support

For issues or questions:
1. Check the Troubleshooting section above
2. Review browser console for errors
3. Check Supabase and SendGrid dashboards for service status
4. Contact Supabase support or SendGrid support as needed

---

**Last Updated:** April 24, 2026
**Version:** 1.0.0

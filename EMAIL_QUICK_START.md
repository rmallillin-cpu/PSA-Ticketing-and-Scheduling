# Email Management System - Quick Start Guide

Get the email system running in 5 minutes!

## Prerequisites
- Supabase account (free tier works)
- SendGrid account (free tier works)
- Node.js 16+ installed
- A modern web browser

## Step 1: Get Credentials (2 min)

### Supabase
1. Go to https://app.supabase.com
2. Create new project
3. Go to Settings > API
4. Copy **Project URL** and **Anon Key**

### SendGrid
1. Go to https://sendgrid.com
2. Sign up and verify email
3. Go to Settings > API Keys
4. Create new key
5. Copy the API key

## Step 2: Create .env.local (1 min)

In project root directory, create `.env.local`:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...your-key...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your-service-key...
SENDGRID_API_KEY=SG.your-api-key...
```

Get the Service Role Key:
1. Supabase Dashboard > Settings > API
2. Scroll to "service_role" (hidden by default)
3. Click "Reveal" to show it

## Step 3: Setup Database (1 min)

1. Go to Supabase Dashboard
2. Click "SQL Editor"
3. Create new query
4. Open `supabase/migrations/20260424_email_management_system.sql`
5. Copy ALL content
6. Paste into Supabase SQL Editor
7. Click "Run"

Then run the RLS policies:
1. Create another query
2. Open `supabase/migrations/20260424_rls_policies.sql`
3. Copy ALL content
4. Paste and run

## Step 4: Deploy Edge Functions (1 min)

```bash
# Install Supabase CLI
npm install -g supabase

# Deploy send-email function
supabase functions deploy send-email --project-id your-project-id

# Deploy retry-failed-email function
supabase functions deploy retry-failed-email --project-id your-project-id
```

Get project ID:
- Supabase Dashboard > Settings > General > Project ID

## Step 5: Run Locally (1 min)

Choose one option:

**Option A: Python (built-in)**
```bash
cd "c:\PSA Ticketing and Schedule Web Portal"
python -m http.server 8000
```

**Option B: Node.js**
```bash
npx http-server
```

**Option C: VS Code Live Server**
- Install "Live Server" extension
- Right-click `email-dashboard.html`
- Select "Open with Live Server"

## Step 6: Access Dashboard

Open browser:
```
http://localhost:8000/email-dashboard.html
```

## Create Test Account

1. Go to Supabase Dashboard
2. Authentication > Users
3. Click "Invite"
4. Enter your email
5. Check email for invite link
6. Set password

## First Test

1. Login with your email
2. Add a contact:
   - Click "+ Add Contact"
   - Name: "John Doe"
   - Email: "john@example.com"
   - Save

3. Create a template:
   - Go to Templates tab
   - Click "+ New Template"
   - Title: "Welcome"
   - Subject: "Welcome {{name}}!"
   - Body: "Hello {{name}}, thanks for joining!"
   - Save

4. Send email:
   - Select contact checkbox
   - Select sender
   - Select template
   - Click "Send to Selected"
   - Check Logs tab for results

## Verify SendGrid

Check if email was actually sent:
1. Go to SendGrid Dashboard
2. Email Activity > All Mail
3. Should see your test email

## Environment Setup for Production

For deployment (Vercel, Netlify, etc.):

1. Set environment variables in platform settings:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

2. Edge Functions use their own secrets:
   - Go to Supabase Functions in Dashboard
   - Click "Settings"
   - Add secrets:
     - `SENDGRID_API_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY`

## Troubleshooting

### "Cannot find module"
- Ensure Supabase script is in HTML head:
  ```html
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js"></script>
  ```

### "Authentication failed"
- Check email is verified in Supabase
- Check password is correct
- Check browser console for errors

### "Email not sending"
- Verify SendGrid API key is correct
- Verify sender email is verified in SendGrid
- Check browser Network tab for Edge Function errors

### "Database error"
- Verify all SQL migrations ran successfully
- Check Supabase Table Editor for tables
- Verify data is inserted (click table > data)

## Next Steps

After confirming it works:

1. **Customize Senders:**
   - Go to Database > Table Editor
   - Click "senders" table
   - Edit default senders or add new ones

2. **Import Contacts:**
   - Create contacts manually or
   - Write script to import from CSV

3. **Create Templates:**
   - Build email templates for your use cases
   - Test placeholders work correctly

4. **Deploy to Production:**
   - See `EMAIL_SETUP_GUIDE.md` for deployment options

## Support

If stuck:
1. Check browser console: `F12` > Console tab
2. Check Supabase logs: Dashboard > Settings > Logs
3. Check SendGrid logs: SendGrid Dashboard > Email Activity
4. Review `EMAIL_SETUP_GUIDE.md` troubleshooting section

## Files Overview

| File | Purpose |
|------|---------|
| `email-dashboard.html` | UI layout |
| `email-dashboard.css` | Styling |
| `config.js` | Configuration |
| `supabase-client.js` | Supabase connection |
| `api-service.js` | Database operations |
| `email-composer.js` | Email logic |
| `email-dashboard.js` | Main app logic |

## Database Tables

| Table | Purpose |
|-------|---------|
| `contacts` | Email recipients |
| `senders` | From addresses |
| `email_templates` | Reusable email formats |
| `email_logs` | Send history |
| `email_campaigns` | Bulk send campaigns |

## Free Tier Limits

**Supabase Free:**
- 500 MB storage
- Unlimited API calls
- Good enough for small businesses

**SendGrid Free:**
- 100 emails/day
- Unlimited contacts
- Enough for testing

Upgrade anytime as you grow!

---

**Ready to go!** 🚀

Questions? See `EMAIL_SETUP_GUIDE.md` for detailed setup and troubleshooting.

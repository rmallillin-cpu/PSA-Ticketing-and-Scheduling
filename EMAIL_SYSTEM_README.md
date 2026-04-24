# Email Management System

A comprehensive, production-ready email management system built with HTML, CSS, JavaScript, and Supabase. Send personalized emails to multiple recipients with templates, sender management, and full email logging.

## Features

### Core Features
✅ **Contact Management**
- Add, edit, delete, and search contacts
- Tag contacts for easy filtering and segmentation
- Store contact metadata (phone, company, notes)
- Bulk selection with "Select All" functionality

✅ **Email Composer**
- Rich email composition with subject and body
- Real-time email preview with personalization
- Template-based email creation
- Support for dynamic placeholders: `{{name}}`, `{{email}}`, `{{sender}}`

✅ **Sender Management**
- Multiple sender identities
- Sender email and display name configuration
- Flexible sender selection per email

✅ **Email Templates**
- Create reusable email templates
- Template preview before sending
- Edit and delete templates
- Auto-extract variables from template body

✅ **Email Sending**
- Send individual personalized emails (no bulk CC)
- SendGrid integration via Edge Functions
- Automatic email logging with status tracking
- Real-time progress indicator during sending

✅ **Email Logs & Tracking**
- Complete email history with timestamps
- Status tracking: Sent, Failed, Pending
- Error messages for failed emails
- Filter logs by status and recipient

✅ **Retry System**
- Automatic retry logic for failed emails
- Manual retry button for failed emails
- Configurable retry limits and delays

✅ **Authentication**
- Supabase authentication (email + password)
- User session management
- Secure logout functionality

### Bonus Features
🎯 **Advanced Functionality**
- Contact tagging and filtering
- Email campaign tracking (database ready)
- Contact grouping (database ready)
- Row-level security (RLS) for data protection
- Responsive design for mobile and desktop
- Toast notifications for user feedback

## Project Structure

```
email-management-system/
├── email-dashboard.html          # Main dashboard UI
├── email-dashboard.css           # Dashboard styling
├── email-dashboard.js            # Dashboard logic & UI controller
├── config.js                     # Configuration & environment
├── supabase-client.js            # Supabase client initialization
├── api-service.js                # Database API layer
├── email-composer.js             # Email composition & sending logic
│
├── supabase/
│   ├── migrations/
│   │   ├── 20260424_email_management_system.sql  # Database schema
│   │   └── 20260424_rls_policies.sql             # Security policies
│   └── functions/
│       ├── send-email/
│       │   └── index.ts          # Send single email via SendGrid
│       ├── retry-failed-email/
│       │   └── index.ts          # Retry failed emails
│       └── _shared/
│           └── cors.ts           # Shared CORS headers
│
├── .env.example                  # Environment variables template
└── EMAIL_SETUP_GUIDE.md         # Comprehensive setup guide
```

## Database Schema

### tables

**contacts**
- id (UUID, PK)
- name (TEXT)
- email (TEXT, UNIQUE)
- tags (TEXT[])
- phone (TEXT)
- company (TEXT)
- notes (TEXT)
- is_active (BOOLEAN)
- created_at, updated_at (TIMESTAMP)

**senders**
- id (UUID, PK)
- name (TEXT)
- email (TEXT, UNIQUE)
- display_name (TEXT)
- is_active (BOOLEAN)
- created_at, updated_at (TIMESTAMP)

**email_templates**
- id (UUID, PK)
- title (TEXT)
- subject (TEXT)
- body (TEXT)
- description (TEXT)
- variables (TEXT[])
- created_by (UUID, FK)
- is_active (BOOLEAN)
- created_at, updated_at (TIMESTAMP)

**email_logs**
- id (UUID, PK)
- recipient_email (TEXT)
- recipient_name (TEXT)
- subject (TEXT)
- message_body (TEXT)
- sender_email (TEXT)
- sender_name (TEXT)
- status (TEXT: sent/failed/pending)
- error_message (TEXT)
- template_id (UUID, FK)
- sent_at (TIMESTAMP)
- created_at, updated_at (TIMESTAMP)
- retry_count (INTEGER)
- last_retry_at (TIMESTAMP)

**email_campaigns**
- id (UUID, PK)
- name (TEXT)
- description (TEXT)
- template_id (UUID, FK)
- sender_id (UUID, FK)
- total_recipients (INTEGER)
- sent_count, failed_count (INTEGER)
- status (TEXT: draft/scheduled/sending/completed/cancelled)
- scheduled_at, started_at, completed_at (TIMESTAMP)
- created_by (UUID, FK)
- created_at, updated_at (TIMESTAMP)

**campaign_recipients**
- id (UUID, PK)
- campaign_id (UUID, FK)
- contact_id (UUID, FK)
- email_log_id (UUID, FK)
- created_at (TIMESTAMP)

**contact_groups**
- id (UUID, PK)
- name (TEXT)
- description (TEXT)
- created_by (UUID, FK)
- created_at, updated_at (TIMESTAMP)

**contact_group_members**
- id (UUID, PK)
- group_id (UUID, FK)
- contact_id (UUID, FK)
- created_at (TIMESTAMP)

## API Methods

### ApiService Class

```javascript
// Contacts
ApiService.getContacts(filters)
ApiService.getContact(contactId)
ApiService.createContact(contactData)
ApiService.updateContact(contactId, contactData)
ApiService.deleteContact(contactId)
ApiService.getAllTags()

// Senders
ApiService.getSenders()
ApiService.getSender(senderId)
ApiService.createSender(senderData)

// Templates
ApiService.getTemplates()
ApiService.getTemplate(templateId)
ApiService.createTemplate(templateData)
ApiService.updateTemplate(templateId, templateData)
ApiService.deleteTemplate(templateId)

// Email Logs
ApiService.getEmailLogs(filters)
ApiService.createEmailLog(logData)
ApiService.updateEmailLog(logId, status, errorMessage)
ApiService.getFailedEmails()

// Campaigns
ApiService.getCampaigns()
ApiService.createCampaign(campaignData)
```

### EmailComposer Class

```javascript
// Text processing
EmailComposer.replacePlaceholders(text, data)
EmailComposer.personalizeEmail(emailTemplate, recipient, sender)
EmailComposer.extractVariables(template)

// Validation
EmailComposer.validateEmailConfig(config)
EmailComposer.isValidEmail(email)

// Formatting
EmailComposer.formatEmailForDisplay(email)
EmailComposer.calculateBatches(totalRecipients, batchSize)
EmailComposer.prepareEmailsForSending(config)
```

### EmailService Class

```javascript
// Sending
EmailService.sendEmail(email)
EmailService.sendBulkEmails(emails, onProgress)
EmailService.retryFailedEmails(onProgress)
```

## Email Personalization

### Placeholder Variables

Supported placeholders in email templates:

```
{{name}}           - Recipient's name
{{email}}          - Recipient's email address
{{sender}}         - Sender's display name
{{senderName}}     - Sender's name
{{senderEmail}}    - Sender's email address
{{company}}        - Recipient's company
{{phone}}          - Recipient's phone number
```

### Example Template

```
Subject: Welcome {{name}}!

Hello {{name}},

Welcome to our service! We're excited to have {{company}} on board.

Best regards,
{{sender}}
{{senderEmail}}
```

## Configuration

### Environment Variables

Create `.env.local` file:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
SENDGRID_API_KEY=SG...
```

### Application Config

Edit `config.js`:

```javascript
CONFIG.app = {
  maxRecipientsPerBatch: 50,
  maxRetries: 3,
  retryDelayMs: 1000,
  requestTimeoutMs: 30000,
};

CONFIG.features = {
  enableTemplates: true,
  enableCampaigns: true,
  enableContactGroups: true,
  enableScheduledSending: false,
};
```

## Security

### Row-Level Security (RLS)

- All tables protected with RLS policies
- Authenticated users can only access their own data
- Edge Functions use service role key to bypass RLS
- Policies restrict insert/update/delete operations

### API Key Management

- `VITE_SUPABASE_ANON_KEY` safe to expose in frontend
- `SUPABASE_SERVICE_ROLE_KEY` kept secret in Edge Functions
- `SENDGRID_API_KEY` never exposed in frontend
- All sensitive keys stored in environment variables

### CORS Configuration

- Edge Functions allow requests from configured origins
- CORS headers properly set on all responses
- No wildcard CORS in production (should be restricted to domain)

## Usage

### 1. Dashboard Access

Navigate to `email-dashboard.html`:
```
http://localhost:3000/email-dashboard.html
```

### 2. Add Contacts

1. Click "Add Contact"
2. Fill in contact details
3. Click "Save Contact"

### 3. Create Email Template

1. Go to Templates tab
2. Click "New Template"
3. Enter title, subject, body
4. Click "Save Template"

### 4. Send Email

1. Select contacts with checkboxes
2. Select sender from dropdown
3. Select template or write custom email
4. Click "Preview" to check personalization
5. Click "Send to Selected"
6. Monitor progress in status bar

### 5. View Logs

1. Go to Logs tab
2. Filter by status if needed
3. Click "Retry Failed" to resend failed emails

## Limitations & Future Enhancements

### Current Limitations
- No scheduled sending (feature flag available)
- No auto-reply functionality
- Single email sending only (individual, not bulk CC)
- Maximum 50 recipients per batch (configurable)
- SMTP support not yet implemented

### Planned Enhancements
- [ ] Scheduled email sending
- [ ] Email automation triggers
- [ ] Advanced analytics dashboard
- [ ] Unsubscribe link management
- [ ] SMTP provider support
- [ ] Email signature management
- [ ] A/B testing for templates
- [ ] Delivery rate tracking
- [ ] Bounce handling
- [ ] Attachment support
- [ ] Rich HTML editor for templates
- [ ] Multi-language support

## Troubleshooting

### Email not sending?
1. Check SendGrid credentials
2. Verify sender email is verified in SendGrid
3. Check browser console for errors
4. View Supabase Edge Function logs

### Contacts not loading?
1. Check Supabase connection
2. Verify authentication
3. Check RLS policies
4. Check browser network tab

### Placeholders not replacing?
1. Verify placeholder format: `{{variableName}}`
2. Check contact data has required fields
3. Verify template body has correct spelling

See `EMAIL_SETUP_GUIDE.md` for comprehensive troubleshooting.

## Performance Tips

1. **Batch Sending:** Adjust `maxRecipientsPerBatch` in config
2. **Retry Delays:** Increase `retryDelayMs` to avoid rate limiting
3. **Timeout:** Adjust `requestTimeoutMs` for slower networks
4. **Caching:** Browser caches contacts/templates automatically
5. **Database:** Create indexes on `email_logs.created_at` for large volumes

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

MIT License - Feel free to modify and distribute

## Support & Documentation

- **Setup Guide:** `EMAIL_SETUP_GUIDE.md`
- **Supabase Docs:** https://supabase.com/docs
- **SendGrid Docs:** https://sendgrid.com/docs
- **Email Standards:** https://www.rfc-editor.org/rfc/rfc5322

---

**Version:** 1.0.0  
**Last Updated:** April 24, 2026  
**Status:** Production Ready ✅

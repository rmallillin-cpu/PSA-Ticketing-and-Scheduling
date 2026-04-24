-- Email Management System Schema
-- Created: 2026-04-24

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- TABLE: senders
-- Stores email sender identities for the organization
CREATE TABLE IF NOT EXISTS senders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    display_name TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLE: contacts
-- Stores contact directory with tags for filtering
CREATE TABLE IF NOT EXISTS contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    tags TEXT[] DEFAULT '{}',
    phone TEXT,
    company TEXT,
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_tags ON contacts USING GIN(tags);

-- TABLE: email_templates
-- Stores reusable email templates with placeholders
CREATE TABLE IF NOT EXISTS email_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    description TEXT,
    variables TEXT[] DEFAULT '{}',
    created_by UUID REFERENCES auth.users(id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLE: email_logs
-- Stores history of all sent emails for tracking and auditing
CREATE TABLE IF NOT EXISTS email_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipient_email TEXT NOT NULL,
    recipient_name TEXT,
    subject TEXT NOT NULL,
    message_body TEXT,
    sender_email TEXT NOT NULL,
    sender_name TEXT,
    status TEXT CHECK (status IN ('pending', 'sent', 'failed')) DEFAULT 'pending',
    error_message TEXT,
    template_id UUID REFERENCES email_templates(id) ON DELETE SET NULL,
    sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    retry_count INTEGER DEFAULT 0,
    last_retry_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for email logs
CREATE INDEX IF NOT EXISTS idx_email_logs_recipient ON email_logs(recipient_email);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_sent_at ON email_logs(sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_email_logs_created_at ON email_logs(created_at DESC);

-- TABLE: email_campaigns
-- Optional: Track grouped email sends (campaigns)
CREATE TABLE IF NOT EXISTS email_campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    template_id UUID REFERENCES email_templates(id) ON DELETE SET NULL,
    sender_id UUID REFERENCES senders(id) ON DELETE SET NULL,
    total_recipients INTEGER DEFAULT 0,
    sent_count INTEGER DEFAULT 0,
    failed_count INTEGER DEFAULT 0,
    status TEXT CHECK (status IN ('draft', 'scheduled', 'sending', 'completed', 'cancelled')) DEFAULT 'draft',
    scheduled_at TIMESTAMP WITH TIME ZONE,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLE: campaign_recipients
-- Links emails sent in campaigns to contacts
CREATE TABLE IF NOT EXISTS campaign_recipients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID NOT NULL REFERENCES email_campaigns(id) ON DELETE CASCADE,
    contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    email_log_id UUID REFERENCES email_logs(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for campaign recipients
CREATE INDEX IF NOT EXISTS idx_campaign_recipients_campaign ON campaign_recipients(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_recipients_contact ON campaign_recipients(contact_id);

-- TABLE: contact_groups
-- Optional: Organize contacts into groups
CREATE TABLE IF NOT EXISTS contact_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLE: contact_group_members
-- Map contacts to groups
CREATE TABLE IF NOT EXISTS contact_group_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID NOT NULL REFERENCES contact_groups(id) ON DELETE CASCADE,
    contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(group_id, contact_id)
);

-- Insert default senders
INSERT INTO senders (name, email, display_name) VALUES
    ('Admin', 'admin@yourdomain.com', 'Admin Team'),
    ('Support', 'support@yourdomain.com', 'Support Team'),
    ('Booking Manager', 'bookings@yourdomain.com', 'Booking Manager')
ON CONFLICT (email) DO NOTHING;

-- Insert sample contacts
INSERT INTO contacts (name, email, tags) VALUES
    ('John Doe', 'john@example.com', '{"VIP", "Active"}'),
    ('Jane Smith', 'jane@example.com', '{"Regular"}'),
    ('Bob Johnson', 'bob@example.com', '{"VIP", "Inactive"}')
ON CONFLICT (email) DO NOTHING;

-- Insert sample templates
INSERT INTO email_templates (title, subject, body, variables) VALUES
    ('Welcome Email', 'Welcome to Our Service', 
     'Hello {{name}},\n\nWelcome to our service! We are excited to have you on board.\n\nBest regards,\n{{sender}}',
     ARRAY['name', 'sender']),
    ('Follow-up Email', 'Follow-up: Your Recent Inquiry',
     'Hi {{name}},\n\nThank you for reaching out. We wanted to follow up on your inquiry.\n\nBest regards,\n{{sender}}',
     ARRAY['name', 'sender']),
    ('Booking Confirmation', 'Your Booking is Confirmed',
     'Hello {{name}},\n\nYour booking has been confirmed. We look forward to working with you.\n\nBest regards,\n{{sender}} at {{email}}',
     ARRAY['name', 'sender', 'email'])
ON CONFLICT DO NOTHING;

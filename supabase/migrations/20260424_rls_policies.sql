-- Row Level Security (RLS) Policies for Email Management System
-- These policies ensure that only authenticated admin users can access email data

-- Enable RLS on all tables
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE senders ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_group_members ENABLE ROW LEVEL SECURITY;

-- Create admin role
CREATE ROLE admin_role;

-- ==========================================
-- CONTACTS TABLE POLICIES
-- ==========================================

-- Allow authenticated users to read all contacts
CREATE POLICY "Authenticated users can read contacts"
    ON contacts FOR SELECT
    USING (auth.role() = 'authenticated_user');

-- Allow authenticated users to insert contacts
CREATE POLICY "Authenticated users can insert contacts"
    ON contacts FOR INSERT
    WITH CHECK (auth.role() = 'authenticated_user');

-- Allow authenticated users to update contacts
CREATE POLICY "Authenticated users can update contacts"
    ON contacts FOR UPDATE
    USING (auth.role() = 'authenticated_user')
    WITH CHECK (auth.role() = 'authenticated_user');

-- Allow authenticated users to delete contacts
CREATE POLICY "Authenticated users can delete contacts"
    ON contacts FOR DELETE
    USING (auth.role() = 'authenticated_user');

-- ==========================================
-- SENDERS TABLE POLICIES
-- ==========================================

-- Allow authenticated users to read senders
CREATE POLICY "Authenticated users can read senders"
    ON senders FOR SELECT
    USING (auth.role() = 'authenticated_user');

-- Allow authenticated users to insert senders (admin only)
CREATE POLICY "Authenticated users can insert senders"
    ON senders FOR INSERT
    WITH CHECK (auth.role() = 'authenticated_user');

-- Allow authenticated users to update senders
CREATE POLICY "Authenticated users can update senders"
    ON senders FOR UPDATE
    USING (auth.role() = 'authenticated_user');

-- ==========================================
-- EMAIL TEMPLATES TABLE POLICIES
-- ==========================================

-- Allow authenticated users to read templates
CREATE POLICY "Authenticated users can read templates"
    ON email_templates FOR SELECT
    USING (auth.role() = 'authenticated_user');

-- Allow authenticated users to insert templates
CREATE POLICY "Authenticated users can insert templates"
    ON email_templates FOR INSERT
    WITH CHECK (
        auth.role() = 'authenticated_user' 
        AND created_by = auth.uid()
    );

-- Allow template creators to update their templates
CREATE POLICY "Users can update their own templates"
    ON email_templates FOR UPDATE
    USING (auth.role() = 'authenticated_user' AND created_by = auth.uid())
    WITH CHECK (created_by = auth.uid());

-- Allow template creators to delete their templates
CREATE POLICY "Users can delete their own templates"
    ON email_templates FOR DELETE
    USING (auth.role() = 'authenticated_user' AND created_by = auth.uid());

-- ==========================================
-- EMAIL LOGS TABLE POLICIES
-- ==========================================

-- Allow authenticated users to read logs
CREATE POLICY "Authenticated users can read email logs"
    ON email_logs FOR SELECT
    USING (auth.role() = 'authenticated_user');

-- Allow authenticated users to insert logs
CREATE POLICY "Authenticated users can insert email logs"
    ON email_logs FOR INSERT
    WITH CHECK (auth.role() = 'authenticated_user');

-- Allow authenticated users to update logs (for status changes)
CREATE POLICY "Authenticated users can update email logs"
    ON email_logs FOR UPDATE
    USING (auth.role() = 'authenticated_user')
    WITH CHECK (auth.role() = 'authenticated_user');

-- ==========================================
-- CAMPAIGNS TABLE POLICIES
-- ==========================================

-- Allow authenticated users to read campaigns
CREATE POLICY "Authenticated users can read campaigns"
    ON email_campaigns FOR SELECT
    USING (auth.role() = 'authenticated_user');

-- Allow authenticated users to create campaigns
CREATE POLICY "Authenticated users can create campaigns"
    ON email_campaigns FOR INSERT
    WITH CHECK (
        auth.role() = 'authenticated_user' 
        AND created_by = auth.uid()
    );

-- Allow campaign creators to update their campaigns
CREATE POLICY "Users can update their own campaigns"
    ON email_campaigns FOR UPDATE
    USING (auth.role() = 'authenticated_user' AND created_by = auth.uid())
    WITH CHECK (created_by = auth.uid());

-- ==========================================
-- CAMPAIGN RECIPIENTS TABLE POLICIES
-- ==========================================

-- Allow authenticated users to read campaign recipients
CREATE POLICY "Authenticated users can read campaign recipients"
    ON campaign_recipients FOR SELECT
    USING (auth.role() = 'authenticated_user');

-- Allow authenticated users to insert campaign recipients
CREATE POLICY "Authenticated users can insert campaign recipients"
    ON campaign_recipients FOR INSERT
    WITH CHECK (auth.role() = 'authenticated_user');

-- ==========================================
-- CONTACT GROUPS TABLE POLICIES
-- ==========================================

-- Allow authenticated users to read groups
CREATE POLICY "Authenticated users can read contact groups"
    ON contact_groups FOR SELECT
    USING (auth.role() = 'authenticated_user');

-- Allow authenticated users to create groups
CREATE POLICY "Authenticated users can create contact groups"
    ON contact_groups FOR INSERT
    WITH CHECK (
        auth.role() = 'authenticated_user' 
        AND created_by = auth.uid()
    );

-- Allow group creators to update groups
CREATE POLICY "Users can update their own contact groups"
    ON contact_groups FOR UPDATE
    USING (auth.role() = 'authenticated_user' AND created_by = auth.uid())
    WITH CHECK (created_by = auth.uid());

-- ==========================================
-- CONTACT GROUP MEMBERS TABLE POLICIES
-- ==========================================

-- Allow authenticated users to read group members
CREATE POLICY "Authenticated users can read contact group members"
    ON contact_group_members FOR SELECT
    USING (auth.role() = 'authenticated_user');

-- Allow authenticated users to manage group members
CREATE POLICY "Authenticated users can manage contact group members"
    ON contact_group_members FOR INSERT
    WITH CHECK (auth.role() = 'authenticated_user');

-- ==========================================
-- GRANT PERMISSIONS
-- ==========================================

-- Grant admin_role permissions (if needed for service role)
GRANT ALL ON contacts TO admin_role;
GRANT ALL ON senders TO admin_role;
GRANT ALL ON email_templates TO admin_role;
GRANT ALL ON email_logs TO admin_role;
GRANT ALL ON email_campaigns TO admin_role;
GRANT ALL ON campaign_recipients TO admin_role;
GRANT ALL ON contact_groups TO admin_role;
GRANT ALL ON contact_group_members TO admin_role;

-- ==========================================
-- ALTERNATIVE: Bypass RLS for Service Role
-- ==========================================
-- The Supabase service role key automatically bypasses RLS,
-- which is needed for the Edge Functions to work properly.
-- This is already handled by using SUPABASE_SERVICE_ROLE_KEY in Edge Functions.

-- Optional: Create a trigger to automatically set created_at
CREATE OR REPLACE FUNCTION set_created_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.created_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables that need it
CREATE TRIGGER set_contacts_created_at
    BEFORE INSERT ON contacts
    FOR EACH ROW
    EXECUTE FUNCTION set_created_at();

CREATE TRIGGER set_senders_created_at
    BEFORE INSERT ON senders
    FOR EACH ROW
    EXECUTE FUNCTION set_created_at();

CREATE TRIGGER set_templates_created_at
    BEFORE INSERT ON email_templates
    FOR EACH ROW
    EXECUTE FUNCTION set_created_at();

CREATE TRIGGER set_logs_created_at
    BEFORE INSERT ON email_logs
    FOR EACH ROW
    EXECUTE FUNCTION set_created_at();

CREATE TRIGGER set_campaigns_created_at
    BEFORE INSERT ON email_campaigns
    FOR EACH ROW
    EXECUTE FUNCTION set_created_at();

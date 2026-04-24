-- Safe corrective migration for RLS policies
-- Fixes invalid auth role literal ('authenticated_user' -> 'authenticated')
-- and makes role/trigger creation idempotent.

-- Ensure RLS is enabled
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.senders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_group_members ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'admin_role') THEN
    CREATE ROLE admin_role;
  END IF;
END$$;

-- CONTACTS
DROP POLICY IF EXISTS "Authenticated users can read contacts" ON public.contacts;
DROP POLICY IF EXISTS "Authenticated users can insert contacts" ON public.contacts;
DROP POLICY IF EXISTS "Authenticated users can update contacts" ON public.contacts;
DROP POLICY IF EXISTS "Authenticated users can delete contacts" ON public.contacts;

CREATE POLICY "Authenticated users can read contacts"
  ON public.contacts FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert contacts"
  ON public.contacts FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update contacts"
  ON public.contacts FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete contacts"
  ON public.contacts FOR DELETE
  USING (auth.role() = 'authenticated');

-- SENDERS
DROP POLICY IF EXISTS "Authenticated users can read senders" ON public.senders;
DROP POLICY IF EXISTS "Authenticated users can insert senders" ON public.senders;
DROP POLICY IF EXISTS "Authenticated users can update senders" ON public.senders;

CREATE POLICY "Authenticated users can read senders"
  ON public.senders FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert senders"
  ON public.senders FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update senders"
  ON public.senders FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- EMAIL TEMPLATES
DROP POLICY IF EXISTS "Authenticated users can read templates" ON public.email_templates;
DROP POLICY IF EXISTS "Authenticated users can insert templates" ON public.email_templates;
DROP POLICY IF EXISTS "Users can update their own templates" ON public.email_templates;
DROP POLICY IF EXISTS "Users can delete their own templates" ON public.email_templates;

CREATE POLICY "Authenticated users can read templates"
  ON public.email_templates FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert templates"
  ON public.email_templates FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND created_by = auth.uid());

CREATE POLICY "Users can update their own templates"
  ON public.email_templates FOR UPDATE
  USING (auth.role() = 'authenticated' AND created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can delete their own templates"
  ON public.email_templates FOR DELETE
  USING (auth.role() = 'authenticated' AND created_by = auth.uid());

-- EMAIL LOGS
DROP POLICY IF EXISTS "Authenticated users can read email logs" ON public.email_logs;
DROP POLICY IF EXISTS "Authenticated users can insert email logs" ON public.email_logs;
DROP POLICY IF EXISTS "Authenticated users can update email logs" ON public.email_logs;

CREATE POLICY "Authenticated users can read email logs"
  ON public.email_logs FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert email logs"
  ON public.email_logs FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update email logs"
  ON public.email_logs FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- CAMPAIGNS
DROP POLICY IF EXISTS "Authenticated users can read campaigns" ON public.email_campaigns;
DROP POLICY IF EXISTS "Authenticated users can create campaigns" ON public.email_campaigns;
DROP POLICY IF EXISTS "Users can update their own campaigns" ON public.email_campaigns;

CREATE POLICY "Authenticated users can read campaigns"
  ON public.email_campaigns FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can create campaigns"
  ON public.email_campaigns FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND created_by = auth.uid());

CREATE POLICY "Users can update their own campaigns"
  ON public.email_campaigns FOR UPDATE
  USING (auth.role() = 'authenticated' AND created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

-- CAMPAIGN RECIPIENTS
DROP POLICY IF EXISTS "Authenticated users can read campaign recipients" ON public.campaign_recipients;
DROP POLICY IF EXISTS "Authenticated users can insert campaign recipients" ON public.campaign_recipients;

CREATE POLICY "Authenticated users can read campaign recipients"
  ON public.campaign_recipients FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert campaign recipients"
  ON public.campaign_recipients FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- CONTACT GROUPS
DROP POLICY IF EXISTS "Authenticated users can read contact groups" ON public.contact_groups;
DROP POLICY IF EXISTS "Authenticated users can create contact groups" ON public.contact_groups;
DROP POLICY IF EXISTS "Users can update their own contact groups" ON public.contact_groups;

CREATE POLICY "Authenticated users can read contact groups"
  ON public.contact_groups FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can create contact groups"
  ON public.contact_groups FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND created_by = auth.uid());

CREATE POLICY "Users can update their own contact groups"
  ON public.contact_groups FOR UPDATE
  USING (auth.role() = 'authenticated' AND created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

-- CONTACT GROUP MEMBERS
DROP POLICY IF EXISTS "Authenticated users can read contact group members" ON public.contact_group_members;
DROP POLICY IF EXISTS "Authenticated users can manage contact group members" ON public.contact_group_members;

CREATE POLICY "Authenticated users can read contact group members"
  ON public.contact_group_members FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage contact group members"
  ON public.contact_group_members FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Grants
GRANT ALL ON public.contacts TO admin_role;
GRANT ALL ON public.senders TO admin_role;
GRANT ALL ON public.email_templates TO admin_role;
GRANT ALL ON public.email_logs TO admin_role;
GRANT ALL ON public.email_campaigns TO admin_role;
GRANT ALL ON public.campaign_recipients TO admin_role;
GRANT ALL ON public.contact_groups TO admin_role;
GRANT ALL ON public.contact_group_members TO admin_role;

-- Trigger function
CREATE OR REPLACE FUNCTION public.set_created_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.created_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_contacts_created_at ON public.contacts;
DROP TRIGGER IF EXISTS set_senders_created_at ON public.senders;
DROP TRIGGER IF EXISTS set_templates_created_at ON public.email_templates;
DROP TRIGGER IF EXISTS set_logs_created_at ON public.email_logs;
DROP TRIGGER IF EXISTS set_campaigns_created_at ON public.email_campaigns;

CREATE TRIGGER set_contacts_created_at
  BEFORE INSERT ON public.contacts
  FOR EACH ROW
  EXECUTE FUNCTION public.set_created_at();

CREATE TRIGGER set_senders_created_at
  BEFORE INSERT ON public.senders
  FOR EACH ROW
  EXECUTE FUNCTION public.set_created_at();

CREATE TRIGGER set_templates_created_at
  BEFORE INSERT ON public.email_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.set_created_at();

CREATE TRIGGER set_logs_created_at
  BEFORE INSERT ON public.email_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.set_created_at();

CREATE TRIGGER set_campaigns_created_at
  BEFORE INSERT ON public.email_campaigns
  FOR EACH ROW
  EXECUTE FUNCTION public.set_created_at();

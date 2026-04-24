/**
 * API Service Layer
 * Handles all database operations through Supabase
 */

class ApiService {
    /**
     * CONTACTS API
     */

    /**
     * Fetch all contacts
     */
    static async getContacts(filters = {}) {
        return await queryDatabase(async (client) => {
            let query = client
                .from('contacts')
                .select('*')
                .eq('is_active', true)
                .order('created_at', { ascending: false });

            // Apply filters
            if (filters.tag) {
                query = query.contains('tags', [filters.tag]);
            }
            if (filters.search) {
                query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
            }

            const { data, error } = await query;
            if (error) throw error;
            return data;
        });
    }

    /**
     * Get single contact
     */
    static async getContact(contactId) {
        return await queryDatabase(async (client) => {
            const { data, error } = await client
                .from('contacts')
                .select('*')
                .eq('id', contactId)
                .single();

            if (error) throw error;
            return data;
        });
    }

    /**
     * Create new contact
     */
    static async createContact(contactData) {
        return await queryDatabase(async (client) => {
            const { data, error } = await client
                .from('contacts')
                .insert([{
                    name: contactData.name,
                    email: contactData.email,
                    tags: contactData.tags || [],
                    phone: contactData.phone || null,
                    company: contactData.company || null,
                    notes: contactData.notes || null,
                }])
                .select()
                .single();

            if (error) throw error;
            return data;
        });
    }

    /**
     * Update contact
     */
    static async updateContact(contactId, contactData) {
        return await queryDatabase(async (client) => {
            const { data, error } = await client
                .from('contacts')
                .update({
                    name: contactData.name,
                    email: contactData.email,
                    tags: contactData.tags || [],
                    phone: contactData.phone || null,
                    company: contactData.company || null,
                    notes: contactData.notes || null,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', contactId)
                .select()
                .single();

            if (error) throw error;
            return data;
        });
    }

    /**
     * Delete contact
     */
    static async deleteContact(contactId) {
        return await queryDatabase(async (client) => {
            const { data, error } = await client
                .from('contacts')
                .update({ is_active: false })
                .eq('id', contactId);

            if (error) throw error;
            return data;
        });
    }

    /**
     * Get all unique tags
     */
    static async getAllTags() {
        return await queryDatabase(async (client) => {
            const { data, error } = await client
                .from('contacts')
                .select('tags')
                .eq('is_active', true);

            if (error) throw error;

            // Flatten tags array and get unique values
            const allTags = new Set();
            data.forEach(contact => {
                if (contact.tags && Array.isArray(contact.tags)) {
                    contact.tags.forEach(tag => allTags.add(tag));
                }
            });

            return Array.from(allTags).sort();
        });
    }

    /**
     * SENDERS API
     */

    /**
     * Get all senders
     */
    static async getSenders() {
        return await queryDatabase(async (client) => {
            const { data, error } = await client
                .from('senders')
                .select('*')
                .eq('is_active', true)
                .order('created_at', { ascending: true });

            if (error) throw error;
            return data;
        });
    }

    /**
     * Get single sender
     */
    static async getSender(senderId) {
        return await queryDatabase(async (client) => {
            const { data, error } = await client
                .from('senders')
                .select('*')
                .eq('id', senderId)
                .single();

            if (error) throw error;
            return data;
        });
    }

    /**
     * Create new sender
     */
    static async createSender(senderData) {
        return await queryDatabase(async (client) => {
            const { data, error } = await client
                .from('senders')
                .insert([{
                    name: senderData.name,
                    email: senderData.email,
                    display_name: senderData.displayName || senderData.name,
                }])
                .select()
                .single();

            if (error) throw error;
            return data;
        });
    }

    /**
     * EMAIL TEMPLATES API
     */

    /**
     * Get all templates
     */
    static async getTemplates() {
        return await queryDatabase(async (client) => {
            const { data, error } = await client
                .from('email_templates')
                .select('*')
                .eq('is_active', true)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data;
        });
    }

    /**
     * Get single template
     */
    static async getTemplate(templateId) {
        return await queryDatabase(async (client) => {
            const { data, error } = await client
                .from('email_templates')
                .select('*')
                .eq('id', templateId)
                .single();

            if (error) throw error;
            return data;
        });
    }

    /**
     * Create new template
     */
    static async createTemplate(templateData) {
        return await queryDatabase(async (client) => {
            // Extract variables from body
            const variableRegex = /\{\{(\w+)\}\}/g;
            const variables = [];
            let match;
            while ((match = variableRegex.exec(templateData.body)) !== null) {
                if (!variables.includes(match[1])) {
                    variables.push(match[1]);
                }
            }

            const { data, error } = await client
                .from('email_templates')
                .insert([{
                    title: templateData.title,
                    subject: templateData.subject,
                    body: templateData.body,
                    description: templateData.description || '',
                    variables: variables,
                    created_by: (await getCurrentUser())?.id,
                }])
                .select()
                .single();

            if (error) throw error;
            return data;
        });
    }

    /**
     * Update template
     */
    static async updateTemplate(templateId, templateData) {
        return await queryDatabase(async (client) => {
            const { data, error } = await client
                .from('email_templates')
                .update({
                    title: templateData.title,
                    subject: templateData.subject,
                    body: templateData.body,
                    description: templateData.description || '',
                    updated_at: new Date().toISOString(),
                })
                .eq('id', templateId)
                .select()
                .single();

            if (error) throw error;
            return data;
        });
    }

    /**
     * Delete template
     */
    static async deleteTemplate(templateId) {
        return await queryDatabase(async (client) => {
            const { data, error } = await client
                .from('email_templates')
                .update({ is_active: false })
                .eq('id', templateId);

            if (error) throw error;
            return data;
        });
    }

    /**
     * EMAIL LOGS API
     */

    /**
     * Get email logs with filters
     */
    static async getEmailLogs(filters = {}) {
        return await queryDatabase(async (client) => {
            let query = client
                .from('email_logs')
                .select('*')
                .order('created_at', { ascending: false });

            // Apply filters
            if (filters.status) {
                query = query.eq('status', filters.status);
            }
            if (filters.recipientEmail) {
                query = query.eq('recipient_email', filters.recipientEmail);
            }
            if (filters.limit) {
                query = query.limit(filters.limit);
            }

            const { data, error } = await query;
            if (error) throw error;
            return data;
        });
    }

    /**
     * Create email log entry
     */
    static async createEmailLog(logData) {
        return await queryDatabase(async (client) => {
            const { data, error } = await client
                .from('email_logs')
                .insert([{
                    recipient_email: logData.recipientEmail,
                    recipient_name: logData.recipientName,
                    subject: logData.subject,
                    message_body: logData.messageBody,
                    sender_email: logData.senderEmail,
                    sender_name: logData.senderName,
                    status: logData.status || 'pending',
                    template_id: logData.templateId || null,
                }])
                .select()
                .single();

            if (error) throw error;
            return data;
        });
    }

    /**
     * Update email log (mark as sent/failed)
     */
    static async updateEmailLog(logId, status, errorMessage = null) {
        return await queryDatabase(async (client) => {
            const updateData = {
                status: status,
                updated_at: new Date().toISOString(),
            };

            if (status === 'sent') {
                updateData.sent_at = new Date().toISOString();
            }

            if (errorMessage) {
                updateData.error_message = errorMessage;
            }

            const { data, error } = await client
                .from('email_logs')
                .update(updateData)
                .eq('id', logId)
                .select()
                .single();

            if (error) throw error;
            return data;
        });
    }

    /**
     * Retry failed emails
     */
    static async getFailedEmails() {
        return await queryDatabase(async (client) => {
            const { data, error } = await client
                .from('email_logs')
                .select('*')
                .eq('status', 'failed')
                .lt('retry_count', CONFIG.app.maxRetries)
                .order('created_at', { ascending: true });

            if (error) throw error;
            return data;
        });
    }

    /**
     * CAMPAIGNS API (Optional)
     */

    /**
     * Get all campaigns
     */
    static async getCampaigns() {
        return await queryDatabase(async (client) => {
            const { data, error } = await client
                .from('email_campaigns')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data;
        });
    }

    /**
     * Create campaign
     */
    static async createCampaign(campaignData) {
        return await queryDatabase(async (client) => {
            const { data, error } = await client
                .from('email_campaigns')
                .insert([{
                    name: campaignData.name,
                    description: campaignData.description || '',
                    template_id: campaignData.templateId || null,
                    sender_id: campaignData.senderId || null,
                    total_recipients: campaignData.totalRecipients || 0,
                    status: 'draft',
                    created_by: (await getCurrentUser())?.id,
                }])
                .select()
                .single();

            if (error) throw error;
            return data;
        });
    }
}

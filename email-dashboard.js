/**
 * Email Dashboard - Main Application Logic
 * Controls the UI and coordinates between components
 */

class EmailDashboard {
    constructor() {
        this.contacts = [];
        this.selectedContacts = new Set();
        this.senders = [];
        this.templates = [];
        this.currentSender = null;
        this.currentTemplate = null;
        this.editingContactId = null;
        this.portalUser = null;
        this.supabaseUser = null;
    }

    /**
     * Initialize the dashboard
     */
    async init() {
        console.log('🚀 Initializing Email Dashboard...');

        try {
            await initSupabase();

            // Check authentication
            this.portalUser = this.getPortalUserFromStorage();
            const isAuth = await isAuthenticated().catch(() => false);
            this.supabaseUser = isAuth ? await getCurrentUser().catch(() => null) : null;

            if (!this.supabaseUser && this.portalUser) {
                this.supabaseUser = await this.ensureSupabaseAuthFromPortalUser(this.portalUser);
            }

            if (!this.portalUser && !this.supabaseUser) {
                this.redirectToLogin();
                return;
            }

            this.hydrateSidebar();
            document.getElementById('user-email').textContent =
                this.supabaseUser?.email || this.portalUser?.email || 'Portal User';

            if (!this.supabaseUser) {
                this.setupEventListeners();
                this.showToast('Supabase authentication failed. Email data tabs are unavailable for this account.', 'error');
                return;
            }

            // Load initial data
            await Promise.all([
                this.loadContacts(),
                this.loadSenders(),
                this.loadTemplates(),
            ]);

            // Setup event listeners
            this.setupEventListeners();

            // Load email logs
            await this.loadEmailLogs();

            console.log('✅ Email Dashboard initialized');
        } catch (error) {
            console.error('Error initializing dashboard:', error);
            this.showToast('Error initializing dashboard: ' + error.message, 'error');
        }
    }

    /**
     * Setup event listeners for UI elements
     */
    setupEventListeners() {
        // Contact selection
        document.getElementById('select-all-contacts').addEventListener('change', (e) => {
            this.toggleSelectAll(e.target.checked);
        });

        // Contact search and filter
        document.getElementById('contact-search').addEventListener('input', (e) => {
            this.filterContacts(e.target.value);
        });

        document.getElementById('tag-filter').addEventListener('change', (e) => {
            this.filterByTag(e.target.value);
        });

        // Add contact button
        document.getElementById('add-contact-btn').addEventListener('click', () => {
            this.openContactModal();
        });

        // Contact modal buttons
        document.getElementById('save-contact-btn').addEventListener('click', () => {
            this.saveContact();
        });

        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Email composer
        document.getElementById('template-select').addEventListener('change', (e) => {
            this.loadTemplate(e.target.value);
        });

        document.getElementById('preview-btn').addEventListener('click', () => {
            this.previewEmail();
        });

        document.getElementById('send-email-btn').addEventListener('click', () => {
            this.sendEmails();
        });

        document.getElementById('clear-form-btn').addEventListener('click', () => {
            this.clearForm();
        });

        // Templates
        document.getElementById('new-template-btn').addEventListener('click', () => {
            this.openTemplateModal();
        });

        document.getElementById('save-template-btn').addEventListener('click', () => {
            this.saveTemplate();
        });

        // Email logs
        document.getElementById('log-status-filter').addEventListener('change', (e) => {
            this.filterEmailLogs(e.target.value);
        });

        document.getElementById('retry-failed-btn').addEventListener('click', () => {
            this.retryFailedEmails();
        });

        // Logout
        document.getElementById('logout-btn').addEventListener('click', () => {
            this.logout();
        });

        // Modal close buttons
        document.querySelectorAll('.close-btn, .close-modal-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.target.closest('.modal').classList.add('hidden');
            });
        });

        // Close modal on outside click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.add('hidden');
                }
            });
        });
    }

    /**
     * Load contacts from database
     */
    async loadContacts() {
        try {
            this.contacts = await ApiService.getContacts();
            this.renderContacts();

            // Load tags for filter
            const tags = await ApiService.getAllTags();
            this.populateTagFilter(tags);
        } catch (error) {
            console.error('Error loading contacts:', error);
            this.showToast('Error loading contacts: ' + error.message, 'error');
        }
    }

    /**
     * Load senders from database
     */
    async loadSenders() {
        try {
            this.senders = await ApiService.getSenders();
            this.populateSenderSelect();
        } catch (error) {
            console.error('Error loading senders:', error);
            this.showToast('Error loading senders: ' + error.message, 'error');
        }
    }

    /**
     * Load templates from database
     */
    async loadTemplates() {
        try {
            this.templates = await ApiService.getTemplates();
            this.populateTemplateSelect();
            this.renderTemplates();
        } catch (error) {
            console.error('Error loading templates:', error);
            this.showToast('Error loading templates: ' + error.message, 'error');
        }
    }

    /**
     * Load email logs from database
     */
    async loadEmailLogs() {
        try {
            const logs = await ApiService.getEmailLogs({ limit: 100 });
            this.renderEmailLogs(logs);
        } catch (error) {
            console.error('Error loading email logs:', error);
        }
    }

    /**
     * Render contacts list
     */
    renderContacts() {
        const container = document.getElementById('contacts-table');
        container.innerHTML = '';

        if (this.contacts.length === 0) {
            container.innerHTML = '<div class="text-center p-2"><p class="text-muted">No contacts found</p></div>';
            return;
        }

        this.contacts.forEach(contact => {
            const div = document.createElement('div');
            div.className = 'contact-item';
            if (this.selectedContacts.has(contact.id)) {
                div.classList.add('selected');
            }

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = this.selectedContacts.has(contact.id);
            checkbox.addEventListener('change', () => {
                this.toggleContactSelection(contact.id, checkbox.checked);
            });

            const info = document.createElement('div');
            info.className = 'contact-info';

            const name = document.createElement('div');
            name.className = 'contact-name';
            name.textContent = contact.name;

            const email = document.createElement('div');
            email.className = 'contact-email';
            email.textContent = contact.email;

            info.appendChild(name);
            info.appendChild(email);

            if (contact.tags && contact.tags.length > 0) {
                const tagsDiv = document.createElement('div');
                tagsDiv.className = 'contact-tags';
                contact.tags.forEach(tag => {
                    const tagSpan = document.createElement('span');
                    tagSpan.className = 'tag';
                    tagSpan.textContent = tag;
                    tagsDiv.appendChild(tagSpan);
                });
                info.appendChild(tagsDiv);
            }

            div.appendChild(checkbox);
            div.appendChild(info);
            container.appendChild(div);
        });

        this.updateSelectionCount();
    }

    /**
     * Toggle contact selection
     */
    toggleContactSelection(contactId, selected) {
        if (selected) {
            this.selectedContacts.add(contactId);
        } else {
            this.selectedContacts.delete(contactId);
        }

        this.renderContacts();
    }

    /**
     * Toggle select all contacts
     */
    toggleSelectAll(selectAll) {
        if (selectAll) {
            this.contacts.forEach(contact => {
                this.selectedContacts.add(contact.id);
            });
        } else {
            this.selectedContacts.clear();
        }

        this.renderContacts();
    }

    /**
     * Update selection count display
     */
    updateSelectionCount() {
        document.getElementById('selection-count').textContent = `${this.selectedContacts.size} selected`;
        document.getElementById('select-all-contacts').checked = 
            this.selectedContacts.size === this.contacts.length && this.contacts.length > 0;
    }

    /**
     * Filter contacts by search term
     */
    filterContacts(searchTerm) {
        // This would require filtering logic - for now, just re-render
        // In a real app, you'd debounce this and make a new API call
    }

    /**
     * Filter contacts by tag
     */
    filterByTag(tag) {
        if (!tag) {
            this.loadContacts();
        } else {
            // Filter logic would go here
            this.loadContacts();
        }
    }

    /**
     * Populate tag filter dropdown
     */
    populateTagFilter(tags) {
        const select = document.getElementById('tag-filter');
        tags.forEach(tag => {
            const option = document.createElement('option');
            option.value = tag;
            option.textContent = tag;
            select.appendChild(option);
        });
    }

    /**
     * Populate sender select dropdown
     */
    populateSenderSelect() {
        const select = document.getElementById('sender-select');
        select.innerHTML = '<option value="">Select sender...</option>';

        this.senders.forEach(sender => {
            const option = document.createElement('option');
            option.value = sender.id;
            option.textContent = `${sender.name} (${sender.email})`;
            select.appendChild(option);
        });

        select.addEventListener('change', (e) => {
            const senderId = e.target.value;
            this.currentSender = this.senders.find(s => s.id === senderId) || null;
        });
    }

    /**
     * Populate template select dropdown
     */
    populateTemplateSelect() {
        const select = document.getElementById('template-select');
        select.innerHTML = '<option value="">Custom Email</option>';

        this.templates.forEach(template => {
            const option = document.createElement('option');
            option.value = template.id;
            option.textContent = template.title;
            select.appendChild(option);
        });
    }

    /**
     * Load template into composer
     */
    async loadTemplate(templateId) {
        if (!templateId) {
            this.currentTemplate = null;
            return;
        }

        const template = this.templates.find(t => t.id === templateId);
        if (template) {
            this.currentTemplate = template;
            document.getElementById('email-subject').value = template.subject;
            document.getElementById('email-body').value = template.body;
        }
    }

    /**
     * Render templates list
     */
    renderTemplates() {
        const container = document.getElementById('templates-list');
        container.innerHTML = '';

        if (this.templates.length === 0) {
            container.innerHTML = '<div class="text-center p-2"><p class="text-muted">No templates yet</p></div>';
            return;
        }

        this.templates.forEach(template => {
            const card = document.createElement('div');
            card.className = 'template-card';

            const title = document.createElement('div');
            title.className = 'template-title';
            title.textContent = template.title;

            const subject = document.createElement('div');
            subject.className = 'template-subject';
            subject.textContent = `Subject: ${template.subject}`;

            const actions = document.createElement('div');
            actions.className = 'template-actions';

            const useBtn = document.createElement('button');
            useBtn.className = 'btn btn-primary btn-sm';
            useBtn.textContent = 'Use';
            useBtn.addEventListener('click', () => {
                document.getElementById('template-select').value = template.id;
                this.loadTemplate(template.id);
                this.switchTab('compose');
            });

            const editBtn = document.createElement('button');
            editBtn.className = 'btn btn-secondary btn-sm';
            editBtn.textContent = 'Edit';
            editBtn.addEventListener('click', () => {
                this.openTemplateModal(template);
            });

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn btn-danger btn-sm';
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => {
                this.deleteTemplate(template.id);
            });

            actions.appendChild(useBtn);
            actions.appendChild(editBtn);
            actions.appendChild(deleteBtn);

            card.appendChild(title);
            card.appendChild(subject);
            card.appendChild(actions);
            container.appendChild(card);
        });
    }

    /**
     * Render email logs table
     */
    renderEmailLogs(logs) {
        const container = document.getElementById('logs-table');
        container.innerHTML = '';

        if (logs.length === 0) {
            container.innerHTML = '<div class="text-center p-2"><p class="text-muted">No email logs</p></div>';
            return;
        }

        const table = document.createElement('table');
        table.className = 'table';

        // Header
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        headerRow.innerHTML = `
            <th>Recipient</th>
            <th>Subject</th>
            <th>Status</th>
            <th>Sent At</th>
            <th>Error</th>
        `;
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Body
        const tbody = document.createElement('tbody');
        logs.forEach(log => {
            const row = document.createElement('tr');
            const statusBadge = `<span class="status-badge status-${log.status}">${log.status}</span>`;
            const sentAt = log.sent_at ? new Date(log.sent_at).toLocaleString() : '-';
            const errorMsg = log.error_message ? `<small>${log.error_message}</small>` : '-';

            row.innerHTML = `
                <td><small>${log.recipient_email}</small></td>
                <td><small>${log.subject}</small></td>
                <td>${statusBadge}</td>
                <td><small>${sentAt}</small></td>
                <td><small>${errorMsg}</small></td>
            `;
            tbody.appendChild(row);
        });

        table.appendChild(tbody);
        container.appendChild(table);
    }

    /**
     * Filter email logs by status
     */
    async filterEmailLogs(status) {
        try {
            const logs = await ApiService.getEmailLogs({
                status: status || undefined,
                limit: 100,
            });
            this.renderEmailLogs(logs);
        } catch (error) {
            console.error('Error filtering logs:', error);
        }
    }

    /**
     * Preview email with first contact
     */
    previewEmail() {
        if (this.selectedContacts.size === 0) {
            this.showToast('Please select at least one contact', 'warning');
            return;
        }

        if (!this.currentSender) {
            this.showToast('Please select a sender', 'warning');
            return;
        }

        const subject = document.getElementById('email-subject').value;
        const body = document.getElementById('email-body').value;

        if (!subject || !body) {
            this.showToast('Please enter subject and message', 'warning');
            return;
        }

        // Get first selected contact
        const firstContactId = Array.from(this.selectedContacts)[0];
        const firstContact = this.contacts.find(c => c.id === firstContactId);

        const personalizedEmail = EmailComposer.personalizeEmail(
            { subject, body },
            firstContact,
            this.currentSender
        );

        const previewContent = document.getElementById('preview-content');
        previewContent.textContent = EmailComposer.formatEmailForDisplay(personalizedEmail);

        document.getElementById('preview-modal').classList.remove('hidden');
    }

    /**
     * Send emails to selected contacts
     */
    async sendEmails() {
        // Validate configuration
        const emailConfig = {
            recipients: this.contacts.filter(c => this.selectedContacts.has(c.id)),
            subject: document.getElementById('email-subject').value,
            body: document.getElementById('email-body').value,
            sender: this.currentSender,
            templateId: this.currentTemplate?.id,
        };

        const validation = EmailComposer.validateEmailConfig(emailConfig);
        if (!validation.isValid) {
            validation.errors.forEach(error => {
                this.showToast(error, 'error');
            });
            return;
        }

        // Prepare emails
        const emailsToSend = EmailComposer.prepareEmailsForSending(emailConfig);

        // Show progress
        document.getElementById('send-status').classList.remove('hidden');
        document.getElementById('send-email-btn').disabled = true;

        try {
            // Send emails
            const results = await EmailService.sendBulkEmails(emailsToSend, (progress) => {
                document.getElementById('status-progress').textContent =
                    `${progress.sent} sent, ${progress.failed} failed / ${progress.total} total`;
            });

            // Show results
            document.getElementById('status-message').textContent = 'Email sending completed!';
            document.getElementById('send-status').classList.add('success');

            this.showToast(
                `Sent: ${results.sent}, Failed: ${results.failed}`,
                results.failed === 0 ? 'success' : 'warning'
            );

            // Reload logs
            await this.loadEmailLogs();

            // Clear form
            setTimeout(() => {
                this.clearForm();
            }, 2000);
        } catch (error) {
            console.error('Error sending emails:', error);
            document.getElementById('status-message').textContent = 'Error sending emails';
            document.getElementById('send-status').classList.add('error');
            this.showToast('Error sending emails: ' + error.message, 'error');
        } finally {
            document.getElementById('send-email-btn').disabled = false;
            setTimeout(() => {
                document.getElementById('send-status').classList.add('hidden');
            }, 5000);
        }
    }

    /**
     * Retry failed emails
     */
    async retryFailedEmails() {
        if (!confirm('Retry all failed emails?')) {
            return;
        }

        document.getElementById('send-status').classList.remove('hidden');
        document.getElementById('retry-failed-btn').disabled = true;
        document.getElementById('status-message').textContent = 'Retrying failed emails...';

        try {
            const results = await EmailService.retryFailedEmails((progress) => {
                document.getElementById('status-progress').textContent =
                    `${progress.successful} successful, ${progress.failed} still failed / ${progress.retried} retried`;
            });

            document.getElementById('status-message').textContent = `Retried: ${results.successful} successful, ${results.stillFailed} failed`;
            document.getElementById('send-status').classList.add('success');

            this.showToast(
                `Retried: ${results.retried}, Successful: ${results.successful}`,
                results.stillFailed === 0 ? 'success' : 'warning'
            );

            await this.loadEmailLogs();
        } catch (error) {
            console.error('Error retrying emails:', error);
            document.getElementById('send-status').classList.add('error');
            this.showToast('Error retrying emails: ' + error.message, 'error');
        } finally {
            document.getElementById('retry-failed-btn').disabled = false;
            setTimeout(() => {
                document.getElementById('send-status').classList.add('hidden');
            }, 5000);
        }
    }

    /**
     * Clear email form
     */
    clearForm() {
        document.getElementById('email-subject').value = '';
        document.getElementById('email-body').value = '';
        document.getElementById('template-select').value = '';
        document.getElementById('sender-select').value = '';
        this.selectedContacts.clear();
        this.renderContacts();
    }

    /**
     * Open contact modal for adding/editing
     */
    openContactModal(contact = null) {
        if (contact) {
            this.editingContactId = contact.id;
            document.getElementById('modal-title').textContent = 'Edit Contact';
            document.getElementById('contact-name').value = contact.name;
            document.getElementById('contact-email').value = contact.email;
            document.getElementById('contact-phone').value = contact.phone || '';
            document.getElementById('contact-company').value = contact.company || '';
            document.getElementById('contact-tags').value = (contact.tags || []).join(', ');
        } else {
            this.editingContactId = null;
            document.getElementById('modal-title').textContent = 'Add Contact';
            document.getElementById('contact-name').value = '';
            document.getElementById('contact-email').value = '';
            document.getElementById('contact-phone').value = '';
            document.getElementById('contact-company').value = '';
            document.getElementById('contact-tags').value = '';
        }

        document.getElementById('contact-modal').classList.remove('hidden');
    }

    /**
     * Save contact
     */
    async saveContact() {
        const name = document.getElementById('contact-name').value.trim();
        const email = document.getElementById('contact-email').value.trim();
        const phone = document.getElementById('contact-phone').value.trim();
        const company = document.getElementById('contact-company').value.trim();
        const tags = document.getElementById('contact-tags').value
            .split(',')
            .map(t => t.trim())
            .filter(t => t);

        if (!name || !email) {
            this.showToast('Name and email are required', 'error');
            return;
        }

        if (!EmailComposer.isValidEmail(email)) {
            this.showToast('Invalid email address', 'error');
            return;
        }

        try {
            const contactData = { name, email, phone, company, tags };

            if (this.editingContactId) {
                await ApiService.updateContact(this.editingContactId, contactData);
                this.showToast('Contact updated successfully', 'success');
            } else {
                await ApiService.createContact(contactData);
                this.showToast('Contact added successfully', 'success');
            }

            document.getElementById('contact-modal').classList.add('hidden');
            await this.loadContacts();
        } catch (error) {
            console.error('Error saving contact:', error);
            this.showToast('Error saving contact: ' + error.message, 'error');
        }
    }

    /**
     * Open template modal
     */
    openTemplateModal(template = null) {
        if (template) {
            document.getElementById('template-title').value = template.title;
            document.getElementById('template-subject').value = template.subject;
            document.getElementById('template-body').value = template.body;
        } else {
            document.getElementById('template-title').value = '';
            document.getElementById('template-subject').value = '';
            document.getElementById('template-body').value = '';
        }

        document.getElementById('template-modal').classList.remove('hidden');
    }

    /**
     * Save template
     */
    async saveTemplate() {
        const title = document.getElementById('template-title').value.trim();
        const subject = document.getElementById('template-subject').value.trim();
        const body = document.getElementById('template-body').value.trim();

        if (!title || !subject || !body) {
            this.showToast('All fields are required', 'error');
            return;
        }

        try {
            await ApiService.createTemplate({ title, subject, body });
            this.showToast('Template saved successfully', 'success');
            document.getElementById('template-modal').classList.add('hidden');
            await this.loadTemplates();
        } catch (error) {
            console.error('Error saving template:', error);
            this.showToast('Error saving template: ' + error.message, 'error');
        }
    }

    /**
     * Delete template
     */
    async deleteTemplate(templateId) {
        if (!confirm('Delete this template?')) {
            return;
        }

        try {
            await ApiService.deleteTemplate(templateId);
            this.showToast('Template deleted', 'success');
            await this.loadTemplates();
        } catch (error) {
            console.error('Error deleting template:', error);
            this.showToast('Error deleting template: ' + error.message, 'error');
        }
    }

    /**
     * Switch tabs
     */
    switchTab(tabName) {
        // Deactivate all tabs and contents
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

        // Activate selected tab
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(`${tabName}-tab`).classList.add('active');
    }

    /**
     * Show toast notification
     */
    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;

        container.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 5000);
    }

    /**
     * Logout user
     */
    async logout() {
        try {
            localStorage.removeItem('psa_session');
            await signOut().catch(() => null);
            this.redirectToLogin();
        } catch (error) {
            console.error('Error logging out:', error);
            this.showToast('Error logging out: ' + error.message, 'error');
        }
    }

    /**
     * Redirect to login page
     */
    redirectToLogin() {
        window.location.href = 'login.html';
    }

    async ensureSupabaseAuthFromPortalUser(user) {
        try {
            const client = getSupabaseClient();
            const email = String(user?.email || '').trim().toLowerCase();
            const password = String(user?.password || '');
            if (!email || !password) return null;

            const { data: signInData, error: signInError } = await client.auth.signInWithPassword({
                email,
                password
            });

            if (!signInError && signInData?.user) {
                return signInData.user;
            }

            const { error: signUpError } = await client.auth.signUp({
                email,
                password
            });

            if (signUpError && !String(signUpError.message || '').toLowerCase().includes('already')) {
                return null;
            }

            const { data: retrySignInData, error: retrySignInError } = await client.auth.signInWithPassword({
                email,
                password
            });

            if (retrySignInError) return null;
            return retrySignInData?.user || null;
        } catch {
            return null;
        }
    }

    getPortalUserFromStorage() {
        try {
            const sessionRaw = localStorage.getItem('psa_session');
            const usersRaw = localStorage.getItem('psa_users');
            if (!sessionRaw || !usersRaw) return null;

            const session = JSON.parse(sessionRaw);
            const users = JSON.parse(usersRaw);
            if (!session?.userId || !Array.isArray(users)) return null;

            return users.find((u) => u.id === session.userId) || null;
        } catch {
            return null;
        }
    }

    hydrateSidebar() {
        const user = this.portalUser;
        if (!user) return;

        const welcomeEl = document.getElementById('welcomeText');
        const metaEl = document.getElementById('userMeta');
        const avatarEl = document.getElementById('announceAvatar');
        const adminLogsBtn = document.getElementById('openAdminLogsPanelBtn');
        const employeeListEl = document.getElementById('employeeNameList');
        const employeeSearchEl = document.getElementById('employeeSearchInput');
        const cloudSyncEl = document.getElementById('cloudSyncStatus');
        const timeInEl = document.getElementById('timeInStatus');

        if (welcomeEl) {
            welcomeEl.textContent = `Welcome, ${user.fullname || user.username || 'User'}`;
        }
        if (metaEl) {
            const role = (user.role || 'user').toLowerCase();
            metaEl.textContent = `${user.employeeCode || '-'} | ${user.department || '-'} | ${user.position || '-'} | ${role}`;
        }
        if (avatarEl && user.profilePicture) {
            avatarEl.src = user.profilePicture;
        }
        if (adminLogsBtn) {
            const isAdmin = (user.role || '').toLowerCase() === 'admin';
            adminLogsBtn.classList.toggle('hidden', !isAdmin);
        }
        if (cloudSyncEl) {
            cloudSyncEl.textContent = 'Cloud sync: connected';
        }
        if (timeInEl) {
            timeInEl.textContent = '';
        }

        if (employeeListEl) {
            const renderUsers = (searchText = '') => {
                let users = [];
                try {
                    users = JSON.parse(localStorage.getItem('psa_users') || '[]');
                } catch {
                    users = [];
                }

                const keyword = String(searchText || '').trim().toLowerCase();
                const filtered = users.filter((u) => {
                    const haystack = `${u.fullname || ''} ${u.username || ''} ${u.department || ''}`.toLowerCase();
                    return !keyword || haystack.includes(keyword);
                });

                employeeListEl.innerHTML = '';
                if (filtered.length === 0) {
                    const empty = document.createElement('div');
                    empty.className = 'employee-name-btn';
                    empty.textContent = 'No employees found';
                    employeeListEl.appendChild(empty);
                    return;
                }

                filtered.forEach((u) => {
                    const chip = document.createElement('div');
                    chip.className = 'employee-name-btn';
                    chip.textContent = (u.fullname || u.username || 'Employee').toUpperCase();
                    employeeListEl.appendChild(chip);
                });
            };

            renderUsers();
            if (employeeSearchEl) {
                employeeSearchEl.addEventListener('input', (e) => renderUsers(e.target.value));
            }
        }
    }
}

// Initialize dashboard on page load
let dashboard;
document.addEventListener('DOMContentLoaded', async () => {
    dashboard = new EmailDashboard();
    await dashboard.init();
});



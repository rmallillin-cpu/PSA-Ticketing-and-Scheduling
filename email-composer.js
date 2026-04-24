/**
 * Email Composer Functionality
 * Handles email personalization and composition logic
 */

class EmailComposer {
    /**
     * Replace placeholders in text with actual values
     * @param {string} text - Text with placeholders like {{name}}
     * @param {object} data - Data object with replacement values
     * @returns {string} Text with placeholders replaced
     */
    static replacePlaceholders(text, data) {
        let result = text;
        
        Object.keys(data).forEach(key => {
            const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
            result = result.replace(regex, data[key] || '');
        });

        return result;
    }

    /**
     * Personalize email for a specific recipient
     * @param {object} emailTemplate - Email template with subject and body
     * @param {object} recipient - Recipient contact data
     * @param {object} sender - Sender data
     * @returns {object} Personalized email with subject and body
     */
    static personalizeEmail(emailTemplate, recipient, sender) {
        const replacementData = {
            name: recipient.name || '',
            email: recipient.email || '',
            sender: sender.name || sender.display_name || sender.email,
            senderName: sender.name || sender.display_name,
            senderEmail: sender.email,
            company: recipient.company || '',
            phone: recipient.phone || '',
        };

        return {
            subject: this.replacePlaceholders(emailTemplate.subject, replacementData),
            body: this.replacePlaceholders(emailTemplate.body, replacementData),
            recipientEmail: recipient.email,
            recipientName: recipient.name,
            senderEmail: sender.email,
            senderName: sender.name || sender.display_name,
        };
    }

    /**
     * Extract variables from email template
     * @param {string} template - Email template text
     * @returns {array} Array of variable names found in template
     */
    static extractVariables(template) {
        const variableRegex = /\{\{(\w+)\}\}/g;
        const variables = [];
        let match;

        while ((match = variableRegex.exec(template)) !== null) {
            if (!variables.includes(match[1])) {
                variables.push(match[1]);
            }
        }

        return variables;
    }

    /**
     * Validate email configuration
     * @param {object} config - Email configuration
     * @returns {object} Validation result {isValid, errors}
     */
    static validateEmailConfig(config) {
        const errors = [];

        if (!config.recipients || config.recipients.length === 0) {
            errors.push('At least one recipient must be selected');
        }

        if (!config.subject || config.subject.trim() === '') {
            errors.push('Subject is required');
        }

        if (!config.body || config.body.trim() === '') {
            errors.push('Message body is required');
        }

        if (!config.sender) {
            errors.push('Sender must be selected');
        }

        // Validate all recipients have email
        if (config.recipients) {
            config.recipients.forEach((recipient, index) => {
                if (!recipient.email || !this.isValidEmail(recipient.email)) {
                    errors.push(`Recipient #${index + 1} has invalid email: ${recipient.email}`);
                }
            });
        }

        return {
            isValid: errors.length === 0,
            errors: errors,
        };
    }

    /**
     * Validate email address
     * @param {string} email - Email address to validate
     * @returns {boolean} True if valid email
     */
    static isValidEmail(email) {
        // Robust email regex that supports common providers and TLDs
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }

    /**
     * Format email for display
     * @param {object} email - Email object
     * @returns {string} Formatted email display
     */
    static formatEmailForDisplay(email) {
        return `
To: ${email.recipientEmail}
Subject: ${email.subject}

${email.body}
        `.trim();
    }

    /**
     * Calculate email batch size
     * @param {number} totalRecipients - Total number of recipients
     * @returns {array} Array of batch sizes
     */
    static calculateBatches(totalRecipients, batchSize = CONFIG.app.maxRecipientsPerBatch) {
        const batches = [];
        for (let i = 0; i < totalRecipients; i += batchSize) {
            batches.push(Math.min(batchSize, totalRecipients - i));
        }
        return batches;
    }

    /**
     * Prepare emails for sending
     * @param {object} config - Email configuration
     * @returns {array} Array of personalized emails ready to send
     */
    static prepareEmailsForSending(config) {
        const emails = [];

        config.recipients.forEach(recipient => {
            const personalizedEmail = this.personalizeEmail(
                {
                    subject: config.subject,
                    body: config.body,
                },
                recipient,
                config.sender
            );

            emails.push({
                ...personalizedEmail,
                templateId: config.templateId || null,
            });
        });

        return emails;
    }
}

/**
 * Email Service - Handles email sending through Edge Function
 */
class EmailService {
    /**
     * Send single email through Edge Function
     * @param {object} email - Email object with recipient, subject, body
     * @returns {object} Response from Edge Function
     */
    static async sendEmail(email) {
        try {
            const response = await callEdgeFunction('send-email', {
                recipientEmail: email.recipientEmail,
                recipientName: email.recipientName,
                senderEmail: email.senderEmail,
                senderName: email.senderName,
                subject: email.subject,
                body: email.body,
            });

            if (response.error) {
                throw response.error;
            }

            return response.data;
        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    }

    /**
     * Send multiple emails in batches
     * @param {array} emails - Array of email objects
     * @param {function} onProgress - Callback for progress updates
     * @returns {object} Summary of sending results
     */
    static async sendBulkEmails(emails, onProgress = null) {
        const results = {
            total: emails.length,
            sent: 0,
            failed: 0,
            errors: [],
            logs: [],
        };

        for (let i = 0; i < emails.length; i++) {
            const email = emails[i];

            try {
                // Create log entry first
                const logEntry = await ApiService.createEmailLog({
                    recipientEmail: email.recipientEmail,
                    recipientName: email.recipientName,
                    subject: email.subject,
                    messageBody: email.body,
                    senderEmail: email.senderEmail,
                    senderName: email.senderName,
                    status: 'pending',
                    templateId: email.templateId,
                });

                // Send email
                const response = await this.sendEmail(email);

                // Update log as sent
                if (response && response.success) {
                    await ApiService.updateEmailLog(logEntry.id, 'sent');
                    results.sent++;
                    results.logs.push({
                        logId: logEntry.id,
                        status: 'sent',
                        recipientEmail: email.recipientEmail,
                    });
                } else {
                    throw new Error(response?.message || 'Unknown error');
                }
            } catch (error) {
                console.error(`Error sending email to ${email.recipientEmail}:`, error);
                
                results.failed++;
                results.errors.push({
                    recipientEmail: email.recipientEmail,
                    error: error.message,
                });

                // Update log as failed
                try {
                    const logs = await ApiService.getEmailLogs({
                        recipientEmail: email.recipientEmail,
                        status: 'pending',
                        limit: 1,
                    });
                    if (logs.length > 0) {
                        await ApiService.updateEmailLog(logs[0].id, 'failed', error.message);
                    }
                } catch (logError) {
                    console.error('Error updating email log:', logError);
                }
            }

            // Call progress callback
            if (onProgress) {
                onProgress({
                    current: i + 1,
                    total: emails.length,
                    sent: results.sent,
                    failed: results.failed,
                });
            }

            // Add delay to avoid rate limiting
            if (i < emails.length - 1) {
                await new Promise(resolve => setTimeout(resolve, CONFIG.app.retryDelayMs));
            }
        }

        return results;
    }

    /**
     * Retry failed emails
     * @param {function} onProgress - Callback for progress updates
     * @returns {object} Summary of retry results
     */
    static async retryFailedEmails(onProgress = null) {
        const failedEmails = await ApiService.getFailedEmails();

        if (failedEmails.length === 0) {
            return {
                total: 0,
                retried: 0,
                successful: 0,
                stillFailed: 0,
            };
        }

        const results = {
            total: failedEmails.length,
            retried: 0,
            successful: 0,
            stillFailed: 0,
        };

        for (let i = 0; i < failedEmails.length; i++) {
            const log = failedEmails[i];

            try {
                const email = {
                    recipientEmail: log.recipient_email,
                    recipientName: log.recipient_name,
                    senderEmail: log.sender_email,
                    senderName: log.sender_name,
                    subject: log.subject,
                    body: log.message_body,
                };

                const response = await this.sendEmail(email);

                if (response && response.success) {
                    // Update log as sent and increment retry count
                    await ApiService.updateEmailLog(log.id, 'sent');
                    results.successful++;
                } else {
                    throw new Error(response?.message || 'Unknown error');
                }
            } catch (error) {
                console.error(`Error retrying email to ${log.recipient_email}:`, error);
                results.stillFailed++;
            }

            results.retried++;

            if (onProgress) {
                onProgress({
                    current: i + 1,
                    total: failedEmails.length,
                    successful: results.successful,
                    failed: results.stillFailed,
                });
            }

            // Add delay to avoid rate limiting
            if (i < failedEmails.length - 1) {
                await new Promise(resolve => setTimeout(resolve, CONFIG.app.retryDelayMs));
            }
        }

        return results;
    }
}

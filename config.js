/**
 * Email Management System - Configuration
 * Load environment variables and set up global configuration
 */

// Configuration object
const CONFIG = {
    // Supabase configuration
    supabase: {
        url: import.meta.env?.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co',
        anonKey: import.meta.env?.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '',
    },

    // Email service configuration (SendGrid)
    sendgrid: {
        apiKey: process.env.SENDGRID_API_KEY || '',
        // Note: API keys should never be exposed in frontend - use Edge Functions instead
    },

    // Application settings
    app: {
        maxRecipientsPerBatch: 50,
        maxRetries: 3,
        retryDelayMs: 1000,
        requestTimeoutMs: 30000,
    },

    // Feature flags
    features: {
        enableTemplates: true,
        enableCampaigns: true,
        enableContactGroups: true,
        enableScheduledSending: false, // Coming soon
        enableAutoReply: false, // Coming soon
    },

    // API endpoints
    api: {
        sendEmail: '/functions/v1/send-email',
        bulkSendEmail: '/functions/v1/bulk-send-email',
        retryFailedEmail: '/functions/v1/retry-failed-email',
    },
};

// Validate configuration
function validateConfig() {
    if (!CONFIG.supabase.url) {
        console.warn('⚠️ WARNING: Supabase URL not configured');
    }
    if (!CONFIG.supabase.anonKey) {
        console.warn('⚠️ WARNING: Supabase Anon Key not configured');
    }
}

// Run validation on load
validateConfig();

// Export configuration (if using modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}

/**
 * Email Management System - Browser Configuration
 * Uses plain-script compatible globals (no import.meta / process.env).
 */

(function initConfig() {
  const win = typeof window !== "undefined" ? window : {};
  const env = win.__APP_ENV__ || {};

  const DEFAULT_SUPABASE_URL = "https://zbagbzgrithrjwcfktda.supabase.co";
  const DEFAULT_SUPABASE_ANON_KEY = "sb_publishable_uH7HGPtFNw468aoIFd8ZHQ_PCtMf-XL";

  const CONFIG = {
    supabase: {
      url: env.SUPABASE_URL || DEFAULT_SUPABASE_URL,
      anonKey: env.SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY
    },
    app: {
      maxRecipientsPerBatch: 50,
      maxRetries: 3,
      retryDelayMs: 1000,
      requestTimeoutMs: 30000
    },
    features: {
      enableTemplates: true,
      enableCampaigns: true,
      enableContactGroups: true,
      enableScheduledSending: false,
      enableAutoReply: false
    },
    api: {
      sendEmail: "/functions/v1/send-email",
      bulkSendEmail: "/functions/v1/bulk-send-email",
      retryFailedEmail: "/functions/v1/retry-failed-email"
    }
  };

  if (!CONFIG.supabase.url) {
    console.warn("WARNING: Supabase URL not configured");
  }
  if (!CONFIG.supabase.anonKey || CONFIG.supabase.anonKey.startsWith('sb_publishable_')) {
    console.warn("WARNING: Supabase Anon Key looks like a placeholder or is invalid. It should usually start with 'eyJ'.");
  }

  win.CONFIG = CONFIG;
})();

/**
 * Email Management System - Browser Configuration
 * Uses plain-script compatible globals (no import.meta / process.env).
 */

(function initConfig() {
  const win = typeof window !== "undefined" ? window : {};
  const env = win.__APP_ENV__ || {};

  const DEFAULT_SUPABASE_URL = "https://ofidtdjoqkcfprwtolms.supabase.co";
  const DEFAULT_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9maWR0ZGpvcWtjZnByd3RvbG1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4MzcwMzUsImV4cCI6MjA5MjQxMzAzNX0.HLDXysP0PXVFs3cGqUUTciRdR_cb2q0zEi1s3wszYZY";

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

  if (!CONFIG.supabase.anonKey || CONFIG.supabase.anonKey.startsWith('sb_publishable_') || CONFIG.supabase.anonKey === 'your-anon-key-here') {
    console.error("❌ CRITICAL ERROR: Supabase Anon Key is NOT configured. Authentication will fail.");
    console.warn("Please replace the placeholder key in config.js and common.js with your real 'anon (public)' key from the Supabase Dashboard.");
  } else if (!CONFIG.supabase.anonKey.startsWith('eyJ')) {
    console.warn("⚠️ WARNING: Supabase Anon Key format looks unusual. It should usually be a long string starting with 'eyJ'.");
  }

  win.CONFIG = CONFIG;
})();

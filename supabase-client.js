/**
 * Supabase Client Initialization
 * Sets up the Supabase client for database and auth operations
 */

// Initialize Supabase client
let supabaseClient = null;

/**
 * Initialize Supabase client
 * Must be called before using any Supabase functions
 */
async function initSupabase() {
    if (supabaseClient) {
        return supabaseClient;
    }

    // Check if supabase-js library is loaded
    if (typeof window.supabase === 'undefined') {
        throw new Error('Supabase library not loaded. Add <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js"></script>');
    }

    const { createClient } = window.supabase;

    supabaseClient = createClient(
        CONFIG.supabase.url,
        CONFIG.supabase.anonKey,
        {
            auth: {
                autoRefreshToken: true,
                persistSession: true,
                detectSessionInUrl: true,
            },
        }
    );

    console.log('✅ Supabase client initialized');
    return supabaseClient;
}

/**
 * Get the Supabase client instance
 */
function getSupabaseClient() {
    if (!supabaseClient) {
        throw new Error('Supabase client not initialized. Call initSupabase() first.');
    }
    return supabaseClient;
}

/**
 * Check if user is authenticated
 */
async function isAuthenticated() {
    const client = getSupabaseClient();
    const { data: { session } } = await client.auth.getSession();
    return !!session;
}

/**
 * Get current user
 */
async function getCurrentUser() {
    const client = getSupabaseClient();
    const { data: { session } } = await client.auth.getSession();
    return session?.user || null;
}

/**
 * Sign up new user
 */
async function signUp(email, password) {
    const client = getSupabaseClient();
    return await client.auth.signUp({
        email,
        password,
    });
}

/**
 * Sign in user
 */
async function signIn(email, password) {
    const client = getSupabaseClient();
    return await client.auth.signInWithPassword({
        email,
        password,
    });
}

/**
 * Sign out user
 */
async function signOut() {
    const client = getSupabaseClient();
    return await client.auth.signOut();
}

/**
 * Get user email
 */
async function getUserEmail() {
    const user = await getCurrentUser();
    return user?.email || 'Guest';
}

/**
 * Listen to auth state changes
 */
function onAuthStateChange(callback) {
    const client = getSupabaseClient();
    const { data: { subscription } } = client.auth.onAuthStateChange(callback);
    return subscription;
}

/**
 * Make authenticated request to Supabase database
 */
async function queryDatabase(query) {
    const client = getSupabaseClient();
    return query(client);
}

/**
 * Call Supabase Edge Function
 */
async function callEdgeFunction(functionName, payload) {
    const client = getSupabaseClient();
    return await client.functions.invoke(functionName, {
        body: payload,
    });
}

// Auto-initialize on page load if DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSupabase);
} else {
    initSupabase().catch(err => console.error('Failed to initialize Supabase:', err));
}

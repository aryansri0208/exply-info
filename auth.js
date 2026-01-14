// Authentication functions
let supabaseClient = null;

// Broadcast Supabase access token to browser extensions/content scripts
// so they can authenticate backend calls after the user logs in on the website.
function broadcastSupabaseToken(token) {
    try {
        const hasToken = typeof token === 'string' && token.length > 0;
        console.log('[Auth Bridge] Broadcasting Supabase token to extension - hasToken:', hasToken);
        window.postMessage(
            {
                source: 'exply-web',
                type: 'SUPABASE_TOKEN',
                token: hasToken ? token : null
            },
            '*'
        );
    } catch (error) {
        console.error('[Auth Bridge] Error broadcasting Supabase token:', error);
    }
}

// Initialize Supabase client
function initSupabaseClient() {
    if (supabaseClient) {
        console.log('[Auth] Supabase client already initialized');
        return supabaseClient;
    }
    
    console.log('[Auth] Initializing Supabase client...');
    console.log('[Auth] window.supabase available:', typeof window.supabase !== 'undefined');
    console.log('[Auth] SUPABASE_CONFIG:', SUPABASE_CONFIG ? 'Available' : 'Missing');
    
    if (typeof window.supabase === 'undefined') {
        console.error('[Auth] Supabase library not loaded');
        return null;
    }
    
    try {
        const { createClient } = window.supabase;
        supabaseClient = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
        // Expose globally for extension bridge
        window.explySupabase = supabaseClient;
        console.log('[Auth] Supabase client created and exposed as window.explySupabase');
        return supabaseClient;
    } catch (error) {
        console.error('[Auth] Error creating Supabase client:', error);
        return null;
    }
}

// Get Supabase client (initialize if needed)
function getSupabaseClient() {
    if (!supabaseClient) {
        return initSupabaseClient();
    }
    return supabaseClient;
}

// Authentication state
let currentUser = null;

// Check authentication state
async function checkAuthState() {
    console.log('[Auth] Checking authentication state...');
    const client = getSupabaseClient();
    if (!client) {
        console.warn('[Auth] No Supabase client available');
        return false;
    }
    
    try {
        const { data: { session }, error } = await client.auth.getSession();
        if (error) {
            console.error('[Auth] Error getting session:', error);
        }
        
        if (session) {
            console.log('[Auth] User is authenticated:', session.user.email);
            console.log('[Auth] Session access_token available:', !!session.access_token);
            currentUser = session.user;
            updateUIForAuth(true);
            // Broadcast token for the extension once we know the user is authenticated
            if (session.access_token) {
                console.log('[Auth] Broadcasting token from checkAuthState');
                broadcastSupabaseToken(session.access_token);
            } else {
                console.warn('[Auth] Session exists but no access_token found');
                // Try to get it from the session object directly
                const token = session.access_token || (session.session && session.session.access_token);
                if (token) {
                    console.log('[Auth] Found token in nested session object');
                    broadcastSupabaseToken(token);
                } else {
                    broadcastSupabaseToken(null);
                }
            }
            return true;
        } else {
            console.log('[Auth] No active session found');
            currentUser = null;
            updateUIForAuth(false);
            return false;
        }
    } catch (error) {
        console.error('[Auth] Error checking auth state:', error);
        return false;
    }
}

// Sign up with email and password
async function signUp(email, password, fullName) {
    const client = getSupabaseClient();
    if (!client) {
        return { success: false, error: 'Authentication service not available' };
    }
    
    try {
        const { data, error } = await client.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    full_name: fullName
                }
            }
        });
        
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Sign in with email and password
async function signIn(email, password) {
    const client = getSupabaseClient();
    if (!client) {
        return { success: false, error: 'Authentication service not available' };
    }
    
    try {
        const { data, error } = await client.auth.signInWithPassword({
            email: email,
            password: password
        });
        
        if (error) throw error;
        currentUser = data.user;
        updateUIForAuth(true);
        
        // Broadcast token immediately after successful login
        if (data.session && data.session.access_token) {
            broadcastSupabaseToken(data.session.access_token);
        }
        
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Sign out
async function signOut() {
    const client = getSupabaseClient();
    if (!client) {
        return { success: false, error: 'Authentication service not available' };
    }
    
    try {
        const { error } = await client.auth.signOut();
        if (error) throw error;
        currentUser = null;
        updateUIForAuth(false);
        window.location.href = 'index.html';
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Get current user
function getCurrentUser() {
    return currentUser;
}

// Check if user is authenticated
function isAuthenticated() {
    return currentUser !== null;
}

// Update UI based on authentication state
function updateUIForAuth(isAuthenticated) {
    const authLinks = document.querySelectorAll('.auth-link');
    const userLinks = document.querySelectorAll('.user-link');
    
    authLinks.forEach(link => {
        link.style.display = isAuthenticated ? 'none' : 'inline-block';
    });
    
    userLinks.forEach(link => {
        link.style.display = isAuthenticated ? 'inline-block' : 'none';
    });
}

// Require authentication (redirect to login if not authenticated)
async function requireAuth() {
    const client = getSupabaseClient();
    if (!client) {
        window.location.href = 'login.html';
        return false;
    }
    
    try {
        const { data: { session } } = await client.auth.getSession();
        if (!session) {
            const currentPath = window.location.pathname;
            window.location.href = `login.html?redirect=${encodeURIComponent(currentPath)}`;
            return false;
        }
        currentUser = session.user;
        return true;
    } catch (error) {
        window.location.href = 'login.html';
        return false;
    }
}

// Set up Supabase auth state change listener to broadcast token whenever session changes
function setupAuthStateListener() {
    const client = getSupabaseClient();
    if (!client) {
        console.warn('[Auth] Cannot setup auth state listener - no Supabase client');
        return;
    }
    
    // Listen for auth state changes (login, logout, token refresh, etc.)
    client.auth.onAuthStateChange((event, session) => {
        console.log('[Auth] Auth state changed:', event, session ? 'session exists' : 'no session');
        
        if (session && session.access_token) {
            console.log('[Auth] Broadcasting token after auth state change');
            broadcastSupabaseToken(session.access_token);
            currentUser = session.user;
            updateUIForAuth(true);
        } else {
            console.log('[Auth] No session - broadcasting null token');
            broadcastSupabaseToken(null);
            currentUser = null;
            updateUIForAuth(false);
        }
    });
    
    console.log('[Auth] Auth state change listener set up');
}

// Initialize auth when page loads
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                checkAuthState();
                setupAuthStateListener();
            }, 100);
        });
    } else {
        setTimeout(() => {
            checkAuthState();
            setupAuthStateListener();
        }, 100);
    }
}


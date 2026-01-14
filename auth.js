// Authentication functions
let supabaseClient = null;

// Initialize Supabase client
function initSupabaseClient() {
    if (supabaseClient) {
        return supabaseClient;
    }
    
    if (typeof window.supabase === 'undefined') {
        console.error('Supabase library not loaded');
        return null;
    }
    
    try {
        const { createClient } = window.supabase;
        supabaseClient = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
        // Expose globally for extension bridge
        window.explySupabase = supabaseClient;
        return supabaseClient;
    } catch (error) {
        console.error('Error creating Supabase client:', error);
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
    const client = getSupabaseClient();
    if (!client) return false;
    
    try {
        const { data: { session }, error } = await client.auth.getSession();
        if (session) {
            currentUser = session.user;
            updateUIForAuth(true);
            return true;
        } else {
            currentUser = null;
            updateUIForAuth(false);
            return false;
        }
    } catch (error) {
        console.error('Error checking auth state:', error);
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

// Initialize auth when page loads
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(checkAuthState, 100);
        });
    } else {
        setTimeout(checkAuthState, 100);
    }
}


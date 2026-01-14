// Supabase Configuration
// Replace these with your actual Supabase project credentials
const SUPABASE_URL = 'https://ieewwnvdltqaloyqgugf.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_qYdV9A6hJ6MYVHsE0FrL4g_xANAiX';

// Initialize Supabase client
let supabase;

// Wait for Supabase to load, then initialize
function initSupabase() {
    if (typeof window !== 'undefined' && window.supabase && typeof window.supabase.createClient === 'function') {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        return true;
    }
    return false;
}

// Authentication state
let currentUser = null;

// Check authentication state on page load
async function initAuth() {
    if (!initSupabase()) {
        console.error('Supabase not loaded');
        return;
    }
    const { data: { session }, error } = await supabase.auth.getSession();
    if (session) {
        currentUser = session.user;
        updateUIForAuth(true);
    } else {
        updateUIForAuth(false);
    }
    
    // Listen for auth state changes
    supabase.auth.onAuthStateChange((event, session) => {
        if (session) {
            currentUser = session.user;
            updateUIForAuth(true);
        } else {
            currentUser = null;
            updateUIForAuth(false);
        }
    });
}

// Sign up with email and password
async function signUp(email, password, fullName) {
    if (!supabase) {
        if (!initSupabase()) {
            return { success: false, error: 'Supabase not initialized' };
        }
    }
    try {
        const { data, error } = await supabase.auth.signUp({
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
    if (!supabase) {
        if (!initSupabase()) {
            return { success: false, error: 'Supabase not initialized' };
        }
    }
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });
        
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Sign out
async function signOut() {
    if (!supabase) {
        if (!initSupabase()) {
            return { success: false, error: 'Supabase not initialized' };
        }
    }
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        currentUser = null;
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
        link.style.display = isAuthenticated ? 'none' : 'block';
    });
    
    userLinks.forEach(link => {
        link.style.display = isAuthenticated ? 'block' : 'none';
    });
}

// Redirect to login if not authenticated (for protected pages)
async function requireAuth() {
    if (!supabase) {
        if (!initSupabase()) {
            window.location.href = 'login.html';
            return false;
        }
    }
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.pathname);
        return false;
    }
    currentUser = session.user;
    return true;
}

// Initialize auth on page load
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAuth);
    } else {
        initAuth();
    }
}


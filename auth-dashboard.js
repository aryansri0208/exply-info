// Dashboard handler
document.addEventListener('DOMContentLoaded', async function() {
    // Check authentication
    const isAuth = await requireAuth();
    if (!isAuth) return;

    // Get user data
    const user = getCurrentUser();
    if (user) {
        // Display user information
        const userNameEl = document.getElementById('userName');
        const userEmailEl = document.getElementById('userEmail');
        
        if (userNameEl) {
            const fullName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
            userNameEl.textContent = fullName;
        }
        
        if (userEmailEl) {
            userEmailEl.textContent = user.email || '-';
        }
    }

    // Logout handler
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            await signOut();
        });
    }
});


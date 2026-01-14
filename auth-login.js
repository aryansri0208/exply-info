// Login form handler
document.addEventListener('DOMContentLoaded', async function() {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');
    const submitBtn = document.getElementById('submitBtn');

    // Wait a bit for Supabase to initialize
    await new Promise(resolve => setTimeout(resolve, 100));

    // Check if user is already logged in
    if (!supabase) {
        if (!initSupabase()) {
            errorMessage.textContent = 'Authentication service not available';
            errorMessage.style.display = 'block';
            return;
        }
    }
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
        const urlParams = new URLSearchParams(window.location.search);
        const redirect = urlParams.get('redirect');
        window.location.href = redirect || 'dashboard.html';
        return;
    }

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Clear previous messages
        errorMessage.style.display = 'none';
        successMessage.style.display = 'none';
        
        // Disable button and show loading
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const result = await signIn(email, password);

        if (result.success) {
            successMessage.textContent = 'Login successful! Redirecting...';
            successMessage.style.display = 'block';
            
            // Redirect to dashboard or redirect URL
            const urlParams = new URLSearchParams(window.location.search);
            const redirect = urlParams.get('redirect');
            setTimeout(() => {
                window.location.href = redirect || 'dashboard.html';
            }, 1000);
        } else {
            errorMessage.textContent = result.error || 'An error occurred. Please try again.';
            errorMessage.style.display = 'block';
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
        }
    });
});


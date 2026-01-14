// Signup form handler
document.addEventListener('DOMContentLoaded', async function() {
    const signupForm = document.getElementById('signupForm');
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');
    const submitBtn = document.getElementById('submitBtn');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');

    // Wait a bit for Supabase to initialize
    await new Promise(resolve => setTimeout(resolve, 100));

    // Check if user is already logged in
    if (!supabaseClient) {
        if (!initSupabase()) {
            errorMessage.textContent = 'Authentication service not available';
            errorMessage.style.display = 'block';
            return;
        }
    }
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (session) {
        window.location.href = 'dashboard.html';
        return;
    }

    // Validate password match
    confirmPasswordInput.addEventListener('input', function() {
        if (passwordInput.value !== confirmPasswordInput.value) {
            confirmPasswordInput.setCustomValidity('Passwords do not match');
        } else {
            confirmPasswordInput.setCustomValidity('');
        }
    });

    signupForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Clear previous messages
        errorMessage.style.display = 'none';
        successMessage.style.display = 'none';

        // Validate password match
        if (passwordInput.value !== confirmPasswordInput.value) {
            errorMessage.textContent = 'Passwords do not match';
            errorMessage.style.display = 'block';
            return;
        }
        
        // Disable button and show loading
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');

        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const password = passwordInput.value;

        const result = await signUp(email, password, fullName);

        if (result.success) {
            successMessage.textContent = 'Account created! Please check your email to confirm your account.';
            successMessage.style.display = 'block';
            
            // Clear form
            signupForm.reset();
            
            // Redirect to login after a delay
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 3000);
        } else {
            errorMessage.textContent = result.error || 'An error occurred. Please try again.';
            errorMessage.style.display = 'block';
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
        }
    });
});


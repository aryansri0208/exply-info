# Supabase Setup Guide

Follow these steps to set up Supabase authentication for your Exply website.

## Step 1: Create a Supabase Account

1. Go to https://supabase.com
2. Click "Start your project" or "Sign up"
3. Sign up with GitHub, Google, or email
4. Verify your email if needed

## Step 2: Create a New Project

1. Click "New Project" in your Supabase dashboard
2. Fill in the project details:
   - **Name**: `exply` (or any name you prefer)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier is fine to start
3. Click "Create new project"
4. Wait 1-2 minutes for project setup

## Step 3: Get Your API Keys

1. In your Supabase project dashboard, go to **Settings** (gear icon in sidebar)
2. Click **API** in the settings menu
3. You'll see:
   - **Project URL** (something like `https://xxxxx.supabase.co`)
   - **anon public** key (starts with `eyJ...`)
4. Copy both values

## Step 4: Configure Your Website

1. Open `auth.js` in your project
2. Replace the placeholder values:

```javascript
const SUPABASE_URL = 'https://your-project-id.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';
```

Replace:
- `YOUR_SUPABASE_URL` with your Project URL
- `YOUR_SUPABASE_ANON_KEY` with your anon public key

## Step 5: Configure Authentication Settings

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Make sure **Email** provider is enabled (should be by default)
3. Configure email settings:
   - Go to **Authentication** → **Email Templates**
   - Customize the confirmation email if desired
   - Under **Authentication** → **URL Configuration**:
     - **Site URL**: Your website URL (e.g., `https://yourusername.github.io/exply-website`)
     - **Redirect URLs**: Add your redirect URLs:
       - `https://yourusername.github.io/exply-website/dashboard.html`
       - `https://yourusername.github.io/exply-website/login.html`

## Step 6: Test Authentication

1. Open your website
2. Click "Sign Up" in the navigation
3. Create a test account
4. Check your email for confirmation (if email confirmation is enabled)
5. Log in with your credentials
6. Verify you can access the dashboard

## Step 7: (Optional) Disable Email Confirmation

For testing, you might want to disable email confirmation:

1. Go to **Authentication** → **Providers** → **Email**
2. Toggle off "Confirm email" (for development only)
3. In production, keep email confirmation enabled

## Security Notes

- The `anon` key is safe to use in client-side code (it's public)
- Never commit your service role key to public repositories
- The anon key has Row Level Security (RLS) policies applied
- Supabase handles password hashing automatically

## Troubleshooting

### "Invalid API key" error
- Double-check you copied the full anon key (starts with `eyJ`)
- Make sure there are no extra spaces
- Verify the URL is correct

### Email confirmation not working
- Check your Site URL and Redirect URLs in Supabase settings
- Make sure the URLs match your actual website URLs
- Check spam folder for confirmation emails

### Users can't log in after signup
- Check if email confirmation is required
- If enabled, users must click the confirmation link in their email
- Or disable email confirmation for testing

## Next Steps

Once authentication is working:

1. **Create database tables** (if you need to store user data)
2. **Set up Row Level Security (RLS)** policies
3. **Add user preferences** to sync with extension
4. **Implement extension authentication** (future step)

## Support

- Supabase Docs: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com
- Authentication Docs: https://supabase.com/docs/guides/auth


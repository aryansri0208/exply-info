# How to Publish Your Exply Website

This guide covers several options for publishing your static website. Choose the one that works best for you.

## Option 1: GitHub Pages (Recommended - Free & Easy)

### Steps:
1. **Create a GitHub account** (if you don't have one): https://github.com
2. **Create a new repository:**
   - Go to GitHub and click "New repository"
   - Name it `exply-website` (or any name you prefer)
   - Make it public (required for free GitHub Pages)
   - Don't initialize with README

3. **Push your code to GitHub:**
   ```bash
   cd /Users/aryansrivastava/Desktop/exply-website
   git init
   git add .
   git commit -m "Initial commit - Exply website"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/exply-website.git
   git push -u origin main
   ```

4. **Enable GitHub Pages:**
   - Go to your repository on GitHub
   - Click "Settings" → "Pages"
   - Under "Source", select "Deploy from a branch"
   - Choose branch: `main` and folder: `/ (root)`
   - Click "Save"

5. **Your site will be live at:**
   - `https://YOUR_USERNAME.github.io/exply-website/`

---

## Option 2: Netlify (Recommended - Free & Very Easy)

### Steps:
1. **Create a Netlify account:** https://www.netlify.com (free)

2. **Drag and Drop Method:**
   - Go to https://app.netlify.com/drop
   - Drag your entire `exply-website` folder onto the page
   - Your site will be live instantly!

3. **Or use Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   cd /Users/aryansrivastava/Desktop/exply-website
   netlify deploy
   netlify deploy --prod  # For production
   ```

4. **Your site will be live at:**
   - `https://random-name-12345.netlify.app` (auto-generated)
   - You can customize the domain name in settings

**Benefits:**
- Free SSL certificate
- Custom domain support
- Automatic deployments from Git
- CDN included

---

## Option 3: Vercel (Free & Fast)

### Steps:
1. **Create a Vercel account:** https://vercel.com (free)

2. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

3. **Deploy:**
   ```bash
   cd /Users/aryansrivastava/Desktop/exply-website
   vercel
   ```

4. **Follow the prompts** and your site will be live!

**Benefits:**
- Free SSL
- Global CDN
- Custom domains
- Automatic deployments

---

## Option 4: Cloudflare Pages (Free)

### Steps:
1. **Create a Cloudflare account:** https://dash.cloudflare.com

2. **Connect to Git:**
   - Go to Pages → Create a project
   - Connect your GitHub/GitLab repository
   - Or upload files directly

3. **Configure build:**
   - Build command: (leave empty for static site)
   - Build output directory: `/`

**Benefits:**
- Free SSL
- Unlimited bandwidth
- Fast global CDN

---

## Option 5: Traditional Web Hosting

If you have web hosting (like Bluehost, HostGator, etc.):

1. **Upload files via FTP:**
   - Use FileZilla or your hosting provider's file manager
   - Upload all files to the `public_html` or `www` folder
   - Keep the folder structure intact

2. **Access your site:**
   - `http://yourdomain.com` or `http://yourdomain.com/exply-website`

---

## Before Publishing - Checklist

- [ ] Test all links work correctly
- [ ] Verify all images load properly
- [ ] Test on mobile devices
- [ ] Check that dark mode looks good
- [ ] Ensure logo displays correctly
- [ ] Test "Coming Soon" page
- [ ] Verify email links work (sriva115@purdue.edu)

---

## Custom Domain (Optional)

If you want to use a custom domain (e.g., `exply.com`):

1. **Buy a domain** from:
   - Namecheap
   - Google Domains
   - Cloudflare Registrar

2. **Configure DNS:**
   - For Netlify/Vercel: Add your domain in settings and follow DNS instructions
   - For GitHub Pages: Add CNAME file and configure DNS

---

## Recommended: Netlify or GitHub Pages

**For beginners:** Netlify (drag & drop is easiest)
**For developers:** GitHub Pages (if you already use Git)

Both are free, reliable, and perfect for static websites like this one!


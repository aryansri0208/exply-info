# GitHub Pages Setup - Next Steps

Your repository is ready! Follow these steps to publish your website:

## Step 1: Create GitHub Repository

1. Go to https://github.com and sign in (or create an account)
2. Click the **"+"** icon in the top right → **"New repository"**
3. Fill in the details:
   - **Repository name:** `exply-website` (or any name you prefer)
   - **Description:** "Official website for Exply browser extension"
   - **Visibility:** Choose **Public** (required for free GitHub Pages)
   - **DO NOT** check "Initialize this repository with a README"
   - **DO NOT** add .gitignore or license (we already have these)
4. Click **"Create repository"**

## Step 2: Connect and Push Your Code

After creating the repository, GitHub will show you commands. Use these:

```bash
cd /Users/aryansrivastava/Desktop/exply-website
git remote add origin https://github.com/YOUR_USERNAME/exply-website.git
git push -u origin main
```

**Replace `YOUR_USERNAME` with your actual GitHub username!**

Example:
```bash
git remote add origin https://github.com/aryansrivastava/exply-website.git
git push -u origin main
```

You'll be prompted for your GitHub credentials.

## Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **"Settings"** (at the top of the repository)
3. Scroll down to **"Pages"** in the left sidebar
4. Under **"Source"**, select:
   - **Branch:** `main`
   - **Folder:** `/ (root)`
5. Click **"Save"**

## Step 4: Access Your Website

GitHub will provide you with a URL. It will be:
- `https://YOUR_USERNAME.github.io/exply-website/`

For example: `https://aryansrivastava.github.io/exply-website/`

**Note:** It may take a few minutes (up to 10 minutes) for your site to be live after enabling Pages.

## Troubleshooting

### If you get authentication errors:
- Use GitHub Personal Access Token instead of password
- Go to: Settings → Developer settings → Personal access tokens → Generate new token
- Select scope: `repo`
- Use the token as your password when pushing

### If the site shows 404:
- Wait 5-10 minutes for GitHub Pages to build
- Make sure the repository is Public
- Check that the branch is named `main` or `master`
- Verify files are in the root directory

## Future Updates

To update your website:
```bash
cd /Users/aryansrivastava/Desktop/exply-website
git add .
git commit -m "Update website"
git push
```

Your changes will automatically appear on your site within a few minutes!



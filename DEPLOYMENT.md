# Deployment Guide

## Prerequisites
- GitHub account
- Vercel account (sign up at https://vercel.com)

## Environment Variables Needed
Make sure to set these in your deployment platform:

1. `DATABASE_URL` - Your PostgreSQL database connection string
2. `GEMINI_API_KEY` - Your Google Gemini API key
3. `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Your Clerk publishable key
4. `CLERK_SECRET_KEY` - Your Clerk secret key

## Deploy to Vercel

### Option 1: Using Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# - Link to existing project or create new
# - Set up environment variables when prompted
```

### Option 2: Using Vercel Dashboard
1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. Go to https://vercel.com/new

3. Import your GitHub repository

4. Configure your project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: (leave default)

5. Add Environment Variables:
   - Click "Environment Variables"
   - Add each variable listed above
   - Make sure to add them for Production, Preview, and Development

6. Click "Deploy"

## Deploy to Other Platforms

### Railway
1. Go to https://railway.app
2. Create new project from GitHub repo
3. Add environment variables in the Variables tab
4. Deploy automatically happens

### Netlify
1. Go to https://netlify.com
2. Import from Git
3. Build command: `npm run build`
4. Publish directory: `.next`
5. Add environment variables

## Post-Deployment Checklist
- [ ] Verify environment variables are set correctly
- [ ] Test authentication (Clerk)
- [ ] Test database connection
- [ ] Test Gemini AI API
- [ ] Test all API routes
- [ ] Update Clerk settings with your production domain

## Clerk Configuration
After deployment, update your Clerk settings:
1. Go to https://dashboard.clerk.com
2. Select your application
3. Add your production domain to:
   - Authorized Domains
   - Redirect URLs

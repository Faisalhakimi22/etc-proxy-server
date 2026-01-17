# Cloudflare Workers Deployment Guide

## Prerequisites

1. **Node.js installed** (v18 or higher)
   - Download from: https://nodejs.org
   - Verify: `node --version`

2. **Cloudflare account** (free tier works!)
   - Sign up at: https://dash.cloudflare.com/sign-up

## Step 1: Login to Cloudflare

Open terminal in the `etc-proxy-server` folder and run:

```bash
npx wrangler login
```

This will:
- Open your browser
- Ask you to authorize Wrangler
- Save your credentials locally

## Step 2: Deploy to Cloudflare Workers

### Option A: Using the batch file (Windows)

Double-click `deploy-cloudflare.bat` or run:

```bash
deploy-cloudflare.bat
```

### Option B: Manual deployment

```bash
npx wrangler deploy
```

## Step 3: Get Your Worker URL

After successful deployment, you'll see output like:

```
Published etc-proxy-server (X.XX sec)
  https://etc-proxy-server.YOUR-SUBDOMAIN.workers.dev
```

**Copy this URL!** You'll need it for the next step.

Example URL format:
- `https://etc-proxy-server.faisalhakimi22.workers.dev`
- `https://etc-proxy-server.your-username.workers.dev`

## Step 4: Update Your Frontend

### 4.1 Open your main app

Navigate back to your main app directory (parent folder).

### 4.2 Update AttendancePortalFrame.tsx

Open `src/components/AttendancePortalFrame.tsx` and find this line (around line 32):

```typescript
const PORTAL_URL = isDev ? '/api/etc' : '/api/etc-proxy';
```

Replace it with your Cloudflare Workers URL:

```typescript
const PORTAL_URL = 'https://etc-proxy-server.YOUR-SUBDOMAIN.workers.dev/proxy';
```

**Important:** Add `/proxy` at the end!

Example:
```typescript
const PORTAL_URL = 'https://etc-proxy-server.faisalhakimi22.workers.dev/proxy';
```

### 4.3 Remove unused code

You can also remove the `isDev` check since we're using an external proxy:

```typescript
// Remove this line:
const isDev = import.meta.env.DEV;

// And simplify to:
const PORTAL_URL = 'https://etc-proxy-server.YOUR-SUBDOMAIN.workers.dev/proxy';
```

Also remove the unused constant (around line 31):

```typescript
// Remove this line:
const PORTAL_EXTERNAL_URL = 'https://etc.imsciences.edu.pk';
```

## Step 5: Test Locally

```bash
npm run dev
```

1. Open your app in browser
2. Go to Attendance page
3. Try fetching attendance data
4. Should work without CORS errors!

## Step 6: Deploy to Production

### Commit and push changes:

```bash
git add .
git commit -m "Update to use Cloudflare Workers proxy"
git push
```

Vercel will automatically redeploy your app with the new proxy URL.

## Verify Deployment

### Test the proxy health endpoint

Open in browser:
```
https://etc-proxy-server.YOUR-SUBDOMAIN.workers.dev/health
```

Should return:
```json
{
  "status": "ok",
  "message": "ETC Proxy Server Running on Cloudflare Workers",
  "timestamp": "2026-01-17T..."
}
```

### Test the proxy endpoint

```
https://etc-proxy-server.YOUR-SUBDOMAIN.workers.dev/proxy
```

Should load the ETC portal login page (HTML).

## Troubleshooting

### Error: "Not logged in"

Run:
```bash
npx wrangler login
```

### Error: "Invalid configuration"

Check `wrangler.toml`:
- Make sure `name = "etc-proxy-server"`
- Make sure `main = "worker.js"`
- Make sure `compatibility_date` is set

### Error: "Worker not found"

Wait 1-2 minutes after deployment for DNS propagation.

### CORS errors in browser

Make sure you're using the correct URL format:
```
https://etc-proxy-server.YOUR-SUBDOMAIN.workers.dev/proxy
```

Note the `/proxy` at the end!

### 404 errors

Check that `worker.js` exists and is properly configured in `wrangler.toml`.

## Cloudflare Workers Limits (Free Tier)

- ✅ **100,000 requests/day** - More than enough!
- ✅ **10ms CPU time per request** - Plenty for proxy
- ✅ **No cold starts** - Always fast!
- ✅ **Global edge network** - Fast worldwide
- ✅ **Free SSL/HTTPS** - Secure by default

## Update/Redeploy

To update your worker after making changes:

```bash
npx wrangler deploy
```

Changes are live immediately (no waiting)!

## View Logs

To see real-time logs:

```bash
npx wrangler tail
```

Or view in Cloudflare dashboard:
1. Go to https://dash.cloudflare.com
2. Click "Workers & Pages"
3. Click your worker name
4. Click "Logs" tab

## Custom Domain (Optional)

You can use your own domain instead of `workers.dev`:

1. Go to Cloudflare dashboard
2. Add your domain to Cloudflare
3. Go to Workers & Pages
4. Click your worker
5. Click "Triggers" tab
6. Add custom domain

## Cost

**Free Tier:**
- 100,000 requests/day
- Perfect for personal use
- No credit card required

**Paid Tier ($5/month):**
- 10 million requests/month
- Better for production apps
- Priority support

## Security Notes

✅ **Safe:**
- No data storage
- Runs on Cloudflare's secure edge
- Automatic DDoS protection
- Free SSL/HTTPS

⚠️ **Important:**
- Don't commit secrets to GitHub
- Monitor usage in Cloudflare dashboard
- Keep wrangler.toml configuration simple

## Next Steps

1. ✅ Deploy worker to Cloudflare
2. ✅ Copy your Workers URL
3. ✅ Update AttendancePortalFrame.tsx
4. ✅ Test locally
5. ✅ Deploy to Vercel
6. 🎉 Done!

---

**Congratulations!** 🎉 Your proxy server is now running on Cloudflare's global edge network!

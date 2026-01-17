# Complete Deployment Guide

## Step 1: Create GitHub Repository

1. Go to [github.com](https://github.com) and create a new repository
   - Name: `etc-proxy-server`
   - Description: "Proxy server for IMS ETC Portal"
   - Public or Private (your choice)
   - Don't initialize with README (we already have files)

2. Push this folder to GitHub:

```bash
cd etc-proxy-server
git init
git add .
git commit -m "Initial commit: ETC proxy server"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/etc-proxy-server.git
git push -u origin main
```

## Step 2: Deploy to Render.com

### 2.1 Sign Up / Login
1. Go to [render.com](https://render.com)
2. Sign up with GitHub (recommended) or email

### 2.2 Create New Web Service
1. Click **"New +"** button (top right)
2. Select **"Web Service"**
3. Click **"Connect account"** to link your GitHub
4. Find and select your `etc-proxy-server` repository
5. Click **"Connect"**

### 2.3 Configure Service
Fill in these settings:

- **Name**: `etc-proxy-server` (or your preferred name)
- **Region**: Choose closest to your users
- **Branch**: `main`
- **Root Directory**: Leave empty
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Instance Type**: `Free` (or paid for better performance)

### 2.4 Advanced Settings (Optional)
Click **"Advanced"** and add environment variables if needed:
- `NODE_ENV` = `production`

### 2.5 Deploy
1. Click **"Create Web Service"**
2. Wait for deployment (usually 2-3 minutes)
3. Once deployed, you'll see: ✅ **Live**

### 2.6 Copy Your Proxy URL
Your proxy URL will be something like:
```
https://etc-proxy-server.onrender.com
```

**Copy this URL - you'll need it for Step 3!**

## Step 3: Update Your Frontend

Now update your main app to use the deployed proxy server.

### 3.1 Update AttendancePortalFrame.tsx

Open `src/components/AttendancePortalFrame.tsx` and replace the proxy URL:

```typescript
// Find this line (around line 30):
const PORTAL_URL = isDev ? '/api/etc' : '/api/etc-proxy';

// Replace with your Render URL:
const PORTAL_URL = 'https://YOUR-PROXY-URL.onrender.com/proxy';
```

**Example:**
```typescript
const PORTAL_URL = 'https://etc-proxy-server.onrender.com/proxy';
```

### 3.2 Remove isDev Check (Optional)

Since we're using an external proxy, you can simplify:

```typescript
// Remove this:
const isDev = import.meta.env.DEV;

// Just use:
const PORTAL_URL = 'https://etc-proxy-server.onrender.com/proxy';
```

### 3.3 Test Locally

```bash
# In your main app directory
npm run dev
```

Go to Attendance page and try fetching data. It should now work!

## Step 4: Deploy Your Frontend to Vercel

```bash
git add .
git commit -m "Update to use Render proxy server"
git push
```

Vercel will automatically redeploy with the new proxy URL.

## Troubleshooting

### Proxy Server Issues

**Problem**: 504 Timeout errors
- **Solution**: Free tier spins down after inactivity. First request takes ~30s to wake up. Upgrade to paid tier for instant responses.

**Problem**: CORS errors
- **Solution**: Check Render logs. The proxy should handle CORS automatically.

**Problem**: Can't connect to proxy
- **Solution**: Make sure your Render service is "Live" (green checkmark)

### Check Proxy Health

Visit in browser:
```
https://YOUR-PROXY-URL.onrender.com/health
```

Should return:
```json
{
  "status": "ok",
  "timestamp": "2026-01-17T..."
}
```

### View Logs

1. Go to Render dashboard
2. Click on your service
3. Click **"Logs"** tab
4. Watch real-time logs as you test

## Performance Tips

### Free Tier Limitations
- Spins down after 15 minutes of inactivity
- 750 hours/month free
- Slower cold starts (~30 seconds)

### Upgrade to Paid ($7/month)
- Always running (no spin down)
- Faster performance
- More memory
- Better for production

### Keep Free Tier Alive
Use a service like [UptimeRobot](https://uptimerobot.com) to ping your proxy every 10 minutes:
```
https://YOUR-PROXY-URL.onrender.com/health
```

## Security Notes

✅ **Safe:**
- Proxy doesn't store any credentials
- All data passes through temporarily
- No database or persistent storage

⚠️ **Important:**
- Don't commit sensitive data to GitHub
- Use environment variables for secrets
- Monitor Render logs for suspicious activity

## Cost Estimate

**Free Tier:**
- Cost: $0/month
- Good for: Testing, personal use
- Limitation: Spins down after inactivity

**Starter Tier:**
- Cost: $7/month
- Good for: Production, multiple users
- Benefit: Always running, faster

## Next Steps

1. ✅ Deploy proxy to Render
2. ✅ Update frontend with proxy URL
3. ✅ Test attendance fetching
4. ✅ Deploy frontend to Vercel
5. 🎉 Done!

## Support

If you encounter issues:
1. Check Render logs
2. Test proxy health endpoint
3. Verify frontend is using correct URL
4. Check browser console for errors

---

**Congratulations!** 🎉 Your attendance system should now work in production!

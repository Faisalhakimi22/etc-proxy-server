# ETC Proxy Server

Proxy server for IMS University ETC Portal to handle CORS and enable attendance fetching.

## Deploy to Render.com

### Step 1: Push to GitHub

1. Create a new GitHub repository (e.g., `etc-proxy-server`)
2. Initialize git and push:

```bash
cd etc-proxy-server
git init
git add .
git commit -m "Initial commit: ETC proxy server"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/etc-proxy-server.git
git push -u origin main
```

### Step 2: Deploy on Render.com

1. Go to [render.com](https://render.com) and sign up/login
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `etc-proxy-server` (or any name you prefer)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (or choose paid for better performance)
5. Click **"Create Web Service"**

### Step 3: Get Your Proxy URL

After deployment completes, Render will give you a URL like:
```
https://etc-proxy-server.onrender.com
```

### Step 4: Update Your Frontend

Update `src/components/AttendancePortalFrame.tsx`:

```typescript
const PROXY_URL = 'https://etc-proxy-server.onrender.com/proxy';
```

Replace all fetch calls from `/api/etc` to use the new proxy URL:

```typescript
// Before
const response = await fetch('/api/etc', { ... });

// After
const response = await fetch('https://etc-proxy-server.onrender.com/proxy', { ... });
```

## Testing Locally

```bash
npm install
npm start
```

Server will run on `http://localhost:3001`

Test the health endpoint:
```bash
curl http://localhost:3001/health
```

## Environment Variables (Optional)

You can set these on Render.com dashboard:

- `PORT` - Port number (Render sets this automatically)
- `NODE_ENV` - Set to `production`

## Notes

- Free tier on Render may spin down after inactivity (takes ~30s to wake up)
- Consider upgrading to paid tier for production use
- Monitor logs on Render dashboard for debugging

# ETC Proxy Server

A CORS proxy server for the IMS ETC Portal (etc.imsciences.edu.pk).

## Purpose

This proxy server solves CORS (Cross-Origin Resource Sharing) issues when accessing the ETC portal from a web application. It acts as an intermediary between your frontend and the ETC portal.

## Features

- ✅ Handles CORS headers automatically
- ✅ Forwards cookies for session management
- ✅ Supports both GET and POST requests
- ✅ Works on Cloudflare Workers (serverless)
- ✅ Also supports Node.js/Express deployment
- ✅ Health check endpoint
- ✅ Request/response logging

## Quick Start - Cloudflare Workers (Recommended)

### 1. Login to Cloudflare

```bash
npx wrangler login
```

### 2. Deploy

**Windows:**
```bash
deploy-cloudflare.bat
```

**Mac/Linux:**
```bash
npx wrangler deploy
```

### 3. Get Your URL

After deployment, copy your Workers URL:
```
https://etc-proxy-server.YOUR-SUBDOMAIN.workers.dev
```

### 4. Update Your Frontend

In `src/components/AttendancePortalFrame.tsx`, update the proxy URL:

```typescript
const PORTAL_URL = 'https://etc-proxy-server.YOUR-SUBDOMAIN.workers.dev/proxy';
```

**See [CLOUDFLARE_DEPLOY.md](./CLOUDFLARE_DEPLOY.md) for detailed instructions.**

## Alternative: Node.js Deployment

You can also deploy the Express server (`server.js`) to:
- Render.com
- Railway.app
- Heroku
- Any Node.js hosting

**See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for Render.com instructions.**

## Files

- `worker.js` - Cloudflare Workers script (serverless)
- `wrangler.toml` - Cloudflare Workers configuration
- `server.js` - Node.js Express server (traditional hosting)
- `package.json` - Node.js dependencies
- `deploy-cloudflare.bat` - Windows deployment script
- `CLOUDFLARE_DEPLOY.md` - Cloudflare deployment guide
- `DEPLOYMENT_GUIDE.md` - Render.com deployment guide

## Local Development (Node.js)

### Prerequisites
- Node.js 18 or higher
- npm

### Installation

```bash
npm install
```

### Running Locally

```bash
npm start
```

Server will start on `http://localhost:3001`

### Testing

Health check:
```bash
curl http://localhost:3001/health
```

Proxy test:
```bash
curl http://localhost:3001/proxy
```

## API Endpoints

### Health Check
```
GET /health
GET /
```

Returns server status and timestamp.

### Proxy Endpoint
```
GET/POST /proxy/*
```

Proxies requests to the ETC portal. All paths after `/proxy/` are forwarded to `https://etc.imsciences.edu.pk/`.

Example:
- Request: `https://your-worker.workers.dev/proxy/kiosk/StudentSubjects`
- Proxied to: `https://etc.imsciences.edu.pk/kiosk/StudentSubjects`

## Cloudflare Workers Benefits

- ✅ **Free tier**: 100,000 requests/day
- ✅ **No cold starts**: Always fast
- ✅ **Global edge network**: Fast worldwide
- ✅ **Auto-scaling**: Handles traffic spikes
- ✅ **Free SSL/HTTPS**: Secure by default
- ✅ **Easy deployment**: One command

## Security

- No data is stored or logged permanently
- All requests are proxied in real-time
- Credentials are never saved
- CORS is configured to allow all origins
- Runs on Cloudflare's secure edge network

## Troubleshooting

### Cloudflare deployment fails

1. Make sure you're logged in: `npx wrangler login`
2. Check `wrangler.toml` exists
3. Check `worker.js` exists
4. Try manual deploy: `npx wrangler deploy`

### CORS errors in browser

Make sure you're using the correct URL format:
```
https://your-worker.workers.dev/proxy
```

Note the `/proxy` at the end!

### 404 errors

Wait 1-2 minutes after deployment for DNS propagation.

## License

MIT

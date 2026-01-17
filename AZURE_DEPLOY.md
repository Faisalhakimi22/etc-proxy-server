# Deploy ETC Proxy Server to Azure App Service

## Prerequisites

1. **Azure Account** (free tier available)
   - Sign up at: https://azure.microsoft.com/free/
   - Get $200 free credit for 30 days

2. **Azure CLI** (optional, for command-line deployment)
   - Install: https://docs.microsoft.com/cli/azure/install-azure-cli

## Method 1: Deploy via Azure Portal (Easiest)

### Step 1: Create App Service

1. Go to [Azure Portal](https://portal.azure.com)
2. Click **"Create a resource"**
3. Search for **"Web App"** and click **Create**

### Step 2: Configure App Service

Fill in these settings:

**Basics:**
- **Subscription**: Your subscription
- **Resource Group**: Create new → `etc-proxy-rg`
- **Name**: `etc-proxy-server` (must be globally unique, try `etc-proxy-yourname`)
- **Publish**: `Code`
- **Runtime stack**: `Node 18 LTS` or `Node 20 LTS`
- **Operating System**: `Linux`
- **Region**: Choose closest to Pakistan:
  - `Southeast Asia` (Singapore) - Best for Pakistan
  - `Central India` (Pune)
  - `UAE North` (Dubai)

**Pricing:**
- **Pricing plan**: `Free F1` (free tier) or `Basic B1` ($13/month for better performance)

Click **"Review + Create"** → **"Create"**

Wait 2-3 minutes for deployment.

### Step 3: Configure Deployment

1. Go to your App Service
2. Click **"Deployment Center"** (left menu)
3. Choose **"GitHub"**
4. Click **"Authorize"** and sign in to GitHub
5. Select:
   - **Organization**: Your GitHub username
   - **Repository**: `etc-proxy-server`
   - **Branch**: `main`
6. Click **"Save"**

Azure will automatically deploy from GitHub!

### Step 4: Get Your URL

After deployment completes (2-3 minutes):

1. Go to **"Overview"** tab
2. Copy your URL: `https://etc-proxy-server.azurewebsites.net`

### Step 5: Test Your Proxy

Open in browser:
```
https://etc-proxy-server.azurewebsites.net/health
```

Should return:
```json
{
  "status": "ok",
  "timestamp": "2026-01-17T..."
}
```

Test the proxy:
```
https://etc-proxy-server.azurewebsites.net/proxy
```

Should load the ETC portal login page.

## Method 2: Deploy via Azure CLI (Advanced)

### Step 1: Login to Azure

```bash
az login
```

### Step 2: Create Resource Group

```bash
az group create --name etc-proxy-rg --location southeastasia
```

### Step 3: Create App Service Plan

**Free tier:**
```bash
az appservice plan create \
  --name etc-proxy-plan \
  --resource-group etc-proxy-rg \
  --sku FREE \
  --is-linux
```

**Or Basic tier (better performance):**
```bash
az appservice plan create \
  --name etc-proxy-plan \
  --resource-group etc-proxy-rg \
  --sku B1 \
  --is-linux
```

### Step 4: Create Web App

```bash
az webapp create \
  --name etc-proxy-server \
  --resource-group etc-proxy-rg \
  --plan etc-proxy-plan \
  --runtime "NODE:18-lts"
```

### Step 5: Configure GitHub Deployment

```bash
az webapp deployment source config \
  --name etc-proxy-server \
  --resource-group etc-proxy-rg \
  --repo-url https://github.com/YOUR_USERNAME/etc-proxy-server \
  --branch main \
  --manual-integration
```

### Step 6: Set Environment Variables (Optional)

```bash
az webapp config appsettings set \
  --name etc-proxy-server \
  --resource-group etc-proxy-rg \
  --settings NODE_ENV=production
```

## Update Your Frontend

After deployment, update `src/components/AttendancePortalFrame.tsx`:

```typescript
const AZURE_PROXY = 'https://etc-proxy-server.azurewebsites.net/proxy';
const VERCEL_PROXY = '/api/etc-proxy';
const LOCAL_PROXY = '/api/etc';
const isDev = import.meta.env.DEV;

// Try Azure first (better connectivity), fallback to Vercel
const PORTAL_URL = isDev ? LOCAL_PROXY : AZURE_PROXY;
```

## Configuration Options

### Custom Domain (Optional)

1. Go to your App Service
2. Click **"Custom domains"**
3. Click **"Add custom domain"**
4. Follow instructions to add your domain

### SSL Certificate (Free with Azure)

Azure provides free SSL certificates for:
- `*.azurewebsites.net` domains (automatic)
- Custom domains (via Let's Encrypt)

### Environment Variables

Set via Portal:
1. Go to **"Configuration"**
2. Click **"New application setting"**
3. Add variables like `PORT`, `NODE_ENV`, etc.

### Scaling

**Vertical scaling** (more power):
1. Go to **"Scale up (App Service plan)"**
2. Choose a higher tier

**Horizontal scaling** (more instances):
1. Go to **"Scale out (App Service plan)"**
2. Increase instance count

## Monitoring

### View Logs

**Via Portal:**
1. Go to **"Log stream"** (left menu)
2. Watch real-time logs

**Via CLI:**
```bash
az webapp log tail \
  --name etc-proxy-server \
  --resource-group etc-proxy-rg
```

### Enable Application Insights (Optional)

1. Go to **"Application Insights"**
2. Click **"Turn on Application Insights"**
3. Get detailed performance metrics

## Troubleshooting

### App not starting

Check logs:
```bash
az webapp log tail --name etc-proxy-server --resource-group etc-proxy-rg
```

### Port issues

Azure automatically sets `PORT` environment variable. Your `server.js` already handles this:
```javascript
const PORT = process.env.PORT || 3001;
```

### Deployment failed

1. Check GitHub Actions tab in your repo
2. View deployment logs in Azure Portal → Deployment Center

### 502/503 errors

- App is starting (wait 30 seconds)
- Check if `package.json` has correct `start` script
- Verify Node.js version matches

## Cost Estimate

**Free Tier (F1):**
- Cost: $0/month
- 60 CPU minutes/day
- 1 GB RAM
- 1 GB storage
- Good for: Testing, low traffic

**Basic Tier (B1):**
- Cost: ~$13/month
- Always on
- 1.75 GB RAM
- 10 GB storage
- Good for: Production, medium traffic

**Standard Tier (S1):**
- Cost: ~$70/month
- Auto-scaling
- 1.75 GB RAM
- 50 GB storage
- Good for: High traffic, multiple apps

## Advantages of Azure

✅ **Better connectivity** to Pakistan/Asia
✅ **Less likely to be blocked** than Cloudflare
✅ **Free tier** available
✅ **Auto-deployment** from GitHub
✅ **Built-in monitoring** and logs
✅ **Easy scaling** when needed
✅ **Free SSL** certificates

## Next Steps

1. ✅ Deploy to Azure App Service
2. ✅ Get your Azure URL
3. ✅ Update frontend to use Azure proxy
4. ✅ Test attendance feature
5. ✅ Monitor logs and performance
6. 🎉 Done!

---

**Need help?** Check Azure documentation: https://docs.microsoft.com/azure/app-service/

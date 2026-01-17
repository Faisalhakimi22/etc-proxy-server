@echo off
echo ========================================
echo   ETC Proxy Server - Cloudflare Deploy
echo ========================================
echo.

REM Check if wrangler is available
where npx >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: npm/npx not found!
    echo Please install Node.js first: https://nodejs.org
    pause
    exit /b 1
)

echo [1/3] Checking configuration...
if not exist "wrangler.toml" (
    echo ERROR: wrangler.toml not found!
    pause
    exit /b 1
)

if not exist "worker.js" (
    echo ERROR: worker.js not found!
    pause
    exit /b 1
)

echo [2/3] Deploying to Cloudflare Workers...
echo.
npx wrangler deploy

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ========================================
    echo   Deployment Failed!
    echo ========================================
    echo.
    echo Common issues:
    echo 1. Not logged in: Run "npx wrangler login"
    echo 2. Invalid config: Check wrangler.toml
    echo 3. Network issues: Check your internet
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Deployment Successful!
echo ========================================
echo.
echo Your proxy server is now live at:
echo https://etc-proxy-server.YOUR-SUBDOMAIN.workers.dev
echo.
echo Next steps:
echo 1. Copy your Workers URL from above
echo 2. Update src/components/AttendancePortalFrame.tsx
echo 3. Replace PORTAL_URL with your Workers URL
echo.
pause

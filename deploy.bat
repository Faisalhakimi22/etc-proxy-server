@echo off
echo Initializing Git repository...
git init

echo Adding files...
git add .

echo Committing files...
git commit -m "Initial commit: ETC proxy server"

echo Setting main branch...
git branch -M main

echo Adding remote origin...
git remote add origin https://github.com/Faisalhakimi22/etc-proxy-server.git

echo Pushing to GitHub...
git push -u origin main

echo.
echo Done! Repository pushed to GitHub.
pause

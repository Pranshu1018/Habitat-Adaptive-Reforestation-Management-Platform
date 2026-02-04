@echo off
echo.
echo 🚀 Opening Everything...
echo.

REM Open dashboard in default browser
echo 📊 Opening Dashboard...
start http://localhost:8082/dashboard

REM Wait a moment
timeout /t 2 /nobreak >nul

REM Open backend health check in browser
echo 🔍 Opening Backend Health Check...
start http://localhost:3001/health

REM Wait a moment
timeout /t 1 /nobreak >nul

REM Open management API test in browser
echo 📈 Opening Management API Test...
start "http://localhost:3001/api/management/dashboard?lat=28.6139&lon=77.2090"

echo.
echo ✅ All pages opened!
echo.
echo 📋 What you should see:
echo    1. Dashboard with GREEN BANNER at top
echo    2. Backend health check showing "healthy"
echo    3. Management API showing JSON data
echo.
echo 🔍 Press F12 in dashboard to see console logs
echo.
pause

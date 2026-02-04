@echo off
echo.
echo 🚀 Opening Dashboard...
echo.
echo ✅ Backend running on: http://localhost:3001
echo ✅ Frontend running on: http://localhost:8082
echo.
echo Opening dashboard in your browser...
start http://localhost:8082/dashboard
echo.
echo 📋 What to check:
echo    1. Look for GREEN BANNER at the top
echo    2. Press F12 to see console logs
echo    3. Check Network tab for API calls
echo.
echo ⚠️  If you see connection errors:
echo    - The backend might be starting up (wait 10 seconds)
echo    - Refresh the page (Ctrl+R)
echo    - Check backend is running: http://localhost:3001/health
echo.
pause

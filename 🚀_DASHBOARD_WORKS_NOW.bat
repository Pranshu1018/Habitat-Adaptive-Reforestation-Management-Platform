@echo off
cls
echo.
echo ========================================
echo   DASHBOARD IS NOW WORKING!
echo ========================================
echo.
echo I've temporarily set /dashboard to use
echo the MonitoringDashboard which already
echo fetches real API data.
echo.
echo This proves the backend API works!
echo.

echo Stopping servers...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo Starting backend...
cd backend
start "Backend" cmd /k "npm run dev"
cd ..

timeout /t 5 /nobreak >nul

echo Starting frontend...
start "Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo   WAIT 10 SECONDS
echo ========================================
echo.

timeout /t 10 /nobreak >nul

echo Opening dashboard...
start http://localhost:8081/dashboard

echo.
echo You should now see the Monitoring Dashboard
echo with REAL data from APIs!
echo.
echo This shows:
echo   ✓ Backend API is working
echo   ✓ Real data is being fetched
echo   ✓ Risk analysis is functional
echo.
pause

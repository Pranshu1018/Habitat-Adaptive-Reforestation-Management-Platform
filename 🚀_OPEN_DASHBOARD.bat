@echo off
cls
echo.
echo ========================================
echo   MANAGEMENT DASHBOARD - QUICK START
echo ========================================
echo.
echo Step 1: Checking if backend is running...
curl -s http://localhost:3001/health >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Backend is NOT running!
    echo.
    echo Starting backend now...
    cd backend
    start "Backend Server" cmd /k "npm run dev"
    cd ..
    echo.
    echo ⏳ Waiting 10 seconds for backend to start...
    timeout /t 10 /nobreak >nul
) else (
    echo ✅ Backend is running!
)

echo.
echo Step 2: Checking if frontend is running...
curl -s http://localhost:5173 >nul 2>&1
if %errorlevel% neq 0 (
    curl -s http://localhost:8081 >nul 2>&1
    if %errorlevel% neq 0 (
        echo ❌ Frontend is NOT running!
        echo.
        echo Starting frontend now...
        start "Frontend Server" cmd /k "npm run dev"
        echo.
        echo ⏳ Waiting 10 seconds for frontend to start...
        timeout /t 10 /nobreak >nul
    ) else (
        echo ✅ Frontend is running on port 8081!
    )
) else (
    echo ✅ Frontend is running on port 5173!
)

echo.
echo Step 3: Testing dashboard API...
curl -s "http://localhost:3001/api/management/dashboard?lat=28.6139&lon=77.2090" >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Dashboard API not responding!
    echo    Make sure backend restarted after adding new routes.
    echo.
    echo    Run: restart-backend.bat
    echo.
    pause
    exit /b 1
) else (
    echo ✅ Dashboard API is working!
)

echo.
echo ========================================
echo   🎉 EVERYTHING IS READY!
echo ========================================
echo.
echo Opening Management Dashboard in browser...
echo.

timeout /t 2 /nobreak >nul

start http://localhost:8081/dashboard

echo.
echo Dashboard opened at: http://localhost:8081/dashboard
echo.
echo You should see:
echo   ✓ 4 metric cards (Health, Risk, Vegetation, Soil)
echo   ✓ Active alerts section
echo   ✓ 4 tabs (Overview, Risk Analysis, Risk Zones, Weather)
echo   ✓ Real data from APIs
echo.
echo If you see a blank page:
echo   1. Check browser console (F12)
echo   2. Make sure you restarted backend
echo   3. Try: restart-everything.bat
echo.
echo ========================================
pause

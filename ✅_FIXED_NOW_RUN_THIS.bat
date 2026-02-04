@echo off
cls
echo.
echo ========================================
echo   DASHBOARD EXPORT FIXED!
echo ========================================
echo.
echo The ManagementDashboard.tsx file has been recreated.
echo Now restarting servers...
echo.

echo Step 1: Stopping all Node processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo Step 2: Clearing Vite cache...
if exist node_modules\.vite rmdir /s /q node_modules\.vite 2>nul
if exist .vite rmdir /s /q .vite 2>nul

echo Step 3: Starting backend...
cd backend
start "Backend Server" cmd /k "npm run dev"
cd ..

echo Waiting for backend to start...
timeout /t 7 /nobreak >nul

echo Step 4: Starting frontend...
start "Frontend Server" cmd /k "npm run dev"

echo.
echo ========================================
echo   SERVERS STARTING!
echo ========================================
echo.
echo Wait 10 seconds, then open:
echo http://localhost:8081/dashboard
echo.
echo You should now see:
echo   ✓ 4 metric cards at the top
echo   ✓ Active alerts section
echo   ✓ 4 tabs (Overview, Risk Analysis, Risk Zones, Weather)
echo   ✓ Real data from APIs
echo   ✓ Animated progress bars
echo.
timeout /t 10 /nobreak >nul

echo Opening dashboard...
start http://localhost:8081/dashboard

echo.
echo ========================================
pause

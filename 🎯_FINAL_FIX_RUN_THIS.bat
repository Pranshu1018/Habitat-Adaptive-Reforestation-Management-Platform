@echo off
cls
echo.
echo ========================================
echo   FINAL FIX - Export Pattern Corrected
echo ========================================
echo.

echo Stopping all Node processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo Clearing ALL caches...
if exist node_modules\.vite rmdir /s /q node_modules\.vite 2>nul
if exist .vite rmdir /s /q .vite 2>nul
if exist dist rmdir /s /q dist 2>nul

echo Starting backend...
cd backend
start "Backend" cmd /k "npm run dev"
cd ..

timeout /t 7 /nobreak >nul

echo Starting frontend...
start "Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo   WAIT 15 SECONDS
echo ========================================
echo.
echo The export pattern has been fixed to match
echo the working MonitoringDashboard component.
echo.
echo After 15 seconds, open:
echo http://localhost:8081/dashboard
echo.

timeout /t 15 /nobreak >nul

start http://localhost:8081/dashboard

echo.
echo Dashboard should now load!
echo.
pause

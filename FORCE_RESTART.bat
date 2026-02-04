@echo off
cls
echo.
echo ========================================
echo   FORCE COMPLETE RESTART
echo ========================================
echo.

echo Step 1: Killing ALL Node processes...
taskkill /F /IM node.exe 2>nul
taskkill /F /IM npm.cmd 2>nul
timeout /t 3 /nobreak >nul

echo Step 2: Clearing ALL caches...
if exist node_modules\.vite (
    echo Deleting frontend Vite cache...
    rmdir /s /q node_modules\.vite
)
if exist .vite (
    echo Deleting .vite folder...
    rmdir /s /q .vite
)
if exist dist (
    echo Deleting dist folder...
    rmdir /s /q dist
)

echo Step 3: Starting backend...
cd backend
start "BACKEND SERVER" cmd /k "echo Starting backend... && npm run dev"
cd ..

echo Waiting 8 seconds for backend...
timeout /t 8 /nobreak >nul

echo Step 4: Starting frontend...
start "FRONTEND SERVER" cmd /k "echo Starting frontend... && npm run dev"

echo.
echo ========================================
echo   WAITING FOR SERVERS TO START
echo ========================================
echo.
echo Backend: Starting on port 3001
echo Frontend: Starting on port 5173 or 8081
echo.
echo Please wait 15 seconds...
echo.

timeout /t 15 /nobreak >nul

echo Opening dashboard...
start http://localhost:8081/dashboard

echo.
echo ========================================
echo   DASHBOARD OPENED
echo ========================================
echo.
echo If you still don't see changes:
echo 1. Press Ctrl+Shift+R in browser (hard refresh)
echo 2. Or open in incognito mode
echo 3. Check browser console (F12) for errors
echo.
echo Backend logs should show:
echo   "Fetching management dashboard data..."
echo.
pause

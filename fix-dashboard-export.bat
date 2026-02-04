@echo off
echo ========================================
echo Fixing Dashboard Export Issue
echo ========================================
echo.

echo Step 1: Stopping all Node processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo Step 2: Clearing Vite cache...
if exist node_modules\.vite rmdir /s /q node_modules\.vite
if exist .vite rmdir /s /q .vite

echo Step 3: Starting backend...
cd backend
start "Backend" cmd /k "npm run dev"
cd ..

echo Waiting for backend...
timeout /t 5 /nobreak >nul

echo Step 4: Starting frontend...
start "Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo Servers restarting with cleared cache
echo ========================================
echo.
echo Wait 10 seconds, then open:
echo http://localhost:8081/dashboard
echo.
pause

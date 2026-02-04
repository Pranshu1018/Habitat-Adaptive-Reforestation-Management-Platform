@echo off
echo ========================================
echo Restarting Everything
echo ========================================
echo.

echo Step 1: Killing existing Node processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo Step 2: Starting backend...
cd backend
start cmd /k "npm run dev"
cd ..

echo Waiting for backend to start...
timeout /t 5 /nobreak >nul

echo Step 3: Starting frontend...
start cmd /k "npm run dev"

echo.
echo ========================================
echo Both servers starting!
echo ========================================
echo.
echo Backend: http://localhost:3001
echo Frontend: http://localhost:5173 or http://localhost:8081
echo.
echo Wait 10 seconds, then open:
echo http://localhost:8081/dashboard
echo.
pause

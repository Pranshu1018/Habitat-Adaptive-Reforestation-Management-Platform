@echo off
echo.
echo 🚀 Starting Habitat Platform...
echo.

REM Start backend in a new window
echo Starting backend...
start "Backend Server" cmd /k "cd backend && npm run dev"

REM Wait for backend to start
timeout /t 5 /nobreak >nul

REM Start frontend in a new window
echo Starting frontend...
start "Frontend Server" cmd /k "npm run dev"

REM Wait for frontend to start
timeout /t 8 /nobreak >nul

echo.
echo ✅ Servers should be starting...
echo.
echo 📊 Backend will be on: http://localhost:3001
echo 🌐 Frontend will be on: http://localhost:8082 (or 8083)
echo.
echo Opening dashboard in 3 seconds...
timeout /t 3 /nobreak >nul

REM Try different ports
start http://localhost:8082/dashboard
timeout /t 2 /nobreak >nul
start http://localhost:8083/dashboard

echo.
echo ✅ Dashboard opened!
echo.
echo 🔍 Look for:
echo    - 3 colored dots on each region card (top-right)
echo    - Color legend in bottom-left corner
echo    - Green banner at top
echo.
echo ⚠️  DO NOT CLOSE the Backend and Frontend terminal windows!
echo.
pause

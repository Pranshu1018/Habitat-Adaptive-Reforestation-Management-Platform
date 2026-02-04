@echo off
echo.
echo 🔍 Checking if backend is running...
echo.

REM Test if backend is responding
curl -s http://localhost:3001/health >nul 2>&1

if %ERRORLEVEL% EQU 0 (
    echo ✅ Backend is already running on port 3001
    echo.
    echo Testing management API...
    curl "http://localhost:3001/api/management/dashboard?lat=28.6139&lon=77.2090"
    echo.
    pause
    exit /b 0
)

echo ❌ Backend is NOT running
echo.
echo 🚀 Starting backend now...
echo.

cd backend
start "Habitat Backend" cmd /k npm run dev

echo.
echo ⏳ Waiting 5 seconds for backend to start...
timeout /t 5 /nobreak >nul

echo.
echo 🧪 Testing backend health...
curl http://localhost:3001/health

echo.
echo.
echo ✅ Backend should now be running!
echo.
echo 📊 Backend API: http://localhost:3001
echo 🧪 Test management API: http://localhost:3001/api/management/dashboard?lat=28.6139^&lon=77.2090
echo.
echo Now refresh your browser at http://localhost:5173/dashboard
echo.
pause

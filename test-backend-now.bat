@echo off
echo.
echo 🧪 Testing Backend API...
echo.

echo 1. Testing Health Endpoint...
curl -s http://localhost:3001/health
echo.
echo.

echo 2. Testing Management Dashboard API...
echo    (This will show a lot of JSON data)
echo.
curl -s "http://localhost:3001/api/management/dashboard?lat=28.6139&lon=77.2090"
echo.
echo.

echo ✅ If you see JSON data above, backend is working!
echo.
echo Now open your browser at: http://localhost:5173/dashboard
echo And press F12 to see console logs
echo.
pause

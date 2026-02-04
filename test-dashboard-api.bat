@echo off
echo ========================================
echo Testing Management Dashboard API
echo ========================================
echo.

echo Testing if backend is running...
curl -s http://localhost:3001/health
echo.
echo.

echo Fetching dashboard data for Delhi...
curl -s "http://localhost:3001/api/management/dashboard?lat=28.6139&lon=77.2090"
echo.
echo.

echo ========================================
echo If you see JSON data above, API is working!
echo Now open: http://localhost:8081/dashboard
echo ========================================
pause

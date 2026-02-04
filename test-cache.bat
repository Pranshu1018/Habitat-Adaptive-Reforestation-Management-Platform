@echo off
echo ========================================
echo Testing API Cache Behavior
echo ========================================
echo.

echo Step 1: Testing Weather API (Delhi)
echo First call - should fetch from API...
curl -s "http://localhost:3001/api/weather/current?lat=28.6139&lon=77.2090" | findstr "cached"
echo.

timeout /t 2 /nobreak >nul

echo Second call - should return from cache...
curl -s "http://localhost:3001/api/weather/current?lat=28.6139&lon=77.2090" | findstr "cached"
echo.

timeout /t 2 /nobreak >nul

echo Third call with nocache=true - should fetch from API...
curl -s "http://localhost:3001/api/weather/current?lat=28.6139&lon=77.2090&nocache=true" | findstr "cached"
echo.

timeout /t 2 /nobreak >nul

echo Step 2: Testing Different Location (Mumbai)
echo Should fetch from API...
curl -s "http://localhost:3001/api/weather/current?lat=19.0760&lon=72.8777" | findstr "cached"
echo.

timeout /t 2 /nobreak >nul

echo Step 3: Cache Statistics
echo.
curl -s "http://localhost:3001/api/weather/cache/stats"
echo.
echo.

echo ========================================
echo Test Complete!
echo Check backend console for detailed logs
echo ========================================
pause

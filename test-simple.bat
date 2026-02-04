@echo off
echo.
echo ========================================
echo Simple API Test (Browser-Based)
echo ========================================
echo.
echo Make sure backend is running on port 3001!
echo.
echo Opening test URLs in browser...
echo.

timeout /t 2 /nobreak >nul

echo Testing Health Check...
start http://localhost:3001/health

timeout /t 1 /nobreak >nul

echo Testing Weather API...
start http://localhost:3001/api/weather/current?lat=14.0^&lon=75.5

timeout /t 1 /nobreak >nul

echo Testing Climate API (NASA POWER - FREE)...
start http://localhost:3001/api/climate/historical?lat=14.0^&lon=75.5

timeout /t 1 /nobreak >nul

echo Testing Soil API (SoilGrids - FREE)...
start http://localhost:3001/api/soil/detailed?lat=14.0^&lon=75.5

echo.
echo ========================================
echo Check your browser tabs!
echo ========================================
echo.
echo If you see JSON data in each tab, APIs are working!
echo.
echo Expected results:
echo   - Health: {"status":"healthy",...}
echo   - Weather: Real weather data
echo   - Climate: Historical climate data
echo   - Soil: Soil properties
echo.
pause

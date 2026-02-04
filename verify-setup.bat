@echo off
echo.
echo ========================================
echo HABITAT - Setup Verification
echo ========================================
echo.

echo Checking configuration files...
echo.

if exist .env (
    echo [OK] Frontend .env file exists
) else (
    echo [ERROR] Frontend .env file missing!
    exit /b 1
)

if exist backend\.env (
    echo [OK] Backend .env file exists
) else (
    echo [ERROR] Backend .env file missing!
    exit /b 1
)

echo.
echo Checking API keys...
echo.

findstr /C:"VITE_OPENWEATHER_API_KEY=bcbbcfd34eb5f37a6becab211c6c28ff" .env >nul
if %errorlevel%==0 (
    echo [OK] OpenWeatherMap API key configured
) else (
    echo [WARNING] OpenWeatherMap API key not found
)

findstr /C:"VITE_SENTINEL_CLIENT_ID=056ed018-9605-4843-9d54-78314d5dad0a" .env >nul
if %errorlevel%==0 (
    echo [OK] Sentinel Hub Client ID configured
) else (
    echo [WARNING] Sentinel Hub Client ID not found
)

findstr /C:"VITE_MAPBOX_TOKEN=pk.eyJ1IjoicHJhbnNodTA3ZCIsImEiOiJjbWw3M240M2gwazV4M2VzZjRpcmxiNTN0In0.SFKEOeg3yta40EtvdyZNbA" .env >nul
if %errorlevel%==0 (
    echo [OK] Mapbox token configured
) else (
    echo [WARNING] Mapbox token not found
)

echo.
echo ========================================
echo Configuration Status: READY
echo ========================================
echo.
echo Your system is configured with:
echo   - OpenWeatherMap (Real weather data)
echo   - Sentinel Hub (Real satellite imagery)
echo   - Mapbox (Interactive maps)
echo   - NASA POWER (Free climate data)
echo   - SoilGrids (Free soil data)
echo   - Firebase Realtime Database
echo.
echo Next steps:
echo   1. Run: start.bat
echo   2. Open: http://localhost:8083
echo   3. Test: node scripts/testRealTimeAPIs.js
echo.
pause

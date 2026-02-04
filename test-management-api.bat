@echo off
echo.
echo ========================================
echo   Testing Management API
echo ========================================
echo.

echo Testing backend health...
curl -s http://localhost:3001/health
echo.
echo.

echo Testing management dashboard API...
echo Location: Delhi (28.6139, 77.2090)
echo.
curl -s "http://localhost:3001/api/management/dashboard?lat=28.6139&lon=77.2090"
echo.
echo.

echo ========================================
echo.
echo If you see JSON data above with:
echo   - overallHealth
echo   - riskAssessment
echo   - vegetationHealth
echo   - soilQuality
echo.
echo Then the backend API is working!
echo.
echo If you see "Failed to fetch" or errors,
echo the backend is not running.
echo.
echo Run: FORCE_RESTART.bat
echo.
pause

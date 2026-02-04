@echo off
echo Testing Python Site Analyzer with Real APIs
echo ============================================
echo.
echo Test 1: Western Ghats, Karnataka (14.0, 75.5)
echo Fetching real data from OpenWeatherMap, SoilGrids...
python backend\site_analyzer_with_apis.py 14.0 75.5
echo.
echo ============================================
echo.
echo Test 2: Aravalli Range, Rajasthan (25.5, 73.0)
echo Fetching real data from APIs...
python backend\site_analyzer_with_apis.py 25.5 73.0
echo.
echo ============================================
pause

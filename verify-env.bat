@echo off
echo ========================================
echo Verifying Environment Variables
echo ========================================
echo.

echo Checking backend/.env file...
if exist backend\.env (
    echo   ✓ backend/.env exists
    echo.
    echo Contents:
    type backend\.env | findstr /V "^#" | findstr /V "^$"
) else (
    echo   ✗ backend/.env NOT FOUND!
    echo.
    echo Please create backend/.env with:
    echo   OPENWEATHER_API_KEY=bcbbcfd34eb5f37a6becab211c6c28ff
)

echo.
echo ========================================
echo.
echo To test if backend loads the API key:
echo   1. Start backend: cd backend ^&^& npm run dev
echo   2. Look for: "🔑 API Keys Status"
echo   3. Should show: "OpenWeather: ✓ Loaded"
echo.
pause

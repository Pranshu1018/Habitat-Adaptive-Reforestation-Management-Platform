@echo off
echo.
echo ========================================
echo Testing All Real-Time APIs
echo ========================================
echo.
echo Checking dependencies...
echo.

REM Check if node_modules exists in root
if not exist "node_modules\dotenv" (
    echo Installing required packages...
    call npm install dotenv axios
    echo.
)

echo Make sure backend is running on port 3001!
echo.
echo Starting tests...
echo.
node scripts/testRealTimeAPIs.js
echo.
pause

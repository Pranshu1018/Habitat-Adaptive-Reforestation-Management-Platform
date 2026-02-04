@echo off
echo ========================================
echo Restarting Habitat Backend
echo ========================================
echo.

echo Step 1: Killing existing Node processes...
taskkill /F /IM node.exe 2>nul
if %errorlevel% equ 0 (
    echo   ✓ Node processes killed
) else (
    echo   ℹ No Node processes found
)
echo.

echo Step 2: Waiting 2 seconds...
timeout /t 2 /nobreak >nul
echo.

echo Step 3: Starting backend...
cd backend
start cmd /k "npm run dev"
cd ..
echo   ✓ Backend starting in new window
echo.

echo ========================================
echo Backend should now be running on port 3001
echo Check the new window for status
echo ========================================
pause

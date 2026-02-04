@echo off
echo.
echo ========================================
echo Killing all Node.js processes...
echo ========================================
echo.
taskkill /F /IM node.exe 2>nul
if %errorlevel% equ 0 (
    echo [OK] All Node.js processes stopped.
) else (
    echo [INFO] No Node.js processes were running.
)
echo.
echo Port 3001 is now free!
echo.
echo You can now run: start.bat
echo.
pause

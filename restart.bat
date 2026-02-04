@echo off
echo.
echo 🔄 Restarting Habitat Platform...
echo.

REM Kill all Node processes
echo 🛑 Stopping all Node processes...
taskkill /F /IM node.exe >nul 2>&1

REM Wait a moment
timeout /t 2 /nobreak >nul

REM Start the application
echo.
echo 🚀 Starting fresh...
echo.
call start.bat

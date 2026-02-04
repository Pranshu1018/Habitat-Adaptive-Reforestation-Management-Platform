@echo off
echo Killing all Node.js processes...
taskkill /F /IM node.exe 2>nul
if %errorlevel% equ 0 (
    echo Node.js processes killed successfully!
) else (
    echo No Node.js processes found.
)
echo.
echo You can now restart the backend with:
echo   cd backend
echo   npm run dev
echo.
pause

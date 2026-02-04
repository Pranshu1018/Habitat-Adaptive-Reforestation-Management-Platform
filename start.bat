@echo off
REM Habitat Platform Startup Script for Windows

echo.
echo 🌳 Starting Habitat Platform...
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

echo ✅ Node.js is installed
echo.

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd backend
if not exist "node_modules" (
    call npm install
)

REM Check backend .env
if not exist ".env" (
    echo ⚠️  Backend .env not found. Copying from .env.example...
    copy .env.example .env
    echo 📝 Please edit backend\.env and add your API keys
)

REM Start backend
echo 🚀 Starting backend server...
start "Habitat Backend" cmd /k npm run dev

cd ..

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
if not exist "node_modules" (
    call npm install
)

REM Check frontend .env
if not exist ".env" (
    echo ⚠️  Frontend .env not found. Copying from .env.example...
    copy .env.example .env
)

REM Wait for backend to start
echo ⏳ Waiting for backend to start...
timeout /t 3 /nobreak >nul

REM Start frontend
echo 🚀 Starting frontend...
start "Habitat Frontend" cmd /k npm run dev

echo.
echo ✅ Habitat Platform is running!
echo.
echo 📊 Backend:  http://localhost:3001
echo 🌐 Frontend: http://localhost:5173
echo.
echo Press any key to exit...
pause >nul

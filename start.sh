#!/bin/bash

# Habitat Platform Startup Script

echo "🌳 Starting Habitat Platform..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
if [ ! -d "node_modules" ]; then
    npm install
fi

# Check backend .env
if [ ! -f ".env" ]; then
    echo "⚠️  Backend .env not found. Copying from .env.example..."
    cp .env.example .env
    echo "📝 Please edit backend/.env and add your API keys"
fi

# Start backend
echo "🚀 Starting backend server..."
npm run dev &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
if [ ! -d "node_modules" ]; then
    npm install
fi

# Check frontend .env
if [ ! -f ".env" ]; then
    echo "⚠️  Frontend .env not found. Copying from .env.example..."
    cp .env.example .env
fi

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 3

# Start frontend
echo "🚀 Starting frontend..."
npm run dev &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"

echo ""
echo "✅ Habitat Platform is running!"
echo ""
echo "📊 Backend:  http://localhost:3001"
echo "🌐 Frontend: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for user interrupt
trap "echo ''; echo '🛑 Stopping services...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait

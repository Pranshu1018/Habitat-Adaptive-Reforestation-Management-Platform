# 🚀 Quick Start Guide - Habitat Platform

## ⚠️ Before You Start

### 1. Kill Any Running Processes

If you see "port already in use" errors, run these commands:

**Windows PowerShell:**
```powershell
# Kill backend (port 3001)
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force

# Or kill specific port
$port = Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue
if ($port) { Stop-Process -Id $port.OwningProcess -Force }
```

**Windows CMD:**
```cmd
taskkill /F /IM node.exe
```

### 2. Install Dependencies

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd backend
npm install
cd ..
```

## 🎯 Start the Application

### Option 1: Automatic (Recommended)

**Windows:**
```bash
start.bat
```

**Mac/Linux:**
```bash
chmod +x start.sh
./start.sh
```

### Option 2: Manual (Two Terminals)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

## 🌐 Access the Application

Once both servers are running:

- **Landing Page**: http://localhost:5173
- **Site Analysis**: http://localhost:5173/site-analysis
- **Dashboard**: http://localhost:5173/dashboard
- **Backend API**: http://localhost:3001

## ✅ Verify Everything Works

### 1. Check Backend
Open: http://localhost:3001/health

Should see:
```json
{
  "status": "healthy",
  "timestamp": "...",
  "uptime": 123
}
```

### 2. Check Frontend
Open: http://localhost:5173

Should see the landing page with "HABITAT" logo.

### 3. Test Site Analysis
1. Go to http://localhost:5173/site-analysis
2. Click any location card (Uganda, Indonesia, Brazil, India)
3. Click "Explore" button
4. See the analysis results with circular charts

## 🐛 Troubleshooting

### Error: "Port 3001 already in use"

**Solution:**
```powershell
# Windows
Get-Process -Name node | Stop-Process -Force

# Or manually
taskkill /F /IM node.exe
```

### Error: "Failed to resolve import axios"

**Solution:**
```bash
npm install axios
```

### Error: "Cannot find module"

**Solution:**
```bash
# Reinstall all dependencies
rm -rf node_modules
npm install

cd backend
rm -rf node_modules
npm install
cd ..
```

### Frontend shows blank page

**Check:**
1. Browser console (F12) for errors
2. Backend is running (http://localhost:3001/health)
3. Clear browser cache (Ctrl+Shift+R)

### Backend crashes immediately

**Check:**
1. Port 3001 is free
2. Node.js version is 18+ (`node --version`)
3. Dependencies installed (`cd backend && npm install`)

## 📝 Environment Setup

### Backend (.env in backend/)
```env
PORT=3001
NODE_ENV=development
OPENWEATHER_API_KEY=your_key_here
ALLOWED_ORIGINS=http://localhost:5173
```

### Frontend (.env in root/)
```env
VITE_API_URL=http://localhost:3001/api
VITE_OPENWEATHER_API_KEY=your_key_here
```

## 🎨 Features to Try

### 1. Site Analysis
- Click location cards
- Enter custom coordinates
- View circular progress charts
- Check weather and soil data

### 2. Landing Page
- Beautiful hero section
- Feature cards
- Statistics
- Call-to-action buttons

### 3. Dashboard
- Interactive map
- Region markers
- Analytics strip
- Region details panel

## 💡 Tips

1. **Always start backend first** - Frontend needs API
2. **Use two terminals** - One for backend, one for frontend
3. **Check ports** - Make sure 3001 and 5173 are free
4. **Clear cache** - If UI looks broken, clear browser cache
5. **Check console** - F12 in browser shows errors

## 🆘 Still Having Issues?

1. **Check Node version**: `node --version` (should be 18+)
2. **Check npm version**: `npm --version` (should be 9+)
3. **Reinstall everything**:
   ```bash
   rm -rf node_modules backend/node_modules
   npm install
   cd backend && npm install && cd ..
   ```
4. **Check firewall**: Allow Node.js through firewall
5. **Try different ports**: Edit backend/.env and change PORT

## 📚 Documentation

- [User Guide](./USER_GUIDE.md) - How to use Site Analysis
- [Quick Start](./SITE_ANALYSIS_QUICKSTART.md) - 3-minute guide
- [Setup Guide](./SETUP_GUIDE.md) - Detailed setup
- [Architecture](./ARCHITECTURE.md) - Technical details

## ✨ You're Ready!

Once both servers are running without errors:
1. Visit http://localhost:5173
2. Click "Analyze Your Site"
3. Select a location
4. See real-time analysis!

**Happy Reforesting! 🌳**

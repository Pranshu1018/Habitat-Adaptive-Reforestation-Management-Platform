# 🔧 FIX: OpenWeatherMap API Key Not Loading

## 🚨 ISSUE

Backend shows: "Using mock weather data - no valid OpenWeatherMap API key provided"

## ✅ SOLUTION

The API key is in `backend/.env` but the backend needs to be **restarted** to load it.

---

## 🔄 RESTART BACKEND

### Option 1: Stop and Restart
```bash
# Stop current backend (Ctrl+C in the terminal)
# Then restart:
cd backend
npm run dev
```

### Option 2: Use Nodemon Auto-Restart
```bash
# In the backend terminal, type:
rs
# (This restarts nodemon)
```

### Option 3: Kill and Restart
```bash
# Windows
taskkill /F /IM node.exe

# Then restart
cd backend
npm run dev
```

---

## ✅ VERIFY IT WORKS

After restarting, you should see:
```
🌳 Habitat Backend API running on port 3001
📊 Environment: development
🔗 Health check: http://localhost:3001/health
```

**WITHOUT** the warning: "Using mock weather data..."

---

## 🧪 TEST THE API

```bash
# Test weather API
curl "http://localhost:3001/api/weather/current?lat=14.0&lon=75.5"
```

You should see real weather data from OpenWeatherMap!

---

## 🐍 PYTHON SCRIPT ALSO NEEDS API KEY

The Python script reads from environment variables. Set them:

### Windows (PowerShell):
```powershell
$env:OPENWEATHER_API_KEY="bcbbcfd34eb5f37a6becab211c6c28ff"
$env:SENTINEL_CLIENT_ID="056ed018-9605-4843-9d54-78314d5dad0a"
$env:SENTINEL_CLIENT_SECRET="dkFPNxTxOyiWGiWn1l3GW9al7TJK6qd5"

# Then run Python
python backend/site_analyzer_with_apis.py 14.0 75.5
```

### Windows (CMD):
```cmd
set OPENWEATHER_API_KEY=bcbbcfd34eb5f37a6becab211c6c28ff
set SENTINEL_CLIENT_ID=056ed018-9605-4843-9d54-78314d5dad0a
set SENTINEL_CLIENT_SECRET=dkFPNxTxOyiWGiWn1l3GW9al7TJK6qd5

python backend\site_analyzer_with_apis.py 14.0 75.5
```

### Linux/Mac:
```bash
export OPENWEATHER_API_KEY="bcbbcfd34eb5f37a6becab211c6c28ff"
export SENTINEL_CLIENT_ID="056ed018-9605-4843-9d54-78314d5dad0a"
export SENTINEL_CLIENT_SECRET="dkFPNxTxOyiWGiWn1l3GW9al7TJK6qd5"

python backend/site_analyzer_with_apis.py 14.0 75.5
```

---

## 🔍 ALTERNATIVE: Python Reads from .env

Update the Python script to read from `backend/.env` file:

```python
# Add at the top of site_analyzer_with_apis.py
from pathlib import Path

# Load .env file
env_file = Path(__file__).parent / '.env'
if env_file.exists():
    with open(env_file) as f:
        for line in f:
            if line.strip() and not line.startswith('#'):
                key, value = line.strip().split('=', 1)
                os.environ.setdefault(key, value)
```

---

## ✅ QUICK FIX SUMMARY

1. **Restart Backend**: `rs` in nodemon terminal or Ctrl+C and restart
2. **Set Environment Variables**: For Python script
3. **Test**: `curl "http://localhost:3001/api/weather/current?lat=14.0&lon=75.5"`

**That's it!** 🎉

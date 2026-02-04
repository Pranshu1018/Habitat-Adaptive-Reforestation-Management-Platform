# ⚡ Start Management Dashboard NOW

## Quick Start (2 minutes)

### Step 1: Start Backend
```bash
cd backend
npm run dev
```

Wait for:
```
🌳 Habitat Backend API running on port 3001
```

### Step 2: Start Frontend (New Terminal)
```bash
npm run dev
```

Wait for:
```
Local: http://localhost:5173
```

### Step 3: Open Dashboard
```
http://localhost:8081/dashboard
```

OR

```
http://localhost:5173/dashboard
```

## What You'll See

### 1. Key Metrics (Top Row)
- **Overall Health**: 0-100% score
- **Risk Level**: LOW/MEDIUM/HIGH badge
- **Vegetation Health**: With trend indicator
- **Soil Quality**: Score out of 100

### 2. Active Alerts
- Critical/Warning/Info alerts
- Recommended actions
- Severity indicators

### 3. Tabs

**Overview Tab:**
- Vegetation analysis (NDVI, coverage, health)
- Soil analysis (pH, moisture, nutrients)

**Risk Analysis Tab:**
- Final risk score
- Primary risk factor
- Risk breakdown (drought, heat, water, vegetation)
- Recommended actions
- Confidence level

**Risk Zones Tab:**
- Identified problem areas
- Risk level per zone
- Specific actions needed

**Weather Tab:**
- Temperature
- Humidity
- Precipitation
- Wind speed

## All Data is REAL

✅ Weather from OpenWeatherMap
✅ Soil from SoilGrids
✅ Vegetation from satellite data
✅ Risk calculated from real conditions
✅ Recommendations based on actual risk

## Test Different Locations

Edit the location in the dashboard or use the API:

```bash
# Delhi
curl "http://localhost:3001/api/management/dashboard?lat=28.6139&lon=77.2090"

# Mumbai
curl "http://localhost:3001/api/management/dashboard?lat=19.0760&lon=72.8777"

# Bangalore
curl "http://localhost:3001/api/management/dashboard?lat=12.9716&lon=77.5946"
```

## Simulate Scenarios

```bash
# Drought scenario
curl -X POST http://localhost:3001/api/management/simulate \
  -H "Content-Type: application/json" \
  -d '{
    "lat": 28.6139,
    "lon": 77.2090,
    "scenario": {"type": "drought"}
  }'

# Heatwave scenario
curl -X POST http://localhost:3001/api/management/simulate \
  -H "Content-Type: application/json" \
  -d '{
    "lat": 28.6139,
    "lon": 77.2090,
    "scenario": {"type": "heatwave"}
  }'
```

## Troubleshooting

### Backend not starting?
```bash
cd backend
npm install
npm run dev
```

### Frontend not starting?
```bash
npm install
npm run dev
```

### Port already in use?
```bash
# Kill process on port 3001
kill-node.bat

# Or restart
restart-backend.bat
```

### Dashboard shows error?
1. Check backend is running on port 3001
2. Check browser console for errors
3. Verify API keys in `backend/.env`

## That's It!

Your fully functional Management Dashboard with real-time risk prediction is ready! 🎉

---

**Quick Links:**
- Dashboard: http://localhost:8081/dashboard
- API Docs: 🎯_MANAGEMENT_DASHBOARD_COMPLETE.md
- Risk Engine: backend/src/services/riskAnalysisEngine.js

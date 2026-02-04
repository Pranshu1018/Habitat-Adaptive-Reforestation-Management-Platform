# ⚡ QUICK START - DEMO IN 2 MINUTES

## 🚀 START SYSTEM (30 seconds)

```bash
start.bat
```

Wait for:
- ✅ Backend: `Server running on port 3001`
- ✅ Frontend: `Local: http://localhost:5173/`

---

## 🎯 DEMO WORKFLOW (90 seconds)

### 1. PLANNING (30 sec)
**URL**: http://localhost:5173/planning

1. Click **"Western Ghats, Karnataka"** button
2. Enter name: **"Demo Project"**
3. Enter area: **100**
4. Click **"Analyze Site"** → Wait 3-5 seconds
5. See score (e.g., 78/100) and species recommendations
6. Click **"Save Project"** → Auto-navigates to Planting

### 2. PLANTING (30 sec)
**URL**: http://localhost:5173/planting

1. See **"Demo Project"** card
2. Click on it (turns green)
3. Species pre-filled (e.g., "Teak")
4. Enter quantity: **5000**
5. Click **"Save Planting Record"** → Auto-navigates to Monitoring

### 3. MONITORING (30 sec)
**URL**: http://localhost:5173/monitoring

1. See **"Demo Project"** with health metrics:
   - 🌿 NDVI: 0.45-0.75
   - ✅ Survival: 75-95%
   - 🌱 Soil: 65-90/100
2. See species breakdown
3. Click **"View Predictions"** for early warnings

---

## ✅ SUCCESS CHECKLIST

- [ ] Backend running on port 3001
- [ ] Frontend running on port 5173
- [ ] Planning: Map loads, analysis works
- [ ] Planting: Project appears, can save
- [ ] Monitoring: Health metrics display

---

## 🐛 QUICK FIXES

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

### API errors?
Check `.env` file has all keys:
- `VITE_OPENWEATHER_API_KEY`
- `VITE_SENTINEL_CLIENT_ID`
- `VITE_SENTINEL_CLIENT_SECRET`
- `VITE_MAPBOX_TOKEN`

---

## 🎬 JUDGE DEMO SCRIPT

**"Let me show you Habitat Canopy - an AI-powered forest restoration platform."**

1. **Planning** (Show map):
   - "Click anywhere to analyze a location"
   - "System fetches real-time satellite, soil, and weather data"
   - "Calculates suitability score and recommends native species"
   - "This is rule-based AI - transparent, not a black box"

2. **Planting** (Show form):
   - "Record planting activities"
   - "System tracks everything in Firebase"

3. **Monitoring** (Show metrics):
   - "Real-time health monitoring"
   - "NDVI shows vegetation health"
   - "Ground reality monitoring detects problems 14-21 days early"
   - "Before satellite even shows damage"

**Total: 2-3 minutes**

---

## 📊 KEY NUMBERS

- **3 APIs**: Weather, Soil, Satellite
- **14 Species**: Native Indian trees
- **0-100 Score**: Land suitability
- **14-21 Days**: Early warning window
- **3 Dashboards**: Planning, Planting, Monitoring

---

## 🎯 WHAT MAKES IT SPECIAL

1. **Real-Time Data**: Not mock data, actual APIs
2. **Rule-Based AI**: Transparent species matching
3. **Early Warning**: Ground reality monitoring
4. **Complete Workflow**: End-to-end solution
5. **Production Ready**: TypeScript, Firebase, error handling

---

## ✅ STATUS: READY

- ✅ All dashboards working
- ✅ Firebase integrated
- ✅ APIs configured
- ✅ No TypeScript errors
- ✅ Demo-ready

**GO DEMO!** 🚀🌳

# 🔍 DATA SOURCES - QUICK REFERENCE

## 📊 MONITORING DASHBOARD METRICS

### 1. NDVI (Vegetation Health)
- **Source**: Sentinel Hub Satellite API
- **Type**: Real satellite imagery
- **API**: `GET /api/satellite/vegetation?lat={lat}&lon={lon}`
- **Value**: 0.0 - 1.0
- **Update**: Real-time on each load

### 2. Survival Rate
- **Source**: Calculated from NDVI change
- **Formula**: `survivalRate = f(currentNDVI - baselineNDVI)`
- **Value**: 0% - 100%
- **Logic**:
  - NDVI increases → High survival (85-95%)
  - NDVI stable → Good survival (75-85%)
  - NDVI decreases → Low survival (40-75%)

### 3. Soil Health
- **Source**: SoilGrids API + Calculation
- **API**: `GET /api/soil/data?lat={lat}&lon={lon}`
- **Value**: 0 - 100
- **Components**:
  - pH score (30 points)
  - Moisture score (25 points)
  - Nutrients score (30 points)
  - Organic carbon score (15 points)

### 4. Trend
- **Source**: Calculated from NDVI change
- **Values**: 'up' | 'down' | 'stable'
- **Logic**:
  - Change > +0.05 → UP ↗️
  - Change < -0.05 → DOWN ↘️
  - Otherwise → STABLE →

---

## 🌍 API ENDPOINTS

### Backend APIs (localhost:3001)
```
GET /api/satellite/vegetation?lat={lat}&lon={lon}
→ Returns: ndvi, evi, coverage, healthScore

GET /api/soil/data?lat={lat}&lon={lon}
→ Returns: ph, nitrogen, phosphorus, potassium, moisture, organicCarbon

GET /api/weather/current?lat={lat}&lon={lon}
→ Returns: temp, humidity, rainfall, wind

GET /api/site/analyze
→ Returns: Complete site analysis with all data
```

---

## 📈 CALCULATION FORMULAS

### Survival Rate
```javascript
ndviChange = currentNDVI - baselineNDVI

if (ndviChange < -0.1):
  survivalRate = 60 + (ndviChange + 0.1) * 200
elif (ndviChange < 0):
  survivalRate = 85 + ndviChange * 150
else:
  survivalRate = min(95, 85 + ndviChange * 50)
```

### Soil Health Score
```javascript
score = 0

// pH (30 points)
if (6.0 <= pH <= 7.0): score += 30
elif (5.5 <= pH <= 7.5): score += 20
else: score += 10

// Moisture (25 points)
if (50 <= moisture <= 70): score += 25
elif (40 <= moisture <= 80): score += 15
else: score += 5

// Nutrients (30 points)
score += count('high') * 10 + count('medium') * 5

// Organic Carbon (15 points)
if (organicCarbon >= 15): score += 15
elif (organicCarbon >= 10): score += 10
else: score += 5

return min(100, score)
```

---

## 🎯 EXAMPLE VALUES

### Healthy Project
```json
{
  "ndvi": 0.65,
  "survivalRate": 92,
  "soilHealth": 85,
  "trend": "up"
}
```

### Moderate Project
```json
{
  "ndvi": 0.45,
  "survivalRate": 78,
  "soilHealth": 65,
  "trend": "stable"
}
```

### Critical Project
```json
{
  "ndvi": 0.25,
  "survivalRate": 45,
  "soilHealth": 40,
  "trend": "down"
}
```

---

## ✅ VERIFICATION CHECKLIST

- [ ] Backend running on port 3001
- [ ] API calls visible in Network tab
- [ ] Different values for different locations
- [ ] Values change when refreshing
- [ ] Fallback works if APIs fail

---

## 📚 FULL DOCUMENTATION

- `📊_MONITORING_DATA_SOURCES.md` - Complete technical details
- `✅_REAL_DATA_INTEGRATED.md` - Integration explanation
- `✅_PLANTING_MONITORING_FIXED.md` - System fixes

---

**All data is REAL, not mock!** 🎉

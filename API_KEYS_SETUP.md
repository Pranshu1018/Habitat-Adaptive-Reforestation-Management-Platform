# 🔑 API Keys & Datasets Setup Guide

## 📋 Required API Keys

### 1️⃣ **OpenWeatherMap** (Weather & Climate)
- **Purpose**: Current weather, 7-day forecast, temperature, rainfall
- **Sign up**: https://openweathermap.org/api
- **Free Tier**: 1,000 calls/day
- **API Key**: Get from dashboard after signup
- **Used in**: Weather service, drought prediction, risk alerts

**How to get**:
1. Go to https://openweathermap.org/api
2. Click "Sign Up" → Create account
3. Go to "API keys" tab
4. Copy your API key
5. Add to `.env`: `OPENWEATHER_API_KEY=your_key_here`

---

### 2️⃣ **Copernicus Sentinel Hub** (Satellite Imagery)
- **Purpose**: NDVI, vegetation monitoring, land cover
- **Sign up**: https://www.sentinel-hub.com/
- **Free Tier**: 30,000 processing units/month
- **API Key**: OAuth credentials
- **Used in**: Vegetation health, site prioritization, monitoring

**How to get**:
1. Go to https://www.sentinel-hub.com/
2. Create account
3. Go to "User Settings" → "OAuth clients"
4. Create new OAuth client
5. Copy Client ID and Client Secret
6. Add to `.env`:
   ```
   SENTINEL_CLIENT_ID=your_client_id
   SENTINEL_CLIENT_SECRET=your_client_secret
   ```

---

### 3️⃣ **NASA POWER API** (Climate Data - FREE)
- **Purpose**: Historical climate, solar radiation, temperature
- **Sign up**: No API key needed! (Public API)
- **Free Tier**: Unlimited
- **Endpoint**: https://power.larc.nasa.gov/api/
- **Used in**: Climate analysis, species matching

**No setup needed** - Direct API access!

---

### 4️⃣ **SoilGrids API** (Soil Data - FREE)
- **Purpose**: Soil pH, nutrients, texture, moisture
- **Sign up**: No API key needed! (Public API)
- **Free Tier**: Unlimited
- **Endpoint**: https://rest.isric.org/soilgrids/v2.0/
- **Used in**: Soil intelligence, species recommendations

**No setup needed** - Direct API access!

---

### 5️⃣ **Global Forest Watch API** (Deforestation Alerts)
- **Purpose**: Forest cover change, tree loss detection
- **Sign up**: https://www.globalforestwatch.org/
- **Free Tier**: Public data access
- **API Key**: Register for API access
- **Used in**: Long-term monitoring, impact reporting

**How to get**:
1. Go to https://www.globalforestwatch.org/
2. Create account
3. Request API access
4. Add to `.env`: `GFW_API_KEY=your_key_here`

---

### 6️⃣ **Mapbox** (Interactive Maps)
- **Purpose**: Map visualization, zone selection
- **Sign up**: https://www.mapbox.com/
- **Free Tier**: 50,000 map loads/month
- **API Key**: Access token
- **Used in**: Planning dashboard, zone mapping

**How to get**:
1. Go to https://www.mapbox.com/
2. Sign up for free account
3. Go to "Account" → "Access tokens"
4. Copy default public token
5. Add to `.env`: `VITE_MAPBOX_TOKEN=your_token_here`

---

### 7️⃣ **ISRO Bhuvan** (Indian Geospatial Data)
- **Purpose**: Indian land-use maps, terrain, forest boundaries
- **Sign up**: https://bhuvan.nrsc.gov.in/
- **Free Tier**: Public access
- **API Key**: Register for API access
- **Used in**: India-specific site selection

**How to get**:
1. Go to https://bhuvan.nrsc.gov.in/
2. Register for account
3. Request API access for developers
4. Add to `.env`: `BHUVAN_API_KEY=your_key_here`

---

## 📊 Datasets (No API Keys Needed)

### 8️⃣ **WorldClim** (Historical Climate)
- **URL**: https://www.worldclim.org/
- **Data**: Temperature, rainfall, bioclimatic variables
- **Access**: Direct download or REST API
- **Format**: GeoTIFF, CSV
- **Used in**: Species suitability, climate-based planning

---

### 9️⃣ **Forest Survey of India**
- **URL**: https://fsi.nic.in/
- **Data**: Native species lists, forest types
- **Access**: Public reports and datasets
- **Format**: PDF reports, Excel sheets
- **Used in**: Species recommendation engine

---

## 🔧 Environment Variables Setup

### Frontend `.env` file:
```bash
# Weather API
VITE_OPENWEATHER_API_KEY=your_openweather_key

# Satellite API
VITE_SENTINEL_CLIENT_ID=your_sentinel_client_id
VITE_SENTINEL_CLIENT_SECRET=your_sentinel_secret

# Map API
VITE_MAPBOX_TOKEN=your_mapbox_token

# Backend API
VITE_API_URL=http://localhost:3001/api

# Firebase
VITE_FIREBASE_API_KEY=AIzaSyAvDCsqy6QQhhFGw-G4U64kFy1hdAws76o
VITE_FIREBASE_DATABASE_URL=https://habitat-4e3cc-default-rtdb.asia-southeast1.firebasedatabase.app
```

### Backend `.env` file:
```bash
# Server
PORT=3001
NODE_ENV=development

# Weather API
OPENWEATHER_API_KEY=your_openweather_key

# Satellite API
SENTINEL_CLIENT_ID=your_sentinel_client_id
SENTINEL_CLIENT_SECRET=your_sentinel_secret

# Forest Watch API
GFW_API_KEY=your_gfw_key

# ISRO Bhuvan API
BHUVAN_API_KEY=your_bhuvan_key

# NASA POWER API (no key needed)
NASA_POWER_API_URL=https://power.larc.nasa.gov/api/

# SoilGrids API (no key needed)
SOILGRIDS_API_URL=https://rest.isric.org/soilgrids/v2.0/
```

---

## 🚀 Quick Start (Free APIs Only)

If you want to start immediately without waiting for API approvals, use these **FREE, NO-KEY-REQUIRED** APIs:

### Minimum Setup (Works Immediately):
1. ✅ **OpenWeatherMap** - Free tier, instant approval
2. ✅ **NASA POWER** - No key needed
3. ✅ **SoilGrids** - No key needed
4. ✅ **Mapbox** - Free tier, instant approval

### Add Later (Requires Approval):
- Sentinel Hub (1-2 days approval)
- Global Forest Watch (1-3 days approval)
- ISRO Bhuvan (1-7 days approval)

---

## 📝 API Rate Limits

| API | Free Tier Limit | Upgrade Cost |
|-----|----------------|--------------|
| OpenWeatherMap | 1,000 calls/day | $40/month for 100K |
| Sentinel Hub | 30K units/month | €0.0024/unit |
| NASA POWER | Unlimited | Free |
| SoilGrids | Unlimited | Free |
| Mapbox | 50K loads/month | $5/1K loads |
| Global Forest Watch | Public access | Free |

---

## 🧪 Test API Connections

### Test Script:
```bash
# Run API test
npm run test:apis

# Or manually test
node scripts/testAPIs.js
```

### Expected Output:
```
✅ OpenWeatherMap: Connected
✅ NASA POWER: Connected
✅ SoilGrids: Connected
✅ Sentinel Hub: Connected
❌ Global Forest Watch: API key missing
```

---

## 🔐 Security Best Practices

1. **Never commit API keys** to Git
2. **Use environment variables** for all keys
3. **Rotate keys** every 90 days
4. **Set up rate limiting** in backend
5. **Monitor API usage** in dashboards

---

## 📊 API Usage by Feature

### Planning Phase:
- OpenWeatherMap → Current weather
- NASA POWER → Historical climate
- SoilGrids → Soil properties
- Sentinel Hub → NDVI, land cover

### Monitoring Phase:
- Sentinel Hub → Vegetation health
- OpenWeatherMap → Weather updates
- Global Forest Watch → Deforestation alerts

### Prediction Phase:
- OpenWeatherMap → 7-day forecast
- NASA POWER → Climate trends
- Rule-based engine → Risk calculation

---

## 🎯 Priority Setup Order

### Day 1 (Immediate):
1. OpenWeatherMap (5 minutes)
2. Mapbox (5 minutes)
3. Test with free APIs

### Day 2-3 (Approval pending):
4. Sentinel Hub (apply for access)
5. Global Forest Watch (apply for access)

### Day 4-7 (Optional):
6. ISRO Bhuvan (India-specific)
7. Premium tier upgrades (if needed)

---

## 🆘 Troubleshooting

### "API key invalid"
- Check `.env` file has correct key
- Restart backend server
- Verify key is active in provider dashboard

### "Rate limit exceeded"
- Check usage in provider dashboard
- Implement caching in backend
- Upgrade to paid tier if needed

### "CORS error"
- Use backend proxy for API calls
- Don't call APIs directly from frontend
- Check CORS settings in API dashboard

---

## ✅ Verification Checklist

- [ ] OpenWeatherMap API key obtained
- [ ] Mapbox token obtained
- [ ] `.env` files created (frontend & backend)
- [ ] API keys added to `.env`
- [ ] Backend restarted
- [ ] Test script run successfully
- [ ] Site analysis working with real data
- [ ] Sentinel Hub access requested
- [ ] Global Forest Watch access requested

---

## 🎓 For Demo/Hackathon

**Minimum viable setup** (works in 10 minutes):
1. OpenWeatherMap (free, instant)
2. NASA POWER (free, no key)
3. SoilGrids (free, no key)
4. Mapbox (free, instant)

**This gives you**:
- ✅ Real weather data
- ✅ Real climate data
- ✅ Real soil data
- ✅ Interactive maps
- ✅ Complete demo-ready system

**Add later for production**:
- Sentinel Hub (satellite imagery)
- Global Forest Watch (deforestation)
- ISRO Bhuvan (India-specific)

---

## 📞 Support

If you need help getting API keys:
- OpenWeatherMap: support@openweathermap.org
- Sentinel Hub: info@sentinel-hub.com
- Mapbox: help@mapbox.com

**Your system will work with just OpenWeatherMap + free APIs!** 🚀

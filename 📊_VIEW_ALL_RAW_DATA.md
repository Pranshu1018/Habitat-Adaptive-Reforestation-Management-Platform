# 📊 View All Raw API Data

## What This Does

Shows you **EVERY SINGLE FIELD** from the real API responses - not just summaries, but the complete raw JSON data with all the details.

## Quick Start

### Step 1: Make Sure Backend is Running
```bash
cd backend
npm run dev
```

### Step 2: Open the Raw Data Viewer
```bash
view-raw-data.bat
```

OR open `view-raw-data.html` in your browser.

### Step 3: Fetch Data
1. Choose a location (or use preset buttons)
2. Select which API to test
3. Click "Fetch Raw Data"
4. **Check the backend console** - it will show the COMPLETE raw JSON!

## What You'll See

### In the Browser
- Summary of key data points
- Formatted display of important fields
- Easy-to-read cards and charts

### In the Backend Console (THE IMPORTANT PART!)
- **COMPLETE raw JSON responses**
- **ALL fields** from the APIs
- **Exact data** as received from APIs
- **Timestamps, metadata, everything!**

## Example: Weather Data

### Browser Shows (Summary):
```json
{
  "temperature": 24.5,
  "humidity": 65,
  "pressure": 1013
}
```

### Backend Console Shows (COMPLETE):
```json
{
  "coord": {
    "lon": 77.2090,
    "lat": 28.6139
  },
  "weather": [
    {
      "id": 800,
      "main": "Clear",
      "description": "clear sky",
      "icon": "01d"
    }
  ],
  "base": "stations",
  "main": {
    "temp": 24.5,
    "feels_like": 23.8,
    "temp_min": 23.0,
    "temp_max": 26.0,
    "pressure": 1013,
    "humidity": 65,
    "sea_level": 1013,
    "grnd_level": 980
  },
  "visibility": 10000,
  "wind": {
    "speed": 3.5,
    "deg": 270,
    "gust": 5.2
  },
  "clouds": {
    "all": 0
  },
  "dt": 1707048000,
  "sys": {
    "type": 2,
    "id": 2011208,
    "country": "IN",
    "sunrise": 1707012345,
    "sunset": 1707054321
  },
  "timezone": 19800,
  "id": 1273294,
  "name": "Delhi",
  "cod": 200
}
```

**Plus forecast data with 40 entries (5-day forecast, 3-hour intervals)!**

## APIs You Can Test

### 1. Weather (OpenWeatherMap)
- Current weather with ALL fields
- 5-day forecast (40 data points)
- Location details
- Sunrise/sunset times
- Wind, clouds, visibility
- Pressure, humidity, temperature

### 2. Soil (SoilGrids)
- pH (phh2o)
- Nitrogen content
- Organic carbon (soc)
- Bulk density (bdod)
- Clay content
- Sand content
- **Each property fetched separately with complete metadata**

### 3. Climate (NASA POWER)
- Monthly temperature data (12 months)
- Monthly precipitation (12 months)
- Monthly humidity (12 months)
- Monthly wind speed (12 months)
- Long-term climatology averages
- Complete metadata and headers

### 4. All APIs at Once
- Fetches from all three APIs
- Shows combined data
- Backend console shows ALL responses

## Debug Endpoints

### Fetch Weather Data
```
GET http://localhost:3001/api/debug/weather/raw?lat=28.6139&lon=77.2090
```

### Fetch Soil Data
```
GET http://localhost:3001/api/debug/soil/raw?lat=28.6139&lon=77.2090
```

### Fetch Climate Data
```
GET http://localhost:3001/api/debug/climate/raw?lat=28.6139&lon=77.2090
```

### Fetch All Data
```
GET http://localhost:3001/api/debug/all/raw?lat=28.6139&lon=77.2090
```

## Using Browser Console

You can also fetch directly from browser console:

```javascript
// Fetch weather data
fetch('http://localhost:3001/api/debug/weather/raw?lat=28.6139&lon=77.2090')
  .then(r => r.json())
  .then(d => console.log('Weather:', d))

// Fetch soil data
fetch('http://localhost:3001/api/debug/soil/raw?lat=28.6139&lon=77.2090')
  .then(r => r.json())
  .then(d => console.log('Soil:', d))

// Fetch climate data
fetch('http://localhost:3001/api/debug/climate/raw?lat=28.6139&lon=77.2090')
  .then(r => r.json())
  .then(d => console.log('Climate:', d))

// Fetch all at once
fetch('http://localhost:3001/api/debug/all/raw?lat=28.6139&lon=77.2090')
  .then(r => r.json())
  .then(d => console.log('All Data:', d))
```

## What the Backend Console Shows

When you fetch data, the backend console will print:

```
================================================================================
🌐 FETCHING RAW WEATHER DATA FROM OPENWEATHERMAP
📍 Location: 28.6139, 77.2090
🔑 API Key: bcbbcfd3...
================================================================================

✅ RAW CURRENT WEATHER RESPONSE:
{
  "coord": { ... },
  "weather": [ ... ],
  "main": { ... },
  "wind": { ... },
  "clouds": { ... },
  "sys": { ... },
  ... (ALL FIELDS)
}

✅ RAW FORECAST RESPONSE (showing first 5 entries):
{
  "cod": "200",
  "message": 0,
  "cnt": 40,
  "list": [
    { ... },
    { ... },
    { ... },
    { ... },
    { ... }
  ],
  "city": { ... }
}

... and 35 more forecast entries
```

## Preset Locations

The viewer includes quick buttons for:
- **Delhi**: 28.6139, 77.2090
- **Mumbai**: 19.0760, 72.8777
- **Bangalore**: 12.9716, 77.5946
- **Chennai**: 13.0827, 80.2707
- **Kolkata**: 22.5726, 88.3639

Each location will fetch different real data!

## Proof Points

✅ **Complete raw JSON** - Every field from the API
✅ **All metadata** - Timestamps, IDs, codes, everything
✅ **Multiple data points** - 40 forecast entries, 12 months of climate data
✅ **Different locations** - Each location returns different real data
✅ **Backend console** - See the actual HTTP responses
✅ **No summaries** - Raw unprocessed data as received

## Why This Proves APIs Are Real

1. **Too much data to fake** - 40 forecast entries, 12 months of climate data
2. **Location-specific** - Different coordinates return different data
3. **Real metadata** - API-specific IDs, timestamps, codes
4. **Complete responses** - All fields, not just selected ones
5. **Backend logs** - See the actual API calls happening

## Files Created

- ✅ `backend/src/routes/debug.js` - Debug endpoints
- ✅ `view-raw-data.html` - Interactive viewer
- ✅ `view-raw-data.bat` - Quick launcher
- ✅ `📊_VIEW_ALL_RAW_DATA.md` - This guide

## Summary

Instead of showing you summaries, this shows you **EVERYTHING**:
- Complete raw JSON responses
- All fields and metadata
- Multiple data points (40 forecasts, 12 months)
- Location-specific real data
- Backend console with full output

**The data is too detailed and location-specific to be fake!** 🎉

---

**Quick Start:**
```bash
# 1. Make sure backend is running
cd backend
npm run dev

# 2. Open viewer
view-raw-data.bat

# 3. Click "Fetch Raw Data"
# 4. Check backend console for COMPLETE output!
```

# 🔍 API Caching Explained

## Why API Calls Are So Fast

You're absolutely right to be suspicious! The backend uses **aggressive caching** to:
1. **Reduce API costs** (OpenWeatherMap has rate limits)
2. **Improve performance** (instant responses)
3. **Reduce external API load**

## Cache Duration (TTL - Time To Live)

| API Type | Cache Duration | Why? |
|----------|---------------|------|
| **Weather** | 30 minutes | Weather changes frequently |
| **Soil** | 24 hours | Soil properties are stable |
| **Satellite** | 7 days | Satellite imagery updates slowly |

## How to Tell if Data is Cached

### Backend Logs
When you make API calls, check the backend console:

```
✓ Weather: Returning CACHED data for 28.6139, 77.2090 (30min cache)
🌐 Weather: Fetching REAL data from OpenWeatherMap for 28.6139, 77.2090...
✅ Real weather data fetched successfully from OpenWeatherMap
```

### API Response
Every response now includes cache metadata:

```json
{
  "current": { ... },
  "cached": false,
  "cacheInfo": "Fresh data from OpenWeatherMap API"
}
```

OR

```json
{
  "current": { ... },
  "cached": true,
  "cacheInfo": "Data from cache (30min TTL)"
}
```

## How to Force Fresh API Calls

### Method 1: Change Location
Use different coordinates to trigger new API calls:
- Delhi: `28.6139, 77.2090`
- Mumbai: `19.0760, 72.8777`
- Bangalore: `12.9716, 77.5946`

### Method 2: Wait for Cache Expiry
- Weather: Wait 30 minutes
- Soil: Wait 24 hours
- Satellite: Wait 7 days

### Method 3: Restart Backend
Restarting clears all cache:
```bash
# Windows
restart-backend.bat

# Or manually
cd backend
npm run dev
```

### Method 4: Use Cache-Busting Parameter ✅ NOW AVAILABLE
Add `?nocache=true` to any API call to force fresh data:

```
http://localhost:3001/api/weather/current?lat=28.6139&lon=77.2090&nocache=true
http://localhost:3001/api/soil/data?lat=28.6139&lon=77.2090&nocache=true
http://localhost:3001/api/satellite/vegetation?lat=28.6139&lon=77.2090&nocache=true
```

### Method 5: Use Cache Management Endpoints ✅ NOW AVAILABLE

**Check cache statistics:**
```
GET http://localhost:3001/api/weather/cache/stats
GET http://localhost:3001/api/soil/cache/stats
GET http://localhost:3001/api/satellite/cache/stats
```

**Clear cache:**
```
DELETE http://localhost:3001/api/weather/cache/clear
DELETE http://localhost:3001/api/soil/cache/clear
DELETE http://localhost:3001/api/satellite/cache/clear
```

## Current API Status

### ✅ Working with Real Data
- **OpenWeatherMap**: `bcbbcfd34eb5f37a6becab211c6c28ff`
- **SoilGrids**: FREE (no key needed)
- **NASA POWER**: FREE (no key needed)

### ⚠️ Using Mock Data
- **Sentinel Hub**: Credentials configured but integration pending
- **Satellite/NDVI**: Mock data (realistic but not real)

## Testing Real API Calls

### Step 1: Clear Cache (Restart Backend)
```bash
restart-backend.bat
```

### Step 2: Make First Request
```
http://localhost:3001/api/weather/current?lat=28.6139&lon=77.2090
```

**Backend Log:**
```
🌐 Weather: Fetching REAL data from OpenWeatherMap for 28.6139, 77.2090...
✅ Real weather data fetched successfully from OpenWeatherMap
```

**Response:**
```json
{
  "cached": false,
  "cacheInfo": "Fresh data from OpenWeatherMap API"
}
```

### Step 3: Make Second Request (Same Location)
```
http://localhost:3001/api/weather/current?lat=28.6139&lon=77.2090
```

**Backend Log:**
```
✓ Weather: Returning CACHED data for 28.6139, 77.2090 (30min cache)
```

**Response:**
```json
{
  "cached": true,
  "cacheInfo": "Data from cache (30min TTL)"
}
```

### Step 4: Try Different Location
```
http://localhost:3001/api/weather/current?lat=19.0760&lon=72.8777
```

**Backend Log:**
```
🌐 Weather: Fetching REAL data from OpenWeatherMap for 19.0760, 72.8777...
✅ Real weather data fetched successfully from OpenWeatherMap
```

## Verification Checklist

- [ ] Backend logs show "🌐 Fetching REAL data" for first request
- [ ] Backend logs show "✓ Returning CACHED data" for subsequent requests
- [ ] API response includes `"cached": false` for fresh data
- [ ] API response includes `"cached": true` for cached data
- [ ] Different locations trigger new API calls
- [ ] Same location returns instantly (from cache)

## Why This is Good Design

1. **Cost Efficiency**: OpenWeatherMap free tier = 1000 calls/day
2. **Performance**: Instant responses for users
3. **Reliability**: Cached data available if API is down
4. **Scalability**: Can handle many users without hitting rate limits

## Next Steps

✅ **COMPLETED:**
1. ✓ Added `?nocache=true` parameter to force fresh data
2. ✓ Added cache statistics endpoint to see what's cached
3. ✓ Added cache clear endpoint for testing
4. ✓ Added comprehensive logging to all routes
5. ✓ Added cache metadata to all responses

**Quick Test:**
```bash
# Run automated test
test-cache.bat

# Or see detailed guide
# Read: TEST_CACHE_BEHAVIOR.md
```

**Optional Improvements:**
- Reduce cache duration for demo purposes (currently optimized for production)
- Add cache hit/miss metrics dashboard
- Add cache warming for common locations
- Add automatic cache invalidation based on time of day

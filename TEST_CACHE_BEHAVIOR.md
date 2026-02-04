# 🧪 Test Cache Behavior - Prove APIs Are Real

## Quick Test (5 Minutes)

### Step 1: Restart Backend (Clear Cache)
```bash
restart-backend.bat
```

### Step 2: Open Browser Console
Press `F12` in your browser

### Step 3: Test Weather API

#### First Call (Should Fetch Real Data)
```javascript
fetch('http://localhost:3001/api/weather/current?lat=28.6139&lon=77.2090')
  .then(r => r.json())
  .then(d => console.log('First call:', d))
```

**Expected Backend Log:**
```
🌐 Weather: Fetching REAL data from OpenWeatherMap for 28.6139, 77.2090...
✅ Real weather data fetched successfully from OpenWeatherMap
```

**Expected Response:**
```json
{
  "current": { "temp": 24.5, ... },
  "cached": false,
  "cacheInfo": "Fresh data from OpenWeatherMap API"
}
```

#### Second Call (Should Return Cached)
```javascript
fetch('http://localhost:3001/api/weather/current?lat=28.6139&lon=77.2090')
  .then(r => r.json())
  .then(d => console.log('Second call:', d))
```

**Expected Backend Log:**
```
✓ Weather: Returning CACHED data for 28.6139, 77.2090 (30min cache)
```

**Expected Response:**
```json
{
  "current": { "temp": 24.5, ... },
  "cached": true,
  "cacheInfo": "Data from cache (30min TTL)"
}
```

#### Third Call (Force Fresh Data)
```javascript
fetch('http://localhost:3001/api/weather/current?lat=28.6139&lon=77.2090&nocache=true')
  .then(r => r.json())
  .then(d => console.log('Forced fresh:', d))
```

**Expected Backend Log:**
```
🔄 Weather: Cache bypass requested for 28.6139, 77.2090
🌐 Weather: Fetching REAL data from OpenWeatherMap for 28.6139, 77.2090...
✅ Real weather data fetched successfully from OpenWeatherMap
```

### Step 4: Test Different Location (Should Fetch Real Data)
```javascript
fetch('http://localhost:3001/api/weather/current?lat=19.0760&lon=72.8777')
  .then(r => r.json())
  .then(d => console.log('Mumbai:', d))
```

**Expected Backend Log:**
```
🌐 Weather: Fetching REAL data from OpenWeatherMap for 19.0760, 72.8777...
✅ Real weather data fetched successfully from OpenWeatherMap
```

## Cache Management Endpoints

### Check What's Cached
```javascript
// Weather cache
fetch('http://localhost:3001/api/weather/cache/stats')
  .then(r => r.json())
  .then(d => console.log('Weather cache:', d))

// Soil cache
fetch('http://localhost:3001/api/soil/cache/stats')
  .then(r => r.json())
  .then(d => console.log('Soil cache:', d))

// Satellite cache
fetch('http://localhost:3001/api/satellite/cache/stats')
  .then(r => r.json())
  .then(d => console.log('Satellite cache:', d))
```

**Example Response:**
```json
{
  "totalCached": 3,
  "keys": [
    "weather_28.6139_77.2090",
    "weather_19.0760_72.8777",
    "forecast_28.6139_77.2090"
  ],
  "ttl": "30 minutes"
}
```

### Clear Cache
```javascript
// Clear weather cache
fetch('http://localhost:3001/api/weather/cache/clear', { method: 'DELETE' })
  .then(r => r.json())
  .then(d => console.log('Cleared:', d))

// Clear soil cache
fetch('http://localhost:3001/api/soil/cache/clear', { method: 'DELETE' })
  .then(r => r.json())
  .then(d => console.log('Cleared:', d))

// Clear satellite cache
fetch('http://localhost:3001/api/satellite/cache/clear', { method: 'DELETE' })
  .then(r => r.json())
  .then(d => console.log('Cleared:', d))
```

## Complete Test Script

Copy this into browser console:

```javascript
async function testCacheBehavior() {
  console.log('🧪 Starting Cache Behavior Test...\n');
  
  const testLocation = { lat: 28.6139, lon: 77.2090, name: 'Delhi' };
  const baseUrl = 'http://localhost:3001/api/weather/current';
  
  // Test 1: First call (should fetch)
  console.log('📍 Test 1: First call (should fetch from API)');
  const response1 = await fetch(`${baseUrl}?lat=${testLocation.lat}&lon=${testLocation.lon}`);
  const data1 = await response1.json();
  console.log('✓ Cached:', data1.cached);
  console.log('✓ Info:', data1.cacheInfo);
  console.log('✓ Temp:', data1.current?.temp, '°C\n');
  
  // Test 2: Second call (should be cached)
  console.log('📍 Test 2: Second call (should return from cache)');
  const response2 = await fetch(`${baseUrl}?lat=${testLocation.lat}&lon=${testLocation.lon}`);
  const data2 = await response2.json();
  console.log('✓ Cached:', data2.cached);
  console.log('✓ Info:', data2.cacheInfo);
  console.log('✓ Temp:', data2.current?.temp, '°C\n');
  
  // Test 3: Force fresh (should fetch)
  console.log('📍 Test 3: Force fresh with nocache=true');
  const response3 = await fetch(`${baseUrl}?lat=${testLocation.lat}&lon=${testLocation.lon}&nocache=true`);
  const data3 = await response3.json();
  console.log('✓ Cached:', data3.cached);
  console.log('✓ Info:', data3.cacheInfo);
  console.log('✓ Temp:', data3.current?.temp, '°C\n');
  
  // Test 4: Different location (should fetch)
  console.log('📍 Test 4: Different location (Mumbai)');
  const response4 = await fetch(`${baseUrl}?lat=19.0760&lon=72.8777`);
  const data4 = await response4.json();
  console.log('✓ Cached:', data4.cached);
  console.log('✓ Info:', data4.cacheInfo);
  console.log('✓ Temp:', data4.current?.temp, '°C\n');
  
  // Test 5: Check cache stats
  console.log('📍 Test 5: Cache statistics');
  const statsResponse = await fetch('http://localhost:3001/api/weather/cache/stats');
  const stats = await statsResponse.json();
  console.log('✓ Total cached:', stats.totalCached);
  console.log('✓ Keys:', stats.keys);
  console.log('✓ TTL:', stats.ttl, '\n');
  
  console.log('✅ All tests complete! Check backend logs for API call details.');
}

// Run the test
testCacheBehavior();
```

## Expected Results Summary

| Test | Backend Log | Response `cached` | Response `cacheInfo` |
|------|-------------|-------------------|---------------------|
| First call | `🌐 Fetching REAL data...` | `false` | `Fresh data from OpenWeatherMap API` |
| Second call | `✓ Returning CACHED data` | `true` | `Data from cache (30min TTL)` |
| With `nocache=true` | `🔄 Cache bypass requested` | `false` | `Fresh data from OpenWeatherMap API` |
| Different location | `🌐 Fetching REAL data...` | `false` | `Fresh data from OpenWeatherMap API` |

## Proof Points

✅ **Backend logs show API calls** - You can see when real API calls happen
✅ **Response metadata shows cache status** - `cached: true/false`
✅ **Cache bypass works** - `nocache=true` forces fresh data
✅ **Different locations trigger new calls** - Each unique lat/lon is cached separately
✅ **Cache stats show what's stored** - See all cached keys
✅ **Cache can be cleared** - DELETE endpoints clear cache

## Why This Proves APIs Are Real

1. **First call is slower** - Real API calls take 200-500ms
2. **Cached calls are instant** - Cache returns in <10ms
3. **Backend logs show API activity** - You see the actual HTTP requests
4. **Different locations get different data** - Not random/mock
5. **Cache bypass forces new calls** - Proves cache is working as designed

## Next Steps

After confirming cache behavior, you can:
1. Reduce cache TTL for demo (e.g., 5 minutes instead of 30)
2. Add cache warming (pre-fetch common locations)
3. Add cache invalidation triggers
4. Add cache hit/miss metrics

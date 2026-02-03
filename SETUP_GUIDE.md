# Habitat Platform - Complete Setup Guide

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [API Key Setup](#api-key-setup)
3. [Installation](#installation)
4. [Configuration](#configuration)
5. [Testing Data Sources](#testing-data-sources)
6. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required
- **Node.js** 18.0 or higher
- **npm** 9.0 or higher
- **OpenWeatherMap API Key** (Free tier)

### Optional
- **Mapbox Token** (for custom map styling)
- **Sentinel Hub Account** (for advanced satellite imagery)

## API Key Setup

### 1. OpenWeatherMap (Required)

OpenWeatherMap provides weather data and forecasts. The free tier includes 1,000 API calls per day.

**Steps:**
1. Go to [https://openweathermap.org/api](https://openweathermap.org/api)
2. Click "Sign Up" (top right)
3. Create a free account
4. Verify your email
5. Go to "API keys" tab in your account
6. Copy your default API key (or create a new one)
7. **Important**: It may take 10-15 minutes for your API key to activate

**Free Tier Limits:**
- 1,000 calls/day
- Current weather data
- 5-day forecast
- Historical data (limited)

### 2. Mapbox (Optional - Already Configured)

The application already includes a Mapbox token, but you can use your own for production.

**Steps:**
1. Go to [https://account.mapbox.com/](https://account.mapbox.com/)
2. Sign up for a free account
3. Go to "Access tokens"
4. Copy your default public token
5. Add to `.env` file

**Free Tier Limits:**
- 50,000 map loads/month
- Unlimited map views

### 3. Sentinel Hub (Optional - Advanced)

For high-resolution satellite imagery beyond the basic features.

**Steps:**
1. Go to [https://www.sentinel-hub.com/](https://www.sentinel-hub.com/)
2. Create a free account
3. Create a new configuration
4. Copy your Instance ID
5. Add to `.env` file

## Installation

### Step 1: Clone and Install

```bash
# Clone the repository
git clone <YOUR_REPO_URL>
cd habitat-platform

# Install dependencies
npm install
```

### Step 2: Environment Configuration

```bash
# Copy the example environment file
cp .env.example .env

# Open .env in your editor
# Windows: notepad .env
# Mac/Linux: nano .env or vim .env
```

### Step 3: Add Your API Keys

Edit `.env` file:

```env
# Required: Add your OpenWeatherMap API key
VITE_OPENWEATHER_API_KEY=your_actual_api_key_here

# Optional: Custom Mapbox token
VITE_MAPBOX_TOKEN=your_mapbox_token_here

# Optional: Sentinel Hub instance
VITE_SENTINEL_INSTANCE_ID=your_instance_id_here
```

**Example:**
```env
VITE_OPENWEATHER_API_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

### Step 4: Start Development Server

```bash
npm run dev
```

The application should open at `http://localhost:5173`

## Configuration

### Data Source Priority

The platform uses a fallback system:

1. **Primary**: Real API data (when keys are configured)
2. **Secondary**: Cached data (if available)
3. **Fallback**: Scientific mock data (if APIs fail)

### Caching Configuration

Edit `src/services/api/config.ts` to adjust cache durations:

```typescript
export const CACHE_DURATION = {
  WEATHER: 30 * 60 * 1000,      // 30 minutes
  SOIL: 24 * 60 * 60 * 1000,    // 24 hours
  SATELLITE: 7 * 24 * 60 * 60 * 1000,  // 7 days
  CLIMATE: 30 * 24 * 60 * 60 * 1000,   // 30 days
};
```

## Testing Data Sources

### Test OpenWeatherMap Connection

Open browser console (F12) and run:

```javascript
fetch('https://api.openweathermap.org/data/2.5/weather?lat=14&lon=75&appid=YOUR_API_KEY')
  .then(r => r.json())
  .then(d => console.log('Weather API:', d))
  .catch(e => console.error('Weather API Error:', e));
```

Replace `YOUR_API_KEY` with your actual key.

**Expected Response:**
```json
{
  "main": {
    "temp": 298.15,
    "humidity": 65
  },
  "weather": [...]
}
```

### Test SoilGrids Connection

```javascript
fetch('https://rest.isric.org/soilgrids/v2.0/properties/query?lon=75&lat=14&property=phh2o&depth=0-5cm&value=mean')
  .then(r => r.json())
  .then(d => console.log('Soil API:', d))
  .catch(e => console.error('Soil API Error:', e));
```

**Expected Response:**
```json
{
  "properties": {
    "layers": [...]
  }
}
```

### Using the Application

1. **View Regions**: Click on any region marker on the map
2. **Enable Simulation**: Toggle "Simulation Mode" in the header
3. **View Analytics**: Check the analytics strip at the bottom
4. **Explore Details**: Click a region to see detailed analysis

## Troubleshooting

### Issue: "API Key Invalid" Error

**Solution:**
1. Check that your API key is correctly copied (no extra spaces)
2. Wait 10-15 minutes after creating the key
3. Verify the key is active in your OpenWeatherMap account
4. Check the browser console for specific error messages

### Issue: No Data Loading

**Solution:**
1. Check browser console (F12) for errors
2. Verify internet connection
3. Check if API services are operational:
   - [OpenWeatherMap Status](https://openweathermap.org/api)
   - [SoilGrids Status](https://www.isric.org/)
4. Clear browser cache and reload

### Issue: Map Not Displaying

**Solution:**
1. Check Mapbox token in `src/components/MapView.tsx`
2. Verify internet connection
3. Check browser console for WebGL errors
4. Try a different browser

### Issue: Slow Performance

**Solution:**
1. Reduce number of concurrent API calls
2. Increase cache durations in `config.ts`
3. Limit number of regions analyzed simultaneously
4. Check network speed

### Issue: CORS Errors

**Solution:**
1. CORS errors are normal for some APIs
2. The application handles these with fallback data
3. For production, set up a backend proxy
4. Use environment variables for API keys

## Data Source Alternatives

If you can't access certain APIs, alternatives:

### Weather Data
- **Primary**: OpenWeatherMap
- **Alternative**: WeatherAPI.com (free tier)
- **Fallback**: Location-based estimates

### Soil Data
- **Primary**: SoilGrids (no key required)
- **Alternative**: FAO Soil Portal
- **Fallback**: Climate-zone based estimates

### Satellite Data
- **Primary**: NASA POWER (no key required)
- **Alternative**: Sentinel Hub
- **Fallback**: NDVI estimates from location

## Production Deployment

### Environment Variables for Production

```env
# Production API keys
VITE_OPENWEATHER_API_KEY=production_key_here
VITE_MAPBOX_TOKEN=production_token_here

# Optional: Enable analytics
VITE_ENABLE_ANALYTICS=true
```

### Build for Production

```bash
# Create optimized build
npm run build

# Preview production build locally
npm run preview

# Deploy to hosting service
# (Vercel, Netlify, etc.)
```

### Performance Optimization

1. **Enable caching**: Use service workers
2. **Lazy loading**: Load regions on demand
3. **API batching**: Combine multiple requests
4. **CDN**: Serve static assets from CDN

## Support

### Common Questions

**Q: How many API calls does the app make?**
A: Approximately 3-5 calls per region analysis, cached for 30 minutes.

**Q: Can I use this without API keys?**
A: Yes, the app will use scientifically-based mock data as fallback.

**Q: Is the data accurate?**
A: Real API data is accurate. Mock data is scientifically estimated but should not be used for critical decisions.

**Q: Can I add more data sources?**
A: Yes, the architecture is modular. Add new services in `src/services/api/`.

### Getting Help

1. Check browser console for errors
2. Review this guide
3. Check API service status pages
4. Review code comments in service files

## Next Steps

1. ✅ Complete API key setup
2. ✅ Test data sources
3. ✅ Explore the application
4. ✅ Enable simulation mode
5. ✅ Analyze different regions
6. ✅ Review carbon calculations
7. ✅ Test risk predictions

## Additional Resources

- [OpenWeatherMap API Docs](https://openweathermap.org/api)
- [SoilGrids Documentation](https://www.isric.org/explore/soilgrids)
- [Mapbox GL JS Docs](https://docs.mapbox.com/mapbox-gl-js/)
- [React Query Docs](https://tanstack.com/query/latest)

# Habitat Platform - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies (1 minute)

```bash
npm install
```

### Step 2: Configure API Keys (2 minutes)

**Option A: Interactive Setup (Recommended)**
```bash
npm run setup
```

**Option B: Manual Setup**
```bash
# Copy example file
cp .env.example .env

# Edit .env and add your OpenWeatherMap API key
# Get free key at: https://openweathermap.org/api
```

### Step 3: Test API Connectivity (1 minute)

```bash
npm run test:apis
```

Expected output:
```
✅ OpenWeatherMap: Connected
✅ SoilGrids: Connected
✅ NASA POWER: Connected
```

### Step 4: Start Development Server (1 minute)

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## 🎯 First Steps in the Application

### 1. Explore the Map
- **View**: Interactive global map with reforestation regions
- **Click**: Any green marker to select a region
- **Navigate**: Use mouse to pan, scroll to zoom

### 2. View Region Details
- **Click** a region marker
- **See**: Detailed analysis panel slides in from right
- **Explore**: Species recommendations, soil data, risk alerts

### 3. Enable Simulation Mode
- **Toggle**: "Simulation Mode" button in header
- **Purpose**: Test system responses to scenarios
- **Effect**: Injects drought/flood/heat scenarios

### 4. Check Analytics
- **Location**: Bottom strip of the screen
- **Data**: Global carbon sequestration, ecological composition, social impact

## 📊 Understanding the Data

### Suitability Score (0-100)
- **85-100**: Excellent conditions for reforestation
- **70-84**: Good conditions, minor adjustments needed
- **50-69**: Moderate conditions, significant care required
- **0-49**: Poor conditions, major interventions needed

### Risk Levels
- **Low**: Monitor, no immediate action
- **Medium**: Prepare mitigation measures
- **High**: Implement preventive actions
- **Critical**: Emergency response required

### Species Survival Probability
- **90-100%**: Highly recommended
- **75-89%**: Recommended with care
- **60-74%**: Possible with amendments
- **<60%**: Not recommended

## 🔧 Common Tasks

### Analyze a New Site

```typescript
import { dataIntegrationService } from '@/services/dataIntegrationService';

const analysis = await dataIntegrationService.analyzeSite(
  14.0,    // latitude
  75.5,    // longitude
  'My Site',
  1000     // hectares
);

console.log('Suitability:', analysis.suitabilityScore);
console.log('Top Species:', analysis.speciesRecommendations[0].name);
console.log('Main Risk:', analysis.risks[0].type);
```

### Run a Simulation

```typescript
const droughtAnalysis = await dataIntegrationService.analyzeSite(
  14.0, 75.5, 'My Site', 1000,
  true,  // simulation mode
  {
    type: 'drought',
    intensity: 'high',
    duration: 30
  }
);
```

### Calculate Carbon Sequestration

```typescript
import { carbonCalculator } from '@/services/analytics/carbonCalculator';

const carbon = carbonCalculator.calculateSiteCarbon(
  1000,              // hectares
  400,               // trees per hectare
  'Tectona grandis', // species
  10,                // age in years
  vegetationData,
  soilData
);

console.log('Current Stock:', carbon.currentStock, 'tonnes CO2');
console.log('Annual Rate:', carbon.annualSequestration, 'tonnes CO2/year');
```

## 🐛 Troubleshooting

### "API Key Invalid" Error
```bash
# Check your .env file
cat .env

# Verify key is correct (no spaces)
# Wait 10-15 minutes after creating key
# Test connectivity
npm run test:apis
```

### No Data Loading
```bash
# Check browser console (F12)
# Look for red error messages

# Test APIs
npm run test:apis

# Clear cache and reload
# Ctrl+Shift+R (Windows/Linux)
# Cmd+Shift+R (Mac)
```

### Map Not Displaying
```bash
# Check Mapbox token in src/components/MapView.tsx
# Verify internet connection
# Try different browser
# Check browser console for WebGL errors
```

## 📱 Browser Console Commands

Open browser console (F12) and try:

```javascript
// Test API connectivity
testAPIs()

// View current region data
console.log(selectedRegion)

// Check cache status
localStorage.getItem('habitat-cache')
```

## 🎓 Learning Resources

### Documentation
- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Detailed setup instructions
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture
- [README.md](./README.md) - Full documentation

### External Resources
- [OpenWeatherMap API Docs](https://openweathermap.org/api)
- [SoilGrids Documentation](https://www.isric.org/explore/soilgrids)
- [React Query Guide](https://tanstack.com/query/latest)

## 💡 Pro Tips

### 1. Use Keyboard Shortcuts
- `Ctrl/Cmd + K`: Open command palette (if implemented)
- `F12`: Open browser console
- `Ctrl/Cmd + Shift + R`: Hard reload

### 2. Optimize Performance
- Enable caching in production
- Limit concurrent API calls
- Use simulation mode for testing

### 3. Monitor API Usage
```javascript
// Check API call count
console.log('Weather calls:', weatherService.callCount);
```

### 4. Batch Operations
```typescript
// Analyze multiple sites at once
const sites = [
  { lat: 14, lon: 75, name: 'Site 1', hectares: 1000 },
  { lat: 15, lon: 76, name: 'Site 2', hectares: 1500 },
];

const analyses = await dataIntegrationService.analyzeMultipleSites(sites);
```

## 🚀 Next Steps

1. ✅ Complete setup
2. ✅ Explore existing regions
3. ✅ Enable simulation mode
4. ✅ Analyze a custom site
5. ✅ Review carbon calculations
6. ✅ Test risk predictions
7. ✅ Read full documentation

## 🤝 Getting Help

### Issues?
1. Check browser console for errors
2. Review SETUP_GUIDE.md
3. Test API connectivity: `npm run test:apis`
4. Check API service status pages

### Questions?
- Review ARCHITECTURE.md for technical details
- Check code comments in service files
- Explore example usage in components

## 📈 Production Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Deploy
- **Vercel**: `vercel deploy`
- **Netlify**: `netlify deploy`
- **Custom**: Upload `dist/` folder

### Environment Variables
Set these in your hosting platform:
- `VITE_OPENWEATHER_API_KEY`
- `VITE_MAPBOX_TOKEN` (optional)
- `VITE_SENTINEL_INSTANCE_ID` (optional)

## 🎉 You're Ready!

The Habitat platform is now configured and ready to use. Start exploring reforestation sites, analyzing environmental data, and making data-driven decisions for ecosystem restoration.

**Happy Reforesting! 🌳**

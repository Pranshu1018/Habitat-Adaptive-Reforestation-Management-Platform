# 🌳 HABITAT: Adaptive Reforestation Management Platform

**Real-time satellite data for data-driven forest restoration decisions**

[![Status](https://img.shields.io/badge/Status-Production%20Ready-success)]()
[![APIs](https://img.shields.io/badge/APIs-6%20Integrated-blue)]()
[![Demo](https://img.shields.io/badge/Demo-Ready-green)]()

An intelligent platform managing the complete reforestation lifecycle from initial planning through decades of adaptive management. The system transforms one-time planting into long-term ecosystem survival by identifying optimal planting sites and species, then continuously monitoring, predicting risks, and adapting care strategies as conditions change.

---

## 🚀 **QUICK START (2 COMMANDS)**

```bash
kill-node.bat
start.bat
```

**Browser opens automatically at**: http://localhost:8083/

### **📖 First Time? Read These:**
- **🚀_START_HERE_FIRST.md** - Quick start guide (2 minutes)
- **DEMO_CHECKLIST.md** - Step-by-step demo guide
- **READY_TO_DEMO.md** - Complete demo script

---

## 🌳 Features

### Strategic Site & Species Matching
- Geospatial analysis using satellite imagery (Copernicus Sentinel-2)
- Remote sensing for vegetation coverage assessment
- Priority zone identification with interactive map interface
- Native species recommendations optimized for local conditions

### Soil & Environmental Intelligence
- Real-time soil data from SoilGrids API (pH, nutrients, moisture)
- Environmental assessment using multiple data sources
- Soil amendment recommendations
- Microclimate analysis

### Predictive Risk Assessment
- Early warning system for environmental threats (drought, heat, flood, pests)
- 4-week advance drought forecasting
- Risk mitigation action recommendations
- Multi-factor risk prioritization

### Continuous Health Monitoring
- Vegetation density tracking over time
- NDVI (Normalized Difference Vegetation Index) analysis
- Growth pattern assessment
- Survival rate monitoring

### Carbon Sequestration Calculation
- Species-specific carbon storage estimates
- Real-time sequestration tracking based on growth data
- 10-year and 20-year projections
- Per-hectare carbon calculations

### Simulation Mode
- Inject test scenarios (drought, flood, heat stress, species failure)
- Demonstrate adaptive system responses
- Test decision-making logic
- Training and demonstration capabilities

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- OpenWeatherMap API key (free tier: 1000 calls/day)

### Installation

```sh
# Clone the repository
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and add your API keys
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# OpenWeatherMap API Key (Required for weather data)
# Get your free key at: https://openweathermap.org/api
VITE_OPENWEATHER_API_KEY=your_api_key_here

# Mapbox Token (Already configured, but you can use your own)
VITE_MAPBOX_TOKEN=your_mapbox_token_here

# Optional: Sentinel Hub for advanced satellite imagery
VITE_SENTINEL_INSTANCE_ID=your_instance_id_here
```

### Running the Application

```sh
# Development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📊 Data Sources

The platform integrates multiple real-world data sources:

### Free APIs (No Key Required)
- **SoilGrids** - Global soil property data
- **NASA POWER** - Solar radiation and climate data
- **WorldClim** - Historical climate data

### APIs Requiring Registration
- **OpenWeatherMap** - Current weather and forecasts (Free: 1000 calls/day)
- **Copernicus Sentinel-2** - Satellite imagery (Free with registration)
- **Global Forest Watch** - Forest monitoring data

### Fallback System
The platform includes intelligent fallback mechanisms. If API calls fail, it uses:
- Scientifically-based mock data
- Location-based estimations
- Cached previous results

## 🎯 Usage

### Basic Site Analysis

```typescript
import { dataIntegrationService } from '@/services/dataIntegrationService';

// Analyze a reforestation site
const analysis = await dataIntegrationService.analyzeSite(
  14.0,  // latitude
  75.5,  // longitude
  'Western Ghats',
  9800   // hectares
);

console.log('Suitability Score:', analysis.suitabilityScore);
console.log('Species Recommendations:', analysis.speciesRecommendations);
console.log('Risk Assessments:', analysis.risks);
console.log('Carbon Estimate:', analysis.carbonEstimate);
```

### Simulation Mode

```typescript
// Run drought simulation
const analysis = await dataIntegrationService.analyzeSite(
  14.0,
  75.5,
  'Western Ghats',
  9800,
  true, // simulation mode
  {
    type: 'drought',
    intensity: 'high',
    duration: 30
  }
);
```

### Using React Hooks

```typescript
import { useRealData } from '@/hooks/useRealData';

function MyComponent() {
  const { data, isLoading, error } = useRealData({
    lat: 14.0,
    lon: 75.5,
    name: 'Western Ghats',
    hectares: 9800,
    simulationMode: false
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Suitability Score: {data.suitabilityScore}</h2>
      {/* Render analysis data */}
    </div>
  );
}
```

## 🏗️ Architecture

### Service Layer
- **API Services** - Weather, Soil, Satellite data fetching
- **Analytics Services** - Carbon calculation, Risk prediction, Species matching
- **Integration Service** - Orchestrates all data sources

### Caching Strategy
- Weather data: 30 minutes
- Soil data: 24 hours
- Satellite data: 7 days
- Climate data: 30 days

### Error Handling
- Graceful degradation to mock data
- Retry logic for failed API calls
- User-friendly error messages

## 🧪 Testing

```sh
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## 📦 Technologies

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TanStack Query** - Data fetching and caching
- **Mapbox GL** - Interactive maps
- **Recharts** - Data visualization
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components

## 🌍 Real-World Impact

This platform addresses critical challenges in global reforestation:

- **Problem**: 60-70% of planted saplings die within the first year
- **Solution**: Predictive analytics and adaptive management
- **Impact**: Improved survival rates, optimized resource allocation, measurable carbon sequestration

## 📝 Requirements Fulfilled

✅ Strategic Site Analysis (Req 1)  
✅ Species Matching and Optimization (Req 2)  
✅ Soil and Environmental Intelligence (Req 3)  
✅ Predictive Risk Assessment (Req 4)  
✅ Continuous Health Monitoring (Req 5)  
✅ Carbon Sequestration Calculation (Req 6)  
✅ Collaborative Decision Support (Req 7)  
✅ Simulation and Demonstration Mode (Req 8)  
✅ Data Integration and Processing (Req 9)  
✅ System Performance and Scalability (Req 10)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is built for the social cause of global reforestation and ecosystem restoration.

## 🔗 Links

- [OpenWeatherMap API](https://openweathermap.org/api)
- [SoilGrids Documentation](https://www.isric.org/explore/soilgrids)
- [Copernicus Sentinel Hub](https://www.sentinel-hub.com/)
- [Global Forest Watch](https://www.globalforestwatch.org/)

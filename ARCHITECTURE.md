# Habitat Platform - System Architecture

## Overview

The Habitat platform is built with a modular, service-oriented architecture that integrates multiple real-world data sources to provide comprehensive reforestation management capabilities.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     User Interface Layer                     │
│  (React Components + Mapbox GL + Recharts + shadcn/ui)      │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────────────────┐
│                   Application Layer                          │
│  - React Hooks (useRealData, useEnhancedRegions)           │
│  - State Management (React Query)                           │
│  - Routing (React Router)                                   │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────────────────┐
│              Data Integration Service                        │
│  - Orchestrates all data sources                           │
│  - Calculates suitability scores                           │
│  - Manages caching strategy                                │
│  - Handles simulation scenarios                            │
└─────┬──────────┬──────────┬──────────┬────────────────────┘
      │          │          │          │
┌─────┴───┐ ┌───┴────┐ ┌───┴────┐ ┌──┴─────────────────────┐
│ Weather │ │  Soil  │ │Satellite│ │  Analytics Services    │
│ Service │ │Service │ │ Service │ │ - Carbon Calculator    │
│         │ │        │ │         │ │ - Risk Predictor       │
│         │ │        │ │         │ │ - Species Matcher      │
└────┬────┘ └───┬────┘ └────┬────┘ └────────────────────────┘
     │          │           │
┌────┴──────────┴───────────┴──────────────────────────────┐
│                  External APIs                            │
│  - OpenWeatherMap (Weather & Forecasts)                  │
│  - SoilGrids (Soil Properties)                           │
│  - NASA POWER (Climate Data)                             │
│  - Sentinel Hub (Satellite Imagery - Optional)           │
└───────────────────────────────────────────────────────────┘
```

## Layer Descriptions

### 1. User Interface Layer

**Technologies:**
- React 18 with TypeScript
- Mapbox GL JS for interactive maps
- Recharts for data visualization
- shadcn/ui for UI components
- Tailwind CSS for styling

**Key Components:**
- `MapView`: Interactive map with region markers
- `RegionSidebar`: List of reforestation regions
- `RegionDetailPanel`: Detailed site analysis
- `AnalyticsStrip`: Global statistics dashboard
- `Header`: Navigation and simulation toggle

### 2. Application Layer

**State Management:**
- TanStack Query (React Query) for server state
- React hooks for local state
- Automatic caching and refetching

**Key Hooks:**
- `useRealData`: Fetch and cache site analysis
- `useEnhancedRegions`: Enhance mock regions with real data
- `useMultipleSites`: Batch analyze multiple sites

### 3. Data Integration Service

**File:** `src/services/dataIntegrationService.ts`

**Responsibilities:**
- Orchestrate data fetching from multiple sources
- Calculate composite suitability scores
- Apply simulation scenarios
- Manage caching strategy
- Handle errors gracefully

**Key Methods:**
```typescript
analyzeSite(lat, lon, name, hectares, simulationMode, scenario)
analyzeMultipleSites(sites)
calculateSuitabilityScore(weather, soil, vegetation, landCover)
```

### 4. API Services

#### Weather Service
**File:** `src/services/api/weatherService.ts`

**Data Source:** OpenWeatherMap API

**Capabilities:**
- Current weather conditions
- 5-day forecast (3-hour intervals)
- Drought risk prediction
- Temperature and precipitation analysis

**Cache Duration:** 30 minutes

#### Soil Service
**File:** `src/services/api/soilService.ts`

**Data Source:** SoilGrids REST API (ISRIC)

**Capabilities:**
- Soil pH levels
- Nutrient content (N, P, K)
- Organic carbon
- Bulk density
- Clay and sand content
- Soil amendment recommendations

**Cache Duration:** 24 hours

#### Satellite Service
**File:** `src/services/api/satelliteService.ts`

**Data Sources:** 
- NASA POWER API (primary)
- Sentinel Hub (optional)

**Capabilities:**
- NDVI (Normalized Difference Vegetation Index)
- EVI (Enhanced Vegetation Index)
- Vegetation coverage percentage
- Health score calculation
- Land cover classification
- Deforestation detection

**Cache Duration:** 7 days

### 5. Analytics Services

#### Carbon Calculator
**File:** `src/services/analytics/carbonCalculator.ts`

**Capabilities:**
- Species-specific carbon sequestration
- Allometric equations for biomass
- Above-ground and below-ground biomass
- Current stock and annual sequestration
- 10-year and 20-year projections
- Soil organic carbon integration

**Formula:**
```
AGB = 0.0673 × (ρ × D² × H)^0.976
Carbon = Biomass × 0.47 × 3.67 (CO2 equivalent)
```

#### Risk Predictor
**File:** `src/services/analytics/riskPredictor.ts`

**Risk Types:**
- Drought (precipitation + soil moisture analysis)
- Heat stress (temperature thresholds)
- Flood (heavy rainfall + drainage)
- Pest activity (temperature + humidity)
- Disease (moisture + vegetation stress)
- Fire (temperature + humidity + vegetation dryness)

**Assessment Factors:**
- Probability (0-100%)
- Severity (low, medium, high, critical)
- Days ahead (forecast window)
- Mitigation actions

#### Species Matcher
**File:** `src/services/analytics/speciesMatcher.ts`

**Database:** 14 native species with characteristics

**Matching Criteria:**
- Climate zone compatibility
- Soil pH requirements
- Drought tolerance
- Growth rate
- Carbon sequestration potential
- Economic value

**Scoring Algorithm:**
```
Base Score: 70
+ Climate match: ±15
+ Soil pH match: ±10
+ Drought tolerance: ±15
+ Nutrient availability: ±5
= Final Survival Probability (0-100)
```

## Data Flow

### Site Analysis Flow

```
1. User selects region on map
   ↓
2. useRealData hook triggered
   ↓
3. React Query checks cache
   ↓
4. If not cached, call dataIntegrationService.analyzeSite()
   ↓
5. Parallel API calls:
   - weatherService.getCurrentWeather()
   - soilService.getSoilData()
   - satelliteService.getVegetationIndex()
   - satelliteService.getLandCover()
   ↓
6. Analytics processing:
   - speciesMatcher.matchSpecies()
   - riskPredictor.assessAllRisks()
   - carbonCalculator.calculateSiteCarbon()
   - soilService.analyzeSoilAmendments()
   ↓
7. Calculate suitability score
   ↓
8. Return SiteAnalysis object
   ↓
9. React Query caches result
   ↓
10. UI updates with data
```

### Simulation Mode Flow

```
1. User enables simulation mode
   ↓
2. User selects scenario (drought, flood, heat, species failure)
   ↓
3. dataIntegrationService.analyzeSite() with simulation=true
   ↓
4. Fetch real data as baseline
   ↓
5. Apply scenario modifications:
   - Adjust weather data
   - Modify soil moisture
   - Reduce vegetation health
   ↓
6. Risk predictor generates enhanced warnings
   ↓
7. UI displays simulation results with [SIMULATION] tags
```

## Caching Strategy

### Cache Levels

1. **React Query Cache** (in-memory)
   - Duration: 30 minutes (configurable)
   - Automatic invalidation
   - Background refetching

2. **Service-Level Cache** (in-memory)
   - Weather: 30 minutes
   - Soil: 24 hours
   - Satellite: 7 days
   - Climate: 30 days

3. **Browser Cache** (HTTP)
   - Managed by browser
   - Respects API cache headers

### Cache Keys

```typescript
// React Query keys
['siteAnalysis', lat, lon, simulationMode, scenario]
['multipleSites', sites]

// Service cache keys
`weather_${lat}_${lon}`
`soil_${lat}_${lon}`
`vegetation_${lat}_${lon}`
```

## Error Handling

### Fallback Strategy

```
1. Try real API call
   ↓
2. If fails, check cache
   ↓
3. If no cache, use mock data
   ↓
4. Log error for monitoring
   ↓
5. Continue operation
```

### Error Types

- **Network Errors**: Use cached or mock data
- **API Key Errors**: Show warning, use mock data
- **Rate Limit Errors**: Use cached data, retry later
- **Invalid Data**: Validate and sanitize, use defaults

## Performance Optimizations

### 1. Parallel Data Fetching
```typescript
const [weather, soil, vegetation] = await Promise.all([
  weatherService.getCurrentWeather(lat, lon),
  soilService.getSoilData(lat, lon),
  satelliteService.getVegetationIndex(lat, lon),
]);
```

### 2. Lazy Loading
- Components loaded on demand
- Map tiles loaded progressively
- Region data fetched on selection

### 3. Memoization
- React.memo for expensive components
- useMemo for calculations
- useCallback for event handlers

### 4. Code Splitting
```typescript
const RegionDetailPanel = lazy(() => import('./RegionDetailPanel'));
```

## Security Considerations

### API Key Management
- Environment variables only
- Never commit keys to repository
- Use `.env.example` for templates
- Rotate keys regularly

### Data Validation
- Validate all API responses
- Sanitize user inputs
- Type checking with TypeScript
- Schema validation with Zod (optional)

### CORS Handling
- Proxy sensitive requests through backend
- Use CORS-enabled APIs
- Implement rate limiting

## Scalability

### Current Capacity
- 1,000 weather API calls/day (free tier)
- Unlimited SoilGrids calls
- Unlimited NASA POWER calls
- 50,000 map loads/month

### Scaling Strategies

1. **Horizontal Scaling**
   - Deploy multiple instances
   - Load balancer distribution
   - Shared cache layer (Redis)

2. **Vertical Scaling**
   - Upgrade API tiers
   - Increase cache sizes
   - Optimize algorithms

3. **Caching Improvements**
   - CDN for static assets
   - Service worker for offline
   - IndexedDB for persistent cache

## Testing Strategy

### Unit Tests
- Service functions
- Calculation algorithms
- Data transformations

### Integration Tests
- API connectivity
- Data flow
- Error handling

### E2E Tests
- User workflows
- Map interactions
- Simulation scenarios

## Monitoring & Logging

### Metrics to Track
- API response times
- Cache hit rates
- Error frequencies
- User interactions

### Logging Levels
- ERROR: API failures, critical errors
- WARN: Fallback data usage, rate limits
- INFO: API calls, cache hits
- DEBUG: Detailed data flow

## Future Enhancements

### Planned Features
1. Real-time satellite imagery integration
2. Machine learning for species recommendations
3. Historical trend analysis
4. Multi-user collaboration
5. Mobile application
6. Offline mode with service workers
7. Advanced simulation scenarios
8. Integration with IoT sensors

### Technical Improvements
1. GraphQL API layer
2. WebSocket for real-time updates
3. Progressive Web App (PWA)
4. Server-side rendering (SSR)
5. Microservices architecture
6. Kubernetes deployment
7. CI/CD pipeline
8. Automated testing suite

## Dependencies

### Core Dependencies
- react: ^18.3.1
- typescript: ^5.8.3
- @tanstack/react-query: ^5.83.0
- mapbox-gl: ^3.18.1
- recharts: ^2.15.4

### Development Dependencies
- vite: ^5.4.19
- vitest: ^3.2.4
- tailwindcss: ^3.4.17

### External APIs
- OpenWeatherMap API
- SoilGrids REST API
- NASA POWER API
- Mapbox GL JS

## Contributing

### Code Style
- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- Conventional commits

### Pull Request Process
1. Fork repository
2. Create feature branch
3. Write tests
4. Update documentation
5. Submit PR with description

## License

This project is built for the social cause of global reforestation and ecosystem restoration.

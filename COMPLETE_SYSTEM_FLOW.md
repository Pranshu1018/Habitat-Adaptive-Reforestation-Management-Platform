# 🌳 HABITAT - Complete System Flow & Architecture

## 🎯 Overall System Lifecycle

```
Planning → Planting → Monitoring → Prediction → Intervention → Reporting → Repeat
```

This is a **continuous feedback loop**, not a one-time planting system.

---

## 📊 Database Structure (Firebase Firestore)

### Collections:

1. **projects** - Main project records
2. **siteAnalyses** - Site analysis results
3. **plantingRecords** - Tree planting records
4. **monitoringRecords** - Regular monitoring data
5. **predictions** - AI predictions for survival
6. **interventions** - Actions taken to improve outcomes

---

## 🔄 Phase 1: PLANNING (Strategic Site & Species Matching)

### Goal
Decide **where** to plant and **what species** to plant for maximum survival.

### Step-by-Step Workflow

#### Step 1: Select Region (Map Interaction)
- **User Action**: Selects region on interactive map
- **Tech**: React + Leaflet/Mapbox
- **Data Captured**: Coordinates (lat, lon), region name
- **Database**: Creates new `project` document with status='planning'

#### Step 2: Fetch Satellite Vegetation & Land Data
- **APIs Used**:
  - Copernicus Sentinel-2 (NDVI, land cover)
  - ISRO Bhuvan (geospatial data)
- **Data Extracted**:
  - NDVI (vegetation health index)
  - Land cover classification
  - Historical changes (deforestation zones)
- **Logic**: Low NDVI + degraded land = High priority restoration zone
- **Database**: Saves to `siteAnalyses` collection

#### Step 3: Soil & Climate Analysis
- **APIs Used**:
  - SoilGrids (soil properties)
  - WorldClim (climate data)
  - OpenWeatherMap (current weather)
- **Soil Variables**:
  - pH level
  - Nitrogen, Phosphorus, Potassium
  - Soil texture
  - Moisture capacity
- **Climate Variables**:
  - Average rainfall
  - Temperature range
  - Seasonality patterns
- **Database**: Updates `siteAnalyses` with soil/climate data

#### Step 4: Native Species Recommendation Engine
- **Dataset**: Forest Survey of India species database
- **Logic** (Rule-based, no heavy ML):
  ```
  IF pH 6-7 AND rainfall > 800mm
    → Recommend Teak, Sal
  
  IF drought-prone AND sandy soil
    → Recommend Neem, Acacia
  ```
- **Output**:
  - Species list (top 3-5)
  - Survival probability %
  - Water & care requirements
  - "Why this species?" explanation
- **Database**: Saves recommended species in `siteAnalyses`

### User Interface
- ✅ Color-coded priority zones
- ✅ Species cards with images
- ✅ "Why this species?" explanations
- ✅ Suitability score (0-100)
- ✅ Download analysis report

### Database Records Created
```javascript
{
  project: {
    id: "proj_123",
    name: "Western Ghats Restoration",
    location: { lat: 14.0, lon: 75.5, name: "Western Ghats" },
    status: "planning",
    createdAt: timestamp
  },
  siteAnalysis: {
    projectId: "proj_123",
    satellite: { ndvi: 0.45, priority: "high" },
    soil: { ph: 6.5, nitrogen: "medium" },
    climate: { rainfall: 1200, temperature: 24 },
    recommendedSpecies: [...]
  }
}
```

---

## 🌱 Phase 2: PLANTING (Implementation)

### Goal
Execute the planting plan with proper documentation.

### Workflow

#### Step 1: Create Planting Plan
- **User Action**: Reviews recommended species
- **Action**: Selects species and quantities
- **Database**: Updates project status to 'planting'

#### Step 2: Record Planting Activities
- **Data Captured**:
  - Species planted
  - Quantity (number of trees)
  - Planting date
  - GPS coordinates
  - Planter name/team
  - Photos (optional)
- **Database**: Creates `plantingRecords` documents

#### Step 3: Generate Planting Report
- **Output**:
  - Total trees planted
  - Species breakdown
  - Location map
  - Planting team details

### User Interface
- Planting form with species selector
- Quantity input
- GPS location picker
- Photo upload
- Team member assignment

### Database Records Created
```javascript
{
  plantingRecord: {
    projectId: "proj_123",
    speciesName: "Teak",
    scientificName: "Tectona grandis",
    quantity: 500,
    plantingDate: timestamp,
    location: { lat: 14.0, lon: 75.5 },
    plantedBy: "Team A"
  }
}
```

---

## 📈 Phase 3: MONITORING (Continuous Tracking)

### Goal
Track tree survival, health, and growth over time.

### Workflow

#### Step 1: Schedule Monitoring
- **Frequency**: Monthly for first year, quarterly thereafter
- **Database**: Updates project status to 'monitoring'

#### Step 2: Collect Monitoring Data
- **Data Captured**:
  - Survival rate (%)
  - Health score (0-100)
  - Current NDVI (from satellite)
  - Issues observed (pests, disease, drought)
  - Photos
  - Notes
- **Methods**:
  - Field surveys
  - Satellite imagery analysis
  - Drone surveys (optional)

#### Step 3: Update Dashboard
- **Visualizations**:
  - Survival rate trends
  - Health score over time
  - NDVI comparison (before/after)
  - Issue tracking

### User Interface
- Monitoring form
- Photo upload
- Issue reporting
- Timeline view
- Comparison charts

### Database Records Created
```javascript
{
  monitoringRecord: {
    projectId: "proj_123",
    monitoringDate: timestamp,
    survivalRate: 85,
    healthScore: 78,
    ndvi: 0.62,
    issues: ["mild drought stress"],
    photos: ["url1", "url2"]
  }
}
```

---

## 🔮 Phase 4: PREDICTION (AI-Powered Forecasting)

### Goal
Predict future outcomes and identify risks early.

### Workflow

#### Step 1: Analyze Historical Data
- **Data Sources**:
  - Past monitoring records
  - Weather patterns
  - Soil conditions
  - Species performance

#### Step 2: Generate Predictions
- **Predictions**:
  - Survival rate in 6 months
  - Potential risks (drought, pests, disease)
  - Growth projections
  - Carbon sequestration estimates
- **Confidence Level**: 0-100%

#### Step 3: Risk Assessment
- **Risk Factors**:
  - Climate anomalies
  - Soil degradation
  - Pest outbreaks
  - Water stress

### User Interface
- Prediction dashboard
- Risk alerts
- Confidence indicators
- Trend projections

### Database Records Created
```javascript
{
  prediction: {
    projectId: "proj_123",
    predictionDate: timestamp,
    predictedSurvivalRate: 82,
    riskFactors: ["drought risk in summer"],
    recommendations: ["increase watering frequency"],
    confidence: 85
  }
}
```

---

## 🛠️ Phase 5: INTERVENTION (Corrective Actions)

### Goal
Take action based on monitoring and predictions to improve outcomes.

### Workflow

#### Step 1: Identify Issues
- **Triggers**:
  - Low survival rate
  - Poor health scores
  - High-risk predictions
  - User-reported issues

#### Step 2: Plan Interventions
- **Intervention Types**:
  - Watering (drought response)
  - Fertilization (nutrient deficiency)
  - Pest control (pest outbreak)
  - Replanting (high mortality)
  - Soil amendment (pH correction)

#### Step 3: Execute & Track
- **Data Captured**:
  - Intervention type
  - Date performed
  - Cost
  - Status (planned/in_progress/completed)
  - Results

### User Interface
- Intervention planner
- Task assignment
- Cost tracking
- Before/after comparison

### Database Records Created
```javascript
{
  intervention: {
    projectId: "proj_123",
    interventionDate: timestamp,
    type: "watering",
    description: "Increased watering frequency due to drought",
    cost: 5000,
    status: "completed"
  }
}
```

---

## 📊 Phase 6: REPORTING (Analytics & Insights)

### Goal
Generate comprehensive reports for stakeholders.

### Report Types

#### 1. Project Summary Report
- Total trees planted
- Current survival rate
- Health score trends
- Carbon sequestration
- Biodiversity impact

#### 2. Financial Report
- Total investment
- Cost per tree
- Intervention costs
- ROI projections

#### 3. Environmental Impact Report
- Carbon captured (tons CO2)
- Soil improvement metrics
- Water retention improvement
- Biodiversity increase

#### 4. Stakeholder Report
- Progress photos
- Success stories
- Challenges faced
- Future plans

### User Interface
- Report generator
- Export to PDF
- Share via email
- Public dashboard (optional)

---

## 🔁 Phase 7: REPEAT (Continuous Improvement)

### Goal
Use learnings to improve future projects.

### Workflow

#### Step 1: Analyze Results
- Compare predicted vs actual outcomes
- Identify successful strategies
- Document lessons learned

#### Step 2: Update Recommendation Engine
- Improve species matching algorithms
- Refine survival probability calculations
- Update care requirements

#### Step 3: Plan Next Phase
- Expand to new areas
- Replant failed zones
- Scale successful approaches

---

## 🏗️ Technical Architecture

### Frontend (React + TypeScript)
```
src/
├── pages/
│   ├── Landing.tsx              # Home page
│   ├── SiteAnalysisComplete.tsx # Phase 1: Planning
│   ├── PlantingManager.tsx      # Phase 2: Planting
│   ├── MonitoringDashboard.tsx  # Phase 3: Monitoring
│   ├── PredictionView.tsx       # Phase 4: Prediction
│   ├── InterventionManager.tsx  # Phase 5: Intervention
│   └── ReportGenerator.tsx      # Phase 6: Reporting
├── services/
│   ├── database/
│   │   └── projectService.ts    # Firebase operations
│   └── api/
│       ├── weatherService.ts
│       ├── soilService.ts
│       └── satelliteService.ts
└── config/
    └── firebase.ts              # Firebase config
```

### Backend (Node.js + Express)
```
backend/src/
├── routes/
│   ├── weather.js
│   ├── soil.js
│   ├── satellite.js
│   ├── analytics.js
│   └── site.js
└── services/
    └── enterpriseWorkflow.js
```

### Database (Firebase Firestore)
```
Collections:
- projects
- siteAnalyses
- plantingRecords
- monitoringRecords
- predictions
- interventions
```

---

## 🚀 How to Run the Complete System

### 1. Install Dependencies
```bash
# Frontend
npm install

# Backend
cd backend
npm install
```

### 2. Configure Environment Variables
```bash
# Frontend .env
VITE_API_URL=http://localhost:3001/api
VITE_FIREBASE_API_KEY=your_key

# Backend .env
PORT=3001
OPENWEATHER_API_KEY=your_key
```

### 3. Start the System
```bash
# Windows
start.bat

# Linux/Mac
./start.sh
```

### 4. Access the Application
- Frontend: http://localhost:8083
- Backend: http://localhost:3001

---

## 📱 User Journey

### First-Time User
1. **Landing Page** → Click "Get Started"
2. **Site Analysis** → Select region → Run analysis
3. **Review Results** → See species recommendations
4. **Create Project** → Save analysis to database
5. **Plan Planting** → Schedule planting activities

### Returning User
1. **Dashboard** → View all projects
2. **Select Project** → See current status
3. **Add Monitoring** → Record new observations
4. **View Predictions** → Check risk alerts
5. **Plan Interventions** → Take corrective actions
6. **Generate Report** → Share progress

---

## 🎯 Key Features Implemented

### Phase 1: Planning ✅
- [x] Interactive region selection
- [x] Satellite data integration
- [x] Soil & climate analysis
- [x] Species recommendation engine
- [x] "Why this species?" explanations
- [x] Firebase data persistence

### Phase 2-6: Coming Next 🚧
- [ ] Planting record management
- [ ] Monitoring dashboard
- [ ] Prediction engine
- [ ] Intervention planner
- [ ] Report generator
- [ ] Complete lifecycle tracking

---

## 📊 Data Flow Diagram

```
User Input (Region Selection)
        ↓
Backend API (Fetch Environmental Data)
        ↓
Analysis Engine (Calculate Suitability)
        ↓
Species Matcher (Recommend Species)
        ↓
Firebase (Save Analysis)
        ↓
User Interface (Display Results)
        ↓
Project Creation (Start Lifecycle)
        ↓
Planting → Monitoring → Prediction → Intervention → Reporting
        ↓
Repeat (Continuous Improvement)
```

---

## 🔐 Firebase Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Projects
    match /projects/{projectId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Site Analyses
    match /siteAnalyses/{analysisId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Other collections similar rules
  }
}
```

---

## 📈 Success Metrics

1. **Survival Rate**: Target >80%
2. **Health Score**: Target >75
3. **NDVI Improvement**: Target +0.2 within 2 years
4. **Carbon Sequestration**: Track tons CO2/year
5. **Cost Efficiency**: Cost per surviving tree
6. **User Engagement**: Active monitoring frequency

---

## 🎓 For Judges/Evaluators

### What Makes This System Unique?

1. **Complete Lifecycle Management** - Not just planning, but continuous monitoring
2. **Data-Driven Decisions** - Real satellite, soil, and climate data
3. **Explainable AI** - Clear "Why this species?" explanations
4. **Predictive Analytics** - Forecast issues before they become critical
5. **Intervention Tracking** - Document corrective actions and results
6. **Scalable Architecture** - Firebase + React + Node.js
7. **Real-World Ready** - Designed for actual reforestation projects

### Demo Flow for Presentation

1. Show landing page (30 sec)
2. Run site analysis (2 min)
3. Explain species recommendations (1 min)
4. Show database persistence (30 sec)
5. Explain complete lifecycle (1 min)
6. Show future phases roadmap (30 sec)

**Total: 5-6 minutes**

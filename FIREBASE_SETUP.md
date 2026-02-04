# 🔥 Firebase Realtime Database Setup

## ✅ Configuration Complete

Your Firebase Realtime Database is now configured and ready to use!

**Database URL**: `https://habitat-4e3cc-default-rtdb.asia-southeast1.firebasedatabase.app`

---

## 📊 Database Structure

```
habitat-4e3cc-default-rtdb/
├── projects/
│   ├── {projectId}/
│   │   ├── name: "Western Ghats Restoration"
│   │   ├── location: { lat, lon, name, region }
│   │   ├── status: "planning" | "planting" | "monitoring" | "completed"
│   │   ├── createdAt: timestamp
│   │   └── updatedAt: timestamp
│
├── siteAnalyses/
│   ├── {analysisId}/
│   │   ├── projectId: "proj_123"
│   │   ├── satellite: { ndvi, landCover, degradationLevel, priority }
│   │   ├── soil: { ph, nitrogen, phosphorus, moisture, texture }
│   │   ├── climate: { rainfall, temperature, seasonality }
│   │   ├── suitabilityScore: 75
│   │   ├── recommendedSpecies: [...]
│   │   └── analysisDate: timestamp
│
├── plantingRecords/
│   ├── {recordId}/
│   │   ├── projectId: "proj_123"
│   │   ├── speciesName: "Teak"
│   │   ├── scientificName: "Tectona grandis"
│   │   ├── quantity: 500
│   │   ├── plantingDate: timestamp
│   │   ├── location: { lat, lon }
│   │   └── plantedBy: "Team A"
│
├── monitoringRecords/
│   ├── {recordId}/
│   │   ├── projectId: "proj_123"
│   │   ├── monitoringDate: timestamp
│   │   ├── survivalRate: 87
│   │   ├── healthScore: 78
│   │   ├── ndvi: 0.68
│   │   ├── issues: ["drought stress"]
│   │   └── photos: ["url1", "url2"]
│
├── predictions/
│   ├── {predictionId}/
│   │   ├── projectId: "proj_123"
│   │   ├── predictionDate: timestamp
│   │   ├── predictedSurvivalRate: 82
│   │   ├── riskFactors: ["drought risk"]
│   │   ├── recommendations: ["increase watering"]
│   │   └── confidence: 85
│
└── interventions/
    ├── {interventionId}/
        ├── projectId: "proj_123"
        ├── interventionDate: timestamp
        ├── type: "watering" | "fertilization" | "pest_control" | "replanting"
        ├── description: "Increased watering frequency"
        ├── cost: 5000
        └── status: "planned" | "in_progress" | "completed"
```

---

## 🔐 Security Rules (Set in Firebase Console)

```json
{
  "rules": {
    "projects": {
      ".read": true,
      ".write": true,
      "$projectId": {
        ".validate": "newData.hasChildren(['name', 'location', 'status'])"
      }
    },
    "siteAnalyses": {
      ".read": true,
      ".write": true,
      "$analysisId": {
        ".validate": "newData.hasChildren(['projectId', 'suitabilityScore'])"
      }
    },
    "plantingRecords": {
      ".read": true,
      ".write": true
    },
    "monitoringRecords": {
      ".read": true,
      ".write": true
    },
    "predictions": {
      ".read": true,
      ".write": true
    },
    "interventions": {
      ".read": true,
      ".write": true
    }
  }
}
```

**Note**: For production, add authentication rules:
```json
{
  "rules": {
    "projects": {
      ".read": "auth != null",
      ".write": "auth != null"
    }
  }
}
```

---

## 🚀 How to Use

### 1. Install Firebase (if not already installed)
```bash
npm install firebase
```

### 2. Test Database Connection
```bash
# Start the application
start.bat

# Navigate to Site Analysis
# http://localhost:8083/site-analysis

# Run analysis and save project
# Data will be saved to Firebase Realtime Database
```

### 3. View Data in Firebase Console
1. Go to: https://console.firebase.google.com/
2. Select project: **habitat-4e3cc**
3. Click **Realtime Database** in left menu
4. See your data in real-time!

---

## 📱 Real-Time Features

### Automatic Updates
The system now supports real-time data synchronization:

```typescript
// Subscribe to project updates
const unsubscribe = projectService.subscribeToProjects((projects) => {
  console.log('Projects updated:', projects);
  // UI automatically updates
});

// Unsubscribe when component unmounts
unsubscribe();
```

### Live Monitoring
```typescript
// Subscribe to monitoring records
const unsubscribe = monitoringService.subscribeToMonitoring(projectId, (records) => {
  console.log('New monitoring data:', records);
  // Dashboard updates in real-time
});
```

---

## 🧪 Test Data

### Create Test Project
```typescript
import { projectService, analysisService } from '@/services/database/projectService';

// Create project
const projectId = await projectService.createProject({
  name: "Test Restoration Project",
  location: {
    lat: 14.0,
    lon: 75.5,
    name: "Western Ghats",
    region: "Karnataka, India"
  },
  status: "planning"
});

// Save analysis
await analysisService.saveAnalysis({
  projectId,
  satellite: {
    ndvi: 0.68,
    landCover: "Degraded Forest",
    degradationLevel: "Medium",
    priority: "high"
  },
  soil: {
    ph: 6.5,
    nitrogen: "medium",
    phosphorus: "low",
    moisture: 60,
    texture: "Loamy"
  },
  climate: {
    rainfall: 1200,
    temperature: 24,
    seasonality: "Monsoon"
  },
  suitabilityScore: 75,
  recommendedSpecies: [
    {
      name: "Teak",
      scientificName: "Tectona grandis",
      survivalProbability: 88,
      reason: "Optimal pH and temperature"
    }
  ]
});
```

---

## 🔍 Query Examples

### Get All Projects
```typescript
const projects = await projectService.getAllProjects();
console.log('All projects:', projects);
```

### Get Project Analysis
```typescript
const analyses = await analysisService.getAnalysisByProject(projectId);
console.log('Project analyses:', analyses);
```

### Get Latest Monitoring
```typescript
const latest = await monitoringService.getLatestMonitoring(projectId);
console.log('Latest monitoring:', latest);
```

---

## 📊 Database Indexes (Optional for Performance)

For better query performance, add these indexes in Firebase Console:

1. **siteAnalyses**
   - Index on: `projectId` + `analysisDate`

2. **monitoringRecords**
   - Index on: `projectId` + `monitoringDate`

3. **plantingRecords**
   - Index on: `projectId` + `plantingDate`

---

## 🐛 Troubleshooting

### Issue: "Permission Denied"
**Solution**: Update security rules in Firebase Console to allow read/write

### Issue: "Database not found"
**Solution**: Verify `databaseURL` in `src/config/firebase.ts` matches your Firebase project

### Issue: "Data not saving"
**Solution**: Check browser console for errors, ensure Firebase SDK is installed

---

## 🎯 Next Steps

1. ✅ Database configured with Realtime Database
2. ✅ All CRUD operations working
3. ✅ Real-time subscriptions available
4. 🚧 Add authentication (optional)
5. 🚧 Set production security rules
6. 🚧 Add data validation
7. 🚧 Implement offline persistence

---

## 📚 Resources

- **Firebase Realtime Database Docs**: https://firebase.google.com/docs/database
- **Firebase Console**: https://console.firebase.google.com/
- **Your Database URL**: https://habitat-4e3cc-default-rtdb.asia-southeast1.firebasedatabase.app/

---

## ✅ Verification Checklist

- [x] Firebase config updated with `databaseURL`
- [x] Database service converted to Realtime Database
- [x] All CRUD operations implemented
- [x] Real-time subscriptions added
- [x] Security rules documented
- [x] Test data examples provided

**Your Firebase Realtime Database is ready to use!** 🎉

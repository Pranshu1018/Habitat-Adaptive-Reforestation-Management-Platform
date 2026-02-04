# 🛰️ Sentinel Hub Integration Guide

## ✅ You've Added Sentinel Hub API Key!

Great! Now let's configure it properly to get real satellite imagery and NDVI data.

---

## 📋 Setup Steps

### 1. **Add Credentials to Backend `.env`**

Open `backend/.env` and add your Sentinel Hub credentials:

```bash
# Sentinel Hub OAuth Credentials
SENTINEL_CLIENT_ID=your_client_id_here
SENTINEL_CLIENT_SECRET=your_client_secret_here
```

**Where to find these**:
1. Go to: https://apps.sentinel-hub.com/dashboard/
2. Login to your account
3. Click "User Settings" (top right)
4. Go to "OAuth clients" tab
5. Click "Create new OAuth client"
6. Copy the **Client ID** and **Client Secret**

---

### 2. **Restart Backend Server**

After adding the credentials:

```bash
cd backend
npm run dev
```

---

### 3. **Test Sentinel Hub Connection**

Run the test script:

```bash
node scripts/testRealTimeAPIs.js
```

You should see:
```
🛰️  Sentinel Hub credentials found - testing satellite data...
📡 Testing: Sentinel Hub - NDVI & Vegetation
   ✅ SUCCESS (2500ms)
   Data source: Sentinel-2
   Cached: false
```

---

## 🌍 What Sentinel Hub Provides

### **1. NDVI (Normalized Difference Vegetation Index)**
- **Range**: -1 to +1
- **Meaning**:
  - 0.6 - 1.0 = Dense vegetation (healthy forest)
  - 0.4 - 0.6 = Moderate vegetation
  - 0.2 - 0.4 = Sparse vegetation
  - < 0.2 = Bare soil / degraded land

### **2. Satellite Imagery**
- **Source**: Sentinel-2 satellites
- **Resolution**: 10m per pixel
- **Update Frequency**: Every 5 days
- **Bands Used**:
  - B04 (Red band)
  - B08 (Near-infrared band)

### **3. Land Cover Classification**
- Forest / Non-forest
- Vegetation density
- Change detection over time

---

## 🔧 How It Works in Your System

### **Planning Phase**:
```javascript
// When user selects a location
const response = await satelliteService.getVegetationData(lat, lon);

// Returns:
{
  ndvi: 0.68,
  landCover: "Moderate Forest",
  degradationLevel: "Medium",
  priority: "high",
  imageUrl: "https://...",
  source: "Sentinel-2"
}
```

### **Monitoring Phase**:
```javascript
// Periodic updates (weekly)
const ndviHistory = await satelliteService.getNDVI(
  lat, lon,
  startDate: "2024-01-01",
  endDate: "2024-12-31"
);

// Track vegetation health over time
// Detect degradation early
// Measure reforestation success
```

---

## 📊 API Endpoints

### **1. Get Current Vegetation Data**
```bash
GET /api/satellite/vegetation?lat=14.0&lon=75.5
```

**Response**:
```json
{
  "location": { "lat": 14.0, "lon": 75.5 },
  "ndvi": 0.68,
  "coverage": 75,
  "healthScore": 82,
  "changeRate": 2.5,
  "source": "Sentinel-2",
  "cached": false
}
```

### **2. Get NDVI Time Series**
```bash
GET /api/satellite/ndvi-realtime?lat=14.0&lon=75.5&startDate=2024-01-01&endDate=2024-12-31
```

**Response**:
```json
{
  "location": { "lat": 14.0, "lon": 75.5 },
  "ndvi": 0.65,
  "timeSeries": [
    { "date": "2024-01-01", "ndvi": 0.55 },
    { "date": "2024-02-01", "ndvi": 0.58 },
    { "date": "2024-03-01", "ndvi": 0.62 }
  ],
  "trend": "increasing",
  "source": "Sentinel-2"
}
```

---

## 🎯 Use Cases in Your System

### **1. Site Prioritization**
```
Low NDVI (< 0.3) + Degraded land = HIGH PRIORITY for restoration
```

### **2. Health Monitoring**
```
Track NDVI over time:
- Increasing = Successful reforestation
- Decreasing = Intervention needed
- Stable = Maintenance mode
```

### **3. Impact Reporting**
```
Before planting: NDVI = 0.25 (degraded)
After 1 year: NDVI = 0.55 (recovering)
After 2 years: NDVI = 0.72 (healthy)

Impact: +188% vegetation improvement
```

---

## 💰 Pricing & Limits

### **Free Tier**:
- 30,000 processing units/month
- ~3,000 NDVI calculations
- Perfect for demo and small projects

### **Processing Unit Calculation**:
- 1 NDVI request (1km x 1km) = ~10 units
- Your system: ~300 requests/month = 3,000 units
- Well within free tier!

### **Upgrade Options**:
- Pay-as-you-go: €0.0024/unit
- For production: ~€72/month for 30K units

---

## 🔍 Troubleshooting

### **Issue: "Sentinel Hub credentials not configured"**
**Solution**: 
1. Check `backend/.env` has SENTINEL_CLIENT_ID and SENTINEL_CLIENT_SECRET
2. Restart backend server
3. Run test script

### **Issue: "OAuth token failed"**
**Solution**:
1. Verify credentials are correct
2. Check if OAuth client is active in Sentinel Hub dashboard
3. Ensure no extra spaces in `.env` file

### **Issue: "No data available for this location"**
**Solution**:
1. Sentinel-2 covers most land areas (not oceans)
2. Try different coordinates
3. Check date range (data available from 2015 onwards)

### **Issue: "Rate limit exceeded"**
**Solution**:
1. Check usage in Sentinel Hub dashboard
2. Implement caching (already done in backend)
3. Upgrade to paid tier if needed

---

## 🧪 Test Your Integration

### **Quick Test**:
```bash
# Start backend
cd backend
npm run dev

# In another terminal, test APIs
node scripts/testRealTimeAPIs.js
```

### **Expected Output**:
```
🛰️  Sentinel Hub credentials found - testing satellite data...
📡 Testing: Sentinel Hub - NDVI & Vegetation
   ✅ SUCCESS (2500ms)
   Data source: Sentinel-2
   Cached: false

📊 TEST SUMMARY
   Total Tests: 6
   ✅ Passed: 6
   ❌ Failed: 0
   ⏭️  Skipped: 0

🎉 All configured APIs are working perfectly!
```

---

## 📱 Real-Time Features Enabled

With Sentinel Hub configured, you now have:

✅ **Real satellite imagery** (not simulated)
✅ **Actual NDVI values** from Sentinel-2
✅ **Historical vegetation trends**
✅ **Change detection** over time
✅ **Land cover classification**
✅ **Degradation monitoring**

---

## 🎓 For Demo/Presentation

### **Show Real Satellite Data**:
1. Open Planning Dashboard
2. Select a zone
3. Point out: "This NDVI value comes from Sentinel-2 satellite"
4. Show: "Updated every 5 days automatically"
5. Explain: "We can track vegetation health in real-time"

### **Key Talking Points**:
- "Real satellite data from European Space Agency"
- "10-meter resolution imagery"
- "Historical data back to 2015"
- "Automatic updates every 5 days"
- "Used by NASA, ESA, and major organizations"

---

## ✅ Verification Checklist

- [ ] Sentinel Hub account created
- [ ] OAuth client created
- [ ] Client ID and Secret copied
- [ ] Added to `backend/.env`
- [ ] Backend server restarted
- [ ] Test script run successfully
- [ ] NDVI data showing in Planning Dashboard
- [ ] Monitoring Dashboard showing real vegetation health

---

## 🚀 Your System is Now Production-Grade!

With Sentinel Hub integrated:
- ✅ Real weather data (OpenWeatherMap)
- ✅ Real climate data (NASA POWER)
- ✅ Real soil data (SoilGrids)
- ✅ **Real satellite data (Sentinel Hub)** 🆕
- ✅ Firebase Realtime Database
- ✅ Complete lifecycle tracking

**You have a fully functional, data-driven forest restoration platform!** 🌳🛰️

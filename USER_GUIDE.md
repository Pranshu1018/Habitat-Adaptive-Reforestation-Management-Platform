# Habitat Platform - User Guide

## 🌳 Welcome to Strategic Site Analysis

This guide will help you understand and use the **Strategic Site Analysis** feature - the first and most important step in successful reforestation.

## 📍 What is Site Analysis?

Site Analysis evaluates geographical locations using real-time data from:
- **Satellite Imagery** - Vegetation coverage and health
- **Soil Data** - pH levels, nutrients, moisture
- **Weather Data** - Temperature, precipitation, humidity
- **Climate Patterns** - Historical and current conditions

The system provides a **Suitability Score (0-100)** that tells you how suitable a location is for reforestation.

## 🚀 Getting Started

### Step 1: Access Site Analysis

1. Open the application: `http://localhost:5173`
2. Click **"Analyze Your Site"** on the landing page
3. You'll see the Site Analysis interface

### Step 2: Enter Site Information

**Required Information:**
- **Site Name**: Give your location a memorable name (e.g., "Western Ghats Project")
- **Latitude**: North-South coordinate (-90 to 90)
- **Longitude**: East-West coordinate (-180 to 180)
- **Area**: Size in hectares

**Quick Locations:**
Use the pre-configured locations for instant analysis:
- Western Ghats, India
- Amazon Basin, Brazil
- Mount Elgon, Uganda
- Kalimantan, Indonesia

### Step 3: Analyze

Click the **"Analyze Site"** button. The system will:
1. Fetch real-time weather data
2. Retrieve soil properties
3. Analyze satellite imagery
4. Calculate suitability score
5. Generate recommendations

**Analysis Time:** 2-5 seconds

## 📊 Understanding Your Results

### Suitability Score

The score is color-coded for easy understanding:

| Score | Rating | Color | Meaning |
|-------|--------|-------|---------|
| 85-100 | Excellent | Green | Ideal conditions, high success probability |
| 70-84 | Good | Blue | Favorable conditions, standard care needed |
| 50-69 | Moderate | Yellow | Acceptable with amendments and monitoring |
| 0-49 | Poor | Red | Challenging, requires significant intervention |

### Data Tabs

#### 1. Overview Tab
**Quick Summary** of all key metrics:
- **Climate**: Current temperature
- **Soil Moisture**: Water content percentage
- **Vegetation**: Health score (0-100)
- **Assessment**: Automated recommendations

**What to Look For:**
- ✅ Green checkmarks = Good conditions
- ⚠️ Yellow warnings = Attention needed
- ❌ Red alerts = Action required

#### 2. Weather Tab
**Real-Time Meteorological Data:**
- **Temperature**: Current air temperature (°C)
- **Humidity**: Moisture in air (%)
- **Precipitation**: Recent rainfall (mm)
- **Wind Speed**: Current wind (m/s)

**Interpretation:**
- **Optimal Temperature**: 20-28°C
- **Optimal Humidity**: 60-80%
- **Good Precipitation**: 2-6 mm/day average

#### 3. Soil Tab
**Ground-Level Analysis:**
- **pH Level**: Acidity/alkalinity (4-9 scale)
  - Optimal: 6.0-7.0
  - Acidic: < 6.0
  - Alkaline: > 7.0
- **Moisture**: Water content (%)
  - Optimal: 50-70%
- **Nutrients**: N-P-K levels
  - High = Green badge
  - Medium = Gray badge
  - Low = Needs amendment

**What Nutrients Mean:**
- **N (Nitrogen)**: Leaf growth
- **P (Phosphorus)**: Root development
- **K (Potassium)**: Overall health

#### 4. Vegetation Tab
**Satellite-Derived Indices:**
- **NDVI**: Normalized Difference Vegetation Index (-1 to 1)
  - > 0.6 = Dense vegetation
  - 0.2-0.6 = Moderate vegetation
  - < 0.2 = Sparse/bare land
- **Health Score**: Overall vegetation health (0-100)
- **Coverage**: Percentage of area with vegetation

## 🔄 Real-Time Updates

### Auto-Refresh Feature

Enable auto-refresh to get updated data every 60 seconds:

1. After analyzing a site, find the **"Auto-refresh"** toggle
2. Click to turn **ON**
3. Data will update automatically
4. Watch the "Last updated" timestamp

**When to Use:**
- Monitoring changing weather conditions
- Tracking rapid environmental changes
- During critical decision-making periods

**Note:** Auto-refresh uses API calls. Be mindful of rate limits.

## 💡 Best Practices

### 1. Site Selection

**Good Candidates:**
- Areas with moderate existing vegetation
- Locations with adequate rainfall
- Sites with suitable soil pH (5.5-7.5)
- Accessible for maintenance

**Avoid:**
- Extremely dry regions (< 500mm annual rainfall)
- Heavily polluted areas
- Steep slopes (> 30°)
- Flood-prone zones

### 2. Interpreting Results

**High Suitability (85+):**
- ✅ Proceed with confidence
- ✅ Use native species
- ✅ Standard care protocols

**Moderate Suitability (50-84):**
- ⚠️ Soil amendments may be needed
- ⚠️ Enhanced monitoring required
- ⚠️ Consider drought-resistant species

**Low Suitability (< 50):**
- ❌ Significant challenges expected
- ❌ Major soil improvements needed
- ❌ Consider alternative locations

### 3. Data Accuracy

**Most Accurate:**
- Soil pH and composition
- Historical climate data
- Satellite vegetation indices

**Variable Accuracy:**
- Real-time weather (depends on nearby stations)
- Precipitation forecasts
- Localized microclimates

**Always:**
- Cross-reference with local knowledge
- Conduct ground surveys
- Consult with local experts

## 🎯 Common Use Cases

### Use Case 1: New Project Planning

**Scenario:** You're planning a 1000-hectare reforestation project.

**Steps:**
1. Analyze multiple potential sites
2. Compare suitability scores
3. Review soil and climate data
4. Select the highest-scoring location
5. Note any required amendments

### Use Case 2: Existing Site Monitoring

**Scenario:** You have an ongoing project and want to track conditions.

**Steps:**
1. Enter your site coordinates
2. Enable auto-refresh
3. Monitor weather changes
4. Track vegetation health trends
5. Adjust care based on data

### Use Case 3: Feasibility Study

**Scenario:** Stakeholders need data to approve funding.

**Steps:**
1. Analyze the proposed site
2. Export/screenshot the results
3. Highlight the suitability score
4. Show favorable conditions
5. Present recommendations

## 🔍 Troubleshooting

### Issue: Low Suitability Score

**Possible Causes:**
- Poor soil quality
- Inadequate rainfall
- Extreme temperatures
- Low existing vegetation

**Solutions:**
1. Check individual metrics (soil, weather, vegetation)
2. Identify the weakest factor
3. Consider amendments:
   - Low pH → Add lime
   - High pH → Add sulfur
   - Low nutrients → Add compost
   - Low moisture → Plan irrigation

### Issue: "Failed to analyze site"

**Causes:**
- Backend server not running
- No internet connection
- API rate limit reached
- Invalid coordinates

**Solutions:**
1. Check backend is running (port 3001)
2. Verify internet connection
3. Wait a few minutes (rate limit)
4. Verify coordinates are valid

### Issue: Data Seems Inaccurate

**Remember:**
- Data is from global datasets
- Local conditions may vary
- Ground surveys are essential
- Use as a guide, not absolute truth

## 📈 Next Steps

After analyzing your site:

1. **Review Species Recommendations** (Coming in next feature)
2. **Check Risk Predictions** (Drought, pests, etc.)
3. **Calculate Carbon Potential** (Sequestration estimates)
4. **Plan Monitoring Schedule** (Regular check-ins)
5. **Prepare Site** (Based on recommendations)

## 🆘 Getting Help

### In-App Help
- Hover over ℹ️ icons for tooltips
- Check the "How it works" info box
- Review the assessment recommendations

### Documentation
- [Setup Guide](./SETUP_GUIDE.md)
- [Architecture](./ARCHITECTURE.md)
- [API Documentation](./backend/README.md)

### Support
- Check browser console (F12) for errors
- Review backend logs
- Test API connectivity: `npm run test:apis`

## 🎓 Understanding the Science

### Suitability Score Calculation

The score is calculated from multiple factors:

```
Base Score: 50 points

+ Vegetation Health (0-25 points)
  - Based on NDVI and health score
  
+ Soil Quality (0-20 points)
  - pH level (optimal: 6.0-7.0)
  - Nutrient levels (N, P, K)
  
+ Climate Suitability (0-20 points)
  - Temperature (optimal: 20-28°C)
  - Precipitation (optimal: 2-6 mm/day)
  
+ Land Cover (0-15 points)
  - Existing vegetation coverage
  
+ Moisture (0-10 points)
  - Soil moisture (optimal: 50-70%)
  
+ NDVI Factor (0-10 points)
  - Vegetation index (optimal: > 0.6)

= Total: 0-100 points
```

### Data Sources

1. **Weather**: OpenWeatherMap API
   - Updates: Every 10 minutes
   - Coverage: Global
   - Accuracy: ±2°C, ±10% humidity

2. **Soil**: SoilGrids (ISRIC)
   - Resolution: 250m
   - Depth: 0-5cm (topsoil)
   - Accuracy: ±0.5 pH units

3. **Satellite**: NASA POWER / Sentinel-2
   - Resolution: 10-30m
   - Update: Daily to weekly
   - Accuracy: ±0.05 NDVI units

## ✅ Quick Reference

### Optimal Conditions

| Parameter | Optimal Range | Unit |
|-----------|---------------|------|
| Temperature | 20-28 | °C |
| Humidity | 60-80 | % |
| Soil pH | 6.0-7.0 | pH |
| Soil Moisture | 50-70 | % |
| NDVI | > 0.6 | index |
| Precipitation | 2-6 | mm/day |

### Action Thresholds

| Condition | Action Required |
|-----------|----------------|
| Score > 85 | Proceed with standard protocols |
| Score 70-84 | Minor adjustments needed |
| Score 50-69 | Significant amendments required |
| Score < 50 | Major intervention or site change |

## 🎉 Success Tips

1. **Start with Quick Locations** - Familiarize yourself with the interface
2. **Compare Multiple Sites** - Analyze 3-5 locations before deciding
3. **Enable Auto-Refresh** - During critical monitoring periods
4. **Document Results** - Screenshot or export data for records
5. **Combine with Local Knowledge** - Data + experience = best decisions
6. **Regular Monitoring** - Check conditions monthly or seasonally
7. **Act on Recommendations** - The system provides actionable guidance

---

**Remember:** Site analysis is the foundation of successful reforestation. Take time to understand your data, and don't hesitate to analyze multiple locations before making final decisions.

**Happy Reforesting! 🌳**

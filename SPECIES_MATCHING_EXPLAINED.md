# 🌳 SPECIES MATCHING ENGINE - HOW IT WORKS

## 📖 **Overview**

The species matching engine uses **rule-based AI** (not black-box ML) to recommend optimal tree species for each site. Every recommendation includes a clear "Why?" explanation so forest officers can trust and understand the decisions.

---

## 🎯 **How Species Matching Works**

### **Step 1: Gather Environmental Data**

The system collects:
- **Location**: Latitude & Longitude
- **Soil Data**: pH, nitrogen, moisture, texture
- **Climate Data**: Temperature, rainfall patterns
- **Weather Data**: Current conditions & 14-day forecast

### **Step 2: Determine Climate Zone**

Based on latitude and rainfall:
```javascript
Latitude < 10° + High rainfall → Equatorial rainforest
Latitude < 10° + Low rainfall → Equatorial
Latitude 10-23.5° + High rainfall → Tropical
Latitude 10-23.5° + Medium rainfall → Monsoon tropical
Latitude 10-23.5° + Low rainfall → Tropical dry
Latitude 23.5-35° → Subtropical
Latitude > 35° → Temperate
```

### **Step 3: Calculate Compatibility Score**

Each species starts with a **base score of 70** and gets points added/subtracted based on:

#### **Climate Zone Match** (+15 or -20 points)
- ✅ **+15**: Species climate zone matches site climate zone
- ❌ **-20**: Climate zone mismatch

#### **Soil pH Compatibility** (+10, +5, or -15 points)
- ✅ **+10**: Site pH within species optimal range
- 🟡 **+5**: Site pH close to optimal (within 0.5)
- ❌ **-15**: pH adjustment needed

#### **Drought Tolerance** (+15, +10, or -25 points)
- ✅ **+15**: High drought tolerance + dry conditions
- ✅ **+10**: Low drought tolerance + high rainfall
- ❌ **-25**: Low drought tolerance + dry conditions

#### **Soil Moisture** (+10 or -20 points)
- ✅ **+10**: High drought tolerance + low soil moisture
- ❌ **-20**: Low drought tolerance + low soil moisture

#### **Nutrient Availability** (+5 points)
- ✅ **+5**: Medium or high nitrogen levels

### **Step 4: Generate Recommendations**

- Only species with **score > 50** are recommended
- Top 5 species are selected
- Each includes:
  - **Survival Probability**: The compatibility score (0-100%)
  - **Reason**: Clear explanation of why it's suitable
  - **Characteristics**: Drought tolerance, growth rate, max height
  - **Benefits**: Economic, ecological, social benefits
  - **Carbon Potential**: kg CO₂/tree over 20 years

---

## 🌲 **Species Database**

The system includes 14 native species:

### **Tropical Species**
1. **African Mahogany** (Khaya anthotheca)
   - Drought tolerance: High
   - Carbon potential: 850 kg CO₂
   - Best for: Well-drained soils, pH 5.5-7.0

2. **Teak** (Tectona grandis)
   - Drought tolerance: High
   - Carbon potential: 1100 kg CO₂
   - Best for: Monsoon tropical, pH 6.0-7.5

3. **Acacia** (Acacia mangium)
   - Drought tolerance: High
   - Carbon potential: 700 kg CO₂
   - Best for: Nitrogen fixation, fast growth

### **Rainforest Species**
4. **Meranti** (Shorea spp.)
   - Drought tolerance: Low
   - Carbon potential: 1400 kg CO₂
   - Best for: Deep moist soils, high rainfall

5. **Brazil Nut** (Bertholletia excelsa)
   - Drought tolerance: Medium
   - Carbon potential: 1600 kg CO₂
   - Best for: Amazon rainforest, deep soils

6. **Ceiba** (Ceiba pentandra)
   - Drought tolerance: Medium
   - Carbon potential: 1800 kg CO₂
   - Best for: Massive carbon storage, rapid growth

### **Highland Species**
7. **African Cherry** (Prunus africana)
   - Drought tolerance: Medium
   - Carbon potential: 720 kg CO₂
   - Best for: Highland tropical, pH 5.5-6.5

8. **East African Cedar** (Juniperus procera)
   - Drought tolerance: High
   - Carbon potential: 1200 kg CO₂
   - Best for: Highland, erosion control

9. **Highland Bamboo** (Yushania alpina)
   - Drought tolerance: Medium
   - Carbon potential: 650 kg CO₂
   - Best for: Fast growth, soil stabilization

### **Specialized Species**
10. **Sandalwood** (Santalum album)
    - Drought tolerance: High
    - Carbon potential: 450 kg CO₂
    - Best for: High-value aromatic wood

11. **Açaí Palm** (Euterpe oleracea)
    - Drought tolerance: Low
    - Carbon potential: 550 kg CO₂
    - Best for: Floodplains, economic value

12. **Shihuahuaco** (Dipteryx micrantha)
    - Drought tolerance: Medium
    - Carbon potential: 1500 kg CO₂
    - Best for: Long-lived (1000+ years)

---

## 📊 **Example: Western Ghats Analysis**

### **Input Data**
- **Location**: 14.0°N, 75.5°E (Western Ghats, India)
- **Climate Zone**: Monsoon tropical
- **Soil pH**: 6.2
- **Rainfall**: 1200mm/year
- **Soil Moisture**: 65%

### **Species Matching Process**

#### **Teak (Tectona grandis)**
```
Base Score: 70
+ Climate zone match (Monsoon tropical): +15
+ Soil pH 6.2 in range 6.0-7.5: +10
+ High drought tolerance + medium rainfall: +10
+ Medium nitrogen: +5
= Final Score: 110 → Capped at 100

Survival Probability: 100%
Reason: "Optimal climate zone; Suitable soil pH"
```

#### **African Mahogany (Khaya anthotheca)**
```
Base Score: 70
+ Climate zone match (Tropical): +15
+ Soil pH 6.2 in range 5.5-7.0: +10
+ High drought tolerance: +10
+ Medium nitrogen: +5
= Final Score: 110 → Capped at 100

Survival Probability: 100%
Reason: "Optimal climate zone; Suitable soil pH"
```

#### **Meranti (Shorea spp.)**
```
Base Score: 70
- Climate zone mismatch (needs Equatorial): -20
+ Soil pH 6.2 close to range 5.0-6.5: +5
- Low drought tolerance + medium rainfall: 0
= Final Score: 55

Survival Probability: 55%
Reason: "Suboptimal climate zone; pH adjustment needed"
```

---

## 🎯 **Why This Approach?**

### **Explainable AI**
- Every decision has a clear reason
- Forest officers can trust recommendations
- No black-box ML algorithms

### **Rule-Based System**
- Based on scientific forestry principles
- Transparent scoring system
- Easy to audit and improve

### **Practical for Judges**
- Shows "Why this species?" for each recommendation
- Demonstrates understanding of forestry science
- Production-ready without expensive ML infrastructure

---

## 🔧 **How to Add New Species**

Edit `src/services/analytics/speciesMatcher.ts`:

```typescript
'your-species-id': {
  name: 'Common Name',
  scientificName: 'Scientific Name',
  imageUrl: 'https://...',
  characteristics: {
    droughtTolerance: 'low' | 'medium' | 'high',
    growthRate: 'slow' | 'medium' | 'fast',
    maxHeight: 30, // meters
    soilPreference: 'Well-drained, pH 6.0-7.5',
    climateZone: 'Tropical',
  },
  benefits: ['Benefit 1', 'Benefit 2', 'Benefit 3'],
  carbonPotential: 850, // kg CO₂ over 20 years
}
```

---

## 📈 **Scoring Summary**

| Factor | Points | Condition |
|--------|--------|-----------|
| Climate match | +15 | Zone matches |
| Climate mismatch | -20 | Zone doesn't match |
| pH perfect | +10 | Within optimal range |
| pH close | +5 | Within 0.5 of optimal |
| pH poor | -15 | Outside range |
| Drought + dry | +15 | High tolerance + low rain |
| Drought + wet | +10 | Low tolerance + high rain |
| No drought + dry | -25 | Low tolerance + low rain |
| Moisture match | +10 | Tolerance matches moisture |
| Moisture mismatch | -20 | Tolerance doesn't match |
| Good nutrients | +5 | Medium/high nitrogen |

**Final Score Range**: 0-100 (capped)  
**Recommendation Threshold**: > 50

---

## 🎬 **For Demo**

When showing species recommendations to judges, say:

> "Our species matching engine uses rule-based AI, not black-box machine learning. Every recommendation includes a clear 'Why?' explanation. For example, Teak is recommended here because it matches the monsoon tropical climate zone and the soil pH of 6.2 falls within its optimal range of 6.0-7.5. This explainability is crucial for forest officers to trust and act on the recommendations."

---

## 📚 **Related Files**

- **Implementation**: `src/services/analytics/speciesMatcher.ts`
- **Usage**: `src/pages/SiteAnalysisComplete.tsx`
- **Backend**: `backend/src/routes/site.js`

---

**This is explainable AI in action - transparent, trustworthy, and production-ready!** 🌳✨

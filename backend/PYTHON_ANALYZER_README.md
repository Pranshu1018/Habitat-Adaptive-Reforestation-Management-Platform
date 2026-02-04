# 🐍 Python Site Analyzer

## Overview

A clean, rule-based Python program for analyzing site suitability for reforestation projects. Uses satellite and environmental data to compute explainable scores and recommendations.

**Key Features**:
- ✅ No heavy ML dependencies (pure Python + JSON)
- ✅ Explainable scoring rules
- ✅ Graceful error handling
- ✅ Modular, well-documented code
- ✅ Ready for backend API integration

---

## Installation

No external dependencies required! Uses only Python standard library.

```bash
# Requires Python 3.6+
python --version

# Make executable (Linux/Mac)
chmod +x backend/site_analyzer.py
```

---

## Usage

### 1. Command Line with JSON String

```bash
python backend/site_analyzer.py '{"ndvi": 0.35, "soil_ph": 6.5, "soil_moisture": 65, "temperature": 28, "rainfall": 150}'
```

### 2. Pipe JSON from File

```bash
cat input.json | python backend/site_analyzer.py
```

### 3. From Python Code

```python
from site_analyzer import analyze_site
import json

input_data = {
    "ndvi": 0.35,
    "soil_ph": 6.5,
    "soil_moisture": 65,
    "temperature": 28,
    "rainfall": 150
}

result = analyze_site(json.dumps(input_data))
print(result)
```

### 4. Run Examples

```bash
# Run built-in examples
python backend/site_analyzer.py
```

---

## Input Format

```json
{
  "ndvi": 0.35,
  "soil_ph": 6.5,
  "soil_moisture": 65,
  "temperature": 28,
  "rainfall": 150
}
```

**Fields**:
- `ndvi` (float, 0-1): Normalized Difference Vegetation Index
- `soil_ph` (float, 4-9): Soil pH level
- `soil_moisture` (float, 0-100): Soil moisture percentage
- `temperature` (float, °C): Average temperature
- `rainfall` (float, mm): Total rainfall over last 14 days

**Missing Fields**: Automatically filled with sensible defaults.

---

## Output Format

```json
{
  "success": true,
  "input_data": {
    "ndvi": 0.35,
    "soil_ph": 6.5,
    "soil_moisture": 65,
    "temperature": 28,
    "rainfall": 150
  },
  "analysis": {
    "vegetation_health": {
      "score": 46.67,
      "classification": "MODERATE",
      "description": "Moderate vegetation cover",
      "ndvi_value": 0.35
    },
    "soil_suitability": {
      "score": 100.0,
      "ph_score": 50,
      "ph_status": "OPTIMAL",
      "moisture_score": 50,
      "moisture_status": "OPTIMAL",
      "ph_value": 6.5,
      "moisture_value": 65
    },
    "climate_stress": {
      "stress_score": 0.0,
      "temp_stress": 0,
      "temp_status": "OPTIMAL",
      "rain_stress": 0,
      "rain_status": "OPTIMAL",
      "risk_factors": [],
      "temperature_value": 28,
      "rainfall_value": 150
    },
    "site_suitability": {
      "final_score": 84.0,
      "risk_level": "LOW",
      "priority": "HIGH",
      "recommendation": "Excellent site for reforestation. Proceed with planting.",
      "component_scores": {
        "vegetation_contribution": 14.0,
        "soil_contribution": 40.0,
        "climate_contribution": 30.0
      }
    }
  },
  "summary": {
    "suitability_score": 84.0,
    "risk_level": "LOW",
    "priority": "HIGH",
    "recommendation": "Excellent site for reforestation. Proceed with planting."
  }
}
```

---

## Scoring Rules

### 1. Vegetation Health Score (0-100)

Based on NDVI value:

| NDVI Range | Score | Classification | Description |
|------------|-------|----------------|-------------|
| > 0.6 | 80-100 | HEALTHY | Dense, healthy vegetation |
| 0.3-0.6 | 40-80 | MODERATE | Moderate vegetation cover |
| < 0.3 | 0-40 | POOR | Sparse or degraded vegetation |

**Weight in Final Score**: 30%

---

### 2. Soil Suitability Score (0-100)

Combines pH and moisture scores:

#### pH Score (0-50 points)

| pH Range | Score | Status |
|----------|-------|--------|
| 6.0-7.5 | 50 | OPTIMAL |
| 5.5-6.0 or 7.5-8.0 | 35 | ACCEPTABLE |
| 5.0-5.5 or 8.0-8.5 | 20 | MARGINAL |
| < 5.0 or > 8.5 | 10 | POOR |

#### Moisture Score (0-50 points)

| Moisture % | Score | Status |
|------------|-------|--------|
| 50-70 | 50 | OPTIMAL |
| 40-50 or 70-80 | 35 | ACCEPTABLE |
| 30-40 or 80-90 | 20 | MARGINAL |
| < 30 or > 90 | 10 | POOR |

**Weight in Final Score**: 40%

---

### 3. Climate Stress Score (0-100)

Lower stress = better conditions. Combines temperature and rainfall stress:

#### Temperature Stress (0-50 points)

| Temperature °C | Stress | Status |
|----------------|--------|--------|
| 20-30 | 0 | OPTIMAL |
| 15-20 or 30-35 | 15 | MILD_STRESS |
| 10-15 or 35-40 | 30 | MODERATE_STRESS |
| < 10 or > 40 | 50 | HIGH_STRESS |

#### Rainfall Stress (0-50 points)

| Rainfall (mm/14d) | Stress | Status |
|-------------------|--------|--------|
| 100-200 | 0 | OPTIMAL |
| 50-100 or 200-300 | 15 | MILD_STRESS |
| 20-50 or 300-400 | 30 | MODERATE_STRESS |
| < 20 or > 400 | 50 | HIGH_STRESS |

**Special Case**: Temperature > 35°C AND Rainfall < 50mm = +20 drought penalty

**Weight in Final Score**: 30% (inverted: 100 - stress)

---

### 4. Final Suitability Score (0-100)

```
Final Score = (Vegetation × 0.30) + (Soil × 0.40) + ((100 - Climate Stress) × 0.30)
```

#### Risk Levels

| Score Range | Risk Level | Priority | Recommendation |
|-------------|------------|----------|----------------|
| 70-100 | LOW | HIGH | Excellent site, proceed with planting |
| 50-69 | MEDIUM | MEDIUM | Good site, consider amendments |
| 0-49 | HIGH | LOW | Challenging site, needs preparation |

---

## Example Scenarios

### Scenario 1: Ideal Reforestation Site

**Input**:
```json
{
  "ndvi": 0.35,
  "soil_ph": 6.5,
  "soil_moisture": 65,
  "temperature": 28,
  "rainfall": 150
}
```

**Output**:
- Vegetation Health: 46.67 (MODERATE) - degraded land
- Soil Suitability: 100.0 (OPTIMAL) - perfect conditions
- Climate Stress: 0.0 (OPTIMAL) - ideal weather
- **Final Score: 84.0 (LOW RISK, HIGH PRIORITY)**
- **Recommendation**: Excellent site for reforestation

**Why High Priority?** Low NDVI (degraded) + Excellent soil/climate = High restoration potential!

---

### Scenario 2: Drought Conditions

**Input**:
```json
{
  "ndvi": 0.25,
  "soil_ph": 7.2,
  "soil_moisture": 25,
  "temperature": 38,
  "rainfall": 15
}
```

**Output**:
- Vegetation Health: 33.33 (POOR)
- Soil Suitability: 45.0 (MARGINAL)
- Climate Stress: 70.0 (HIGH) - drought detected
- **Final Score: 37.33 (HIGH RISK, LOW PRIORITY)**
- **Recommendation**: Challenging site, requires preparation
- **Risk Factors**: ["Extreme temperature", "Severe drought", "High drought risk"]

---

### Scenario 3: Healthy Forest

**Input**:
```json
{
  "ndvi": 0.75,
  "soil_ph": 6.8,
  "soil_moisture": 70,
  "temperature": 25,
  "rainfall": 180
}
```

**Output**:
- Vegetation Health: 87.5 (HEALTHY)
- Soil Suitability: 100.0 (OPTIMAL)
- Climate Stress: 0.0 (OPTIMAL)
- **Final Score: 96.25 (LOW RISK, HIGH PRIORITY)**
- **Recommendation**: Excellent site

**Note**: High NDVI means already healthy - may not need restoration!

---

## Testing

Run the test suite:

```bash
python backend/test_site_analyzer.py
```

**Tests Include**:
1. Ideal reforestation site
2. Healthy forest (low priority)
3. Drought conditions
4. Acidic soil challenge
5. Waterlogged conditions
6. Missing fields (defaults)
7. Invalid JSON (error handling)

---

## Integration with Node.js Backend

### Option 1: Subprocess

```javascript
const { exec } = require('child_process');

function analyzeSite(data) {
  return new Promise((resolve, reject) => {
    const jsonInput = JSON.stringify(data);
    exec(`python backend/site_analyzer.py '${jsonInput}'`, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(JSON.parse(stdout));
    });
  });
}

// Usage
const result = await analyzeSite({
  ndvi: 0.35,
  soil_ph: 6.5,
  soil_moisture: 65,
  temperature: 28,
  rainfall: 150
});
```

### Option 2: Express Route

```javascript
// backend/src/routes/analysis.js
import express from 'express';
import { exec } from 'child_process';
import { promisify } from 'util';

const router = express.Router();
const execAsync = promisify(exec);

router.post('/analyze', async (req, res) => {
  try {
    const { ndvi, soil_ph, soil_moisture, temperature, rainfall } = req.body;
    
    const input = JSON.stringify({
      ndvi,
      soil_ph,
      soil_moisture,
      temperature,
      rainfall
    });
    
    const { stdout } = await execAsync(`python backend/site_analyzer.py '${input}'`);
    const result = JSON.parse(stdout);
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
```

---

## API Endpoint Example

```bash
curl -X POST http://localhost:3001/api/analysis/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "ndvi": 0.35,
    "soil_ph": 6.5,
    "soil_moisture": 65,
    "temperature": 28,
    "rainfall": 150
  }'
```

---

## Why This Approach?

### ✅ Advantages

1. **Explainable**: Every score has clear rules
2. **No Dependencies**: Pure Python, no ML libraries
3. **Fast**: Runs in milliseconds
4. **Transparent**: Judges can understand the logic
5. **Modular**: Easy to modify rules
6. **Production-Ready**: Error handling, validation
7. **API-Friendly**: JSON in, JSON out

### 🎯 Perfect For

- Hackathon demos (judges love explainability)
- Production systems (no black-box ML)
- Educational purposes (clear logic)
- Regulatory compliance (auditable decisions)

---

## Future Enhancements

1. **Species Matching**: Add species recommendation logic
2. **Cost Estimation**: Calculate intervention costs
3. **Time Series**: Analyze historical trends
4. **Risk Prediction**: Forecast future conditions
5. **Multi-Site Comparison**: Rank multiple sites

---

## License

MIT License - Free to use and modify

---

## Support

For questions or issues, contact the Habitat Canopy team.

**Happy Reforestation! 🌳**

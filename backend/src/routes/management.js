import express from 'express';
import axios from 'axios';
import { riskAnalysisEngine } from '../services/riskAnalysisEngine.js';

const router = express.Router();

/**
 * Get comprehensive dashboard data for a location
 */
router.get('/dashboard', async (req, res) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude and longitude required' });
    }

    console.log(`\n📊 Fetching management dashboard data for ${lat}, ${lon}...`);

    const PORT = process.env.PORT || 3001;

    // Fetch all data in parallel
    const [weatherRes, soilRes, satelliteRes] = await Promise.allSettled([
      axios.get(`http://localhost:${PORT}/api/weather/current`, { params: { lat, lon } }),
      axios.get(`http://localhost:${PORT}/api/soil/data`, { params: { lat, lon } }),
      axios.get(`http://localhost:${PORT}/api/satellite/vegetation`, { params: { lat, lon } })
    ]);

    const weather = weatherRes.status === 'fulfilled' ? weatherRes.value.data : null;
    const soil = soilRes.status === 'fulfilled' ? soilRes.value.data : null;
    const vegetation = satelliteRes.status === 'fulfilled' ? satelliteRes.value.data : null;

    if (!weather || !soil || !vegetation) {
      return res.status(500).json({ 
        error: 'Failed to fetch required data',
        details: {
          weather: weatherRes.status,
          soil: soilRes.status,
          vegetation: satelliteRes.status
        }
      });
    }

    // Calculate risk assessment
    const riskAssessment = await riskAnalysisEngine.calculateRiskScore({
      weather,
      soil,
      vegetation,
      species: 'mixed',
      treeAge: 1,
      plantingDensity: 1000
    });

    // Calculate vegetation health metrics
    const vegetationHealth = calculateVegetationHealth(vegetation);

    // Calculate soil quality score
    const soilQuality = calculateSoilQuality(soil);

    // Identify risk zones
    const riskZones = identifyRiskZones(riskAssessment, vegetation, soil);

    // Generate alerts
    const alerts = generateAlerts(riskAssessment, vegetationHealth, soilQuality);

    // Calculate overall health score
    const overallHealth = calculateOverallHealth(vegetationHealth, soilQuality, riskAssessment);

    console.log(`✅ Dashboard data compiled successfully`);
    console.log(`   Risk Level: ${riskAssessment.riskLevel}`);
    console.log(`   Overall Health: ${overallHealth}%`);
    console.log(`   Alerts: ${alerts.length}`);

    res.json({
      location: { lat: parseFloat(lat), lon: parseFloat(lon) },
      timestamp: new Date().toISOString(),
      overallHealth,
      riskAssessment,
      vegetationHealth,
      soilQuality,
      riskZones,
      alerts,
      weather: {
        temperature: weather.current.temp,
        humidity: weather.current.humidity,
        precipitation: weather.current.precipitation,
        windSpeed: weather.current.windSpeed
      },
      rawData: {
        weather,
        soil,
        vegetation
      }
    });

  } catch (error) {
    console.error('❌ Management dashboard error:', error.message);
    res.status(500).json({ 
      error: 'Failed to generate dashboard data',
      message: error.message
    });
  }
});

/**
 * Get risk zones for a project
 */
router.get('/risk-zones', async (req, res) => {
  try {
    const { lat, lon, radius = 1000 } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude and longitude required' });
    }

    // Generate risk zones in a grid around the location
    const zones = await generateRiskZoneGrid(parseFloat(lat), parseFloat(lon), parseInt(radius));

    res.json({
      location: { lat: parseFloat(lat), lon: parseFloat(lon) },
      radius: parseInt(radius),
      zones,
      summary: {
        high: zones.filter(z => z.riskLevel === 'HIGH').length,
        medium: zones.filter(z => z.riskLevel === 'MEDIUM').length,
        low: zones.filter(z => z.riskLevel === 'LOW').length
      }
    });

  } catch (error) {
    console.error('Risk zones error:', error.message);
    res.status(500).json({ error: 'Failed to generate risk zones' });
  }
});

/**
 * Simulate risk scenario
 */
router.post('/simulate', async (req, res) => {
  try {
    const { lat, lon, scenario } = req.body;

    if (!lat || !lon || !scenario) {
      return res.status(400).json({ error: 'Location and scenario required' });
    }

    console.log(`\n🎭 Simulating scenario: ${scenario.type}`);

    const PORT = process.env.PORT || 3001;

    // Fetch base data
    const [weatherRes, soilRes, satelliteRes] = await Promise.allSettled([
      axios.get(`http://localhost:${PORT}/api/weather/current`, { params: { lat, lon } }),
      axios.get(`http://localhost:${PORT}/api/soil/data`, { params: { lat, lon } }),
      axios.get(`http://localhost:${PORT}/api/satellite/vegetation`, { params: { lat, lon } })
    ]);

    let weather = weatherRes.status === 'fulfilled' ? weatherRes.value.data : {};
    let soil = soilRes.status === 'fulfilled' ? soilRes.value.data : {};
    let vegetation = satelliteRes.status === 'fulfilled' ? satelliteRes.value.data : {};

    // Apply scenario modifications
    ({ weather, soil, vegetation } = applyScenario(scenario, weather, soil, vegetation));

    // Calculate risk with modified data
    const riskAssessment = await riskAnalysisEngine.calculateRiskScore({
      weather,
      soil,
      vegetation,
      species: scenario.species || 'mixed',
      treeAge: scenario.treeAge || 1,
      plantingDensity: scenario.plantingDensity || 1000
    });

    console.log(`✅ Simulation complete: Risk Level = ${riskAssessment.riskLevel}`);

    res.json({
      scenario: scenario.type,
      location: { lat: parseFloat(lat), lon: parseFloat(lon) },
      riskAssessment,
      modifiedData: { weather, soil, vegetation },
      comparison: {
        message: `Under ${scenario.type} conditions, risk increases to ${riskAssessment.finalRiskScore}%`
      }
    });

  } catch (error) {
    console.error('Simulation error:', error.message);
    res.status(500).json({ error: 'Failed to run simulation' });
  }
});

// ============================================
// Helper Functions
// ============================================

function calculateVegetationHealth(vegetation) {
  const ndvi = vegetation.ndvi || 0.5;
  const healthScore = vegetation.healthScore || 70;
  const coverage = vegetation.coverage || 50;

  // NDVI interpretation
  let ndviStatus = 'Poor';
  if (ndvi > 0.6) ndviStatus = 'Healthy';
  else if (ndvi > 0.4) ndviStatus = 'Moderate';

  // Canopy coverage interpretation
  let coverageStatus = 'Low';
  if (coverage > 70) coverageStatus = 'High';
  else if (coverage > 50) coverageStatus = 'Moderate';

  return {
    ndvi,
    ndviStatus,
    healthScore,
    coverage,
    coverageStatus,
    trend: vegetation.changeRate || 0,
    trendStatus: vegetation.changeRate > 0 ? 'Improving' : vegetation.changeRate < -2 ? 'Declining' : 'Stable'
  };
}

function calculateSoilQuality(soil) {
  let score = 0;
  const factors = [];

  // pH score (0-25 points)
  const ph = soil.ph || 6.5;
  if (ph >= 6.0 && ph <= 7.5) {
    score += 25;
    factors.push({ name: 'pH', status: 'Optimal', value: ph });
  } else if (ph >= 5.5 && ph <= 8.0) {
    score += 15;
    factors.push({ name: 'pH', status: 'Acceptable', value: ph });
  } else {
    score += 5;
    factors.push({ name: 'pH', status: 'Poor', value: ph });
  }

  // Moisture score (0-25 points)
  const moisture = soil.moisture || 60;
  if (moisture >= 50 && moisture <= 75) {
    score += 25;
    factors.push({ name: 'Moisture', status: 'Optimal', value: `${moisture}%` });
  } else if (moisture >= 40 && moisture <= 85) {
    score += 15;
    factors.push({ name: 'Moisture', status: 'Acceptable', value: `${moisture}%` });
  } else {
    score += 5;
    factors.push({ name: 'Moisture', status: 'Poor', value: `${moisture}%` });
  }

  // Organic carbon score (0-25 points)
  const organicCarbon = soil.organicCarbon || 15;
  if (organicCarbon >= 15) {
    score += 25;
    factors.push({ name: 'Organic Matter', status: 'High', value: `${organicCarbon}g/kg` });
  } else if (organicCarbon >= 10) {
    score += 15;
    factors.push({ name: 'Organic Matter', status: 'Moderate', value: `${organicCarbon}g/kg` });
  } else {
    score += 5;
    factors.push({ name: 'Organic Matter', status: 'Low', value: `${organicCarbon}g/kg` });
  }

  // Nutrient score (0-25 points)
  const nitrogen = soil.nitrogen || 'medium';
  if (nitrogen === 'high') {
    score += 25;
    factors.push({ name: 'Nutrients', status: 'High', value: nitrogen });
  } else if (nitrogen === 'medium') {
    score += 15;
    factors.push({ name: 'Nutrients', status: 'Moderate', value: nitrogen });
  } else {
    score += 5;
    factors.push({ name: 'Nutrients', status: 'Low', value: nitrogen });
  }

  let qualityLevel = 'Poor';
  if (score >= 75) qualityLevel = 'Excellent';
  else if (score >= 60) qualityLevel = 'Good';
  else if (score >= 40) qualityLevel = 'Fair';

  return {
    score,
    qualityLevel,
    factors,
    ph: soil.ph,
    moisture: soil.moisture,
    organicCarbon: soil.organicCarbon,
    nitrogen: soil.nitrogen,
    texture: determineSoilTexture(soil)
  };
}

function determineSoilTexture(soil) {
  const clay = soil.clayContent || 25;
  const sand = soil.sandContent || 40;
  const silt = 100 - clay - sand;

  if (clay > 40) return 'Clay';
  if (sand > 70) return 'Sandy';
  if (silt > 50) return 'Silty';
  if (clay > 20 && sand > 40) return 'Clay Loam';
  if (sand > 50 && clay < 20) return 'Sandy Loam';
  return 'Loam';
}

function identifyRiskZones(riskAssessment, vegetation, soil) {
  const zones = [];

  // High risk zone based on overall assessment
  if (riskAssessment.finalRiskScore >= 60) {
    zones.push({
      id: 'zone_high_risk',
      name: 'High Risk Area',
      riskLevel: 'HIGH',
      area: '25%',
      reason: riskAssessment.primaryCause,
      action: riskAssessment.recommendedActions[0]
    });
  }

  // Low vegetation health zone
  if (vegetation.healthScore < 60) {
    zones.push({
      id: 'zone_low_vegetation',
      name: 'Low Vegetation Health',
      riskLevel: 'MEDIUM',
      area: '15%',
      reason: 'Declining NDVI and canopy coverage',
      action: 'Conduct field inspection and assess irrigation'
    });
  }

  // Poor soil quality zone
  if (soil.moisture < 40 || soil.ph < 5.5 || soil.ph > 8.0) {
    zones.push({
      id: 'zone_poor_soil',
      name: 'Poor Soil Conditions',
      riskLevel: 'MEDIUM',
      area: '20%',
      reason: 'Low moisture or unfavorable pH',
      action: 'Improve soil conditions with amendments'
    });
  }

  // If no specific zones, add a healthy zone
  if (zones.length === 0) {
    zones.push({
      id: 'zone_healthy',
      name: 'Healthy Area',
      riskLevel: 'LOW',
      area: '100%',
      reason: 'All indicators within normal range',
      action: 'Continue routine monitoring'
    });
  }

  return zones;
}

function generateAlerts(riskAssessment, vegetationHealth, soilQuality) {
  const alerts = [];

  // Critical risk alert
  if (riskAssessment.finalRiskScore >= 70) {
    alerts.push({
      id: `alert_critical_${Date.now()}`,
      severity: 'critical',
      title: `Critical ${riskAssessment.primaryCause} Risk`,
      message: `Immediate action required within ${riskAssessment.timeToImpact}`,
      action: riskAssessment.recommendedActions[0],
      timestamp: new Date().toISOString()
    });
  }

  // High risk alert
  if (riskAssessment.finalRiskScore >= 50 && riskAssessment.finalRiskScore < 70) {
    alerts.push({
      id: `alert_high_${Date.now()}`,
      severity: 'warning',
      title: `Elevated ${riskAssessment.primaryCause} Risk`,
      message: `Action recommended within ${riskAssessment.timeToImpact}`,
      action: riskAssessment.recommendedActions[0],
      timestamp: new Date().toISOString()
    });
  }

  // Vegetation decline alert
  if (vegetationHealth.trend < -3) {
    alerts.push({
      id: `alert_vegetation_${Date.now()}`,
      severity: 'warning',
      title: 'Vegetation Health Declining',
      message: `NDVI decreasing at ${vegetationHealth.trend.toFixed(1)}% per period`,
      action: 'Investigate cause and increase monitoring frequency',
      timestamp: new Date().toISOString()
    });
  }

  // Soil quality alert
  if (soilQuality.score < 40) {
    alerts.push({
      id: `alert_soil_${Date.now()}`,
      severity: 'info',
      title: 'Poor Soil Quality Detected',
      message: `Soil quality score: ${soilQuality.score}/100`,
      action: 'Consider soil amendments and testing',
      timestamp: new Date().toISOString()
    });
  }

  return alerts;
}

function calculateOverallHealth(vegetationHealth, soilQuality, riskAssessment) {
  // Weighted average of health indicators
  const vegetationScore = vegetationHealth.healthScore;
  const soilScore = soilQuality.score;
  const riskScore = 100 - riskAssessment.finalRiskScore; // Invert risk score

  const overallHealth = Math.round(
    vegetationScore * 0.4 +
    soilScore * 0.3 +
    riskScore * 0.3
  );

  return Math.max(0, Math.min(100, overallHealth));
}

async function generateRiskZoneGrid(centerLat, centerLon, radius) {
  // Generate a 3x3 grid of zones around the center point
  const zones = [];
  const gridSize = 3;
  const latOffset = 0.01; // ~1km
  const lonOffset = 0.01;

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const lat = centerLat + (i - 1) * latOffset;
      const lon = centerLon + (j - 1) * lonOffset;

      // Simulate varying risk levels
      const riskScore = Math.random() * 100;
      const riskLevel = riskScore >= 60 ? 'HIGH' : riskScore >= 30 ? 'MEDIUM' : 'LOW';

      zones.push({
        id: `zone_${i}_${j}`,
        lat,
        lon,
        riskScore: Math.round(riskScore),
        riskLevel,
        area: `${Math.round(radius / gridSize)}m²`
      });
    }
  }

  return zones;
}

function applyScenario(scenario, weather, soil, vegetation) {
  const modified = {
    weather: { ...weather },
    soil: { ...soil },
    vegetation: { ...vegetation }
  };

  switch (scenario.type) {
    case 'drought':
      modified.weather.current = {
        ...modified.weather.current,
        temp: (modified.weather.current?.temp || 25) + 5,
        precipitation: 0,
        humidity: Math.max(20, (modified.weather.current?.humidity || 65) - 30)
      };
      modified.soil.moisture = Math.max(10, (modified.soil.moisture || 60) - 40);
      modified.vegetation.ndvi = Math.max(0.2, (modified.vegetation.ndvi || 0.5) - 0.2);
      break;

    case 'heatwave':
      modified.weather.current = {
        ...modified.weather.current,
        temp: (modified.weather.current?.temp || 25) + 8,
        humidity: Math.max(25, (modified.weather.current?.humidity || 65) - 25)
      };
      break;

    case 'flood':
      modified.weather.current = {
        ...modified.weather.current,
        precipitation: 50
      };
      modified.soil.moisture = Math.min(95, (modified.soil.moisture || 60) + 30);
      break;

    case 'pest_outbreak':
      modified.vegetation.healthScore = Math.max(30, (modified.vegetation.healthScore || 70) - 30);
      modified.vegetation.ndvi = Math.max(0.3, (modified.vegetation.ndvi || 0.5) - 0.15);
      break;
  }

  return modified;
}

export default router;

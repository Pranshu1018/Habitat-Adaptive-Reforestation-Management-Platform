import express from 'express';
import axios from 'axios';

const router = express.Router();

// Comprehensive site analysis
router.post('/analyze', async (req, res) => {
  try {
    const { lat, lon, name, hectares } = req.body;
    
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    // Fetch all data in parallel
    const baseURL = `http://localhost:${process.env.PORT || 3001}/api`;
    
    const [weatherRes, soilRes, vegetationRes] = await Promise.all([
      axios.get(`${baseURL}/weather/current`, { params: { lat, lon } }).catch(() => ({ data: {} })),
      axios.get(`${baseURL}/soil/data`, { params: { lat, lon } }).catch(() => ({ data: {} })),
      axios.get(`${baseURL}/satellite/vegetation`, { params: { lat, lon } }).catch(() => ({ data: {} }))
    ]);

    const suitabilityScore = calculateSuitabilityScore(
      weatherRes.data,
      soilRes.data,
      vegetationRes.data
    );

    const analysis = {
      location: { lat, lon, name },
      weather: weatherRes.data,
      soil: soilRes.data,
      vegetation: vegetationRes.data,
      suitabilityScore,
      timestamp: new Date().toISOString()
    };

    res.json(analysis);
  } catch (error) {
    console.error('Site analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze site' });
  }
});

function calculateSuitabilityScore(weather, soil, vegetation) {
  let score = 50;
  
  if (vegetation.healthScore) {
    score += (vegetation.healthScore / 100) * 25;
  }
  
  if (soil.ph >= 6.0 && soil.ph <= 7.0) {
    score += 10;
  }
  
  if (soil.moisture >= 50 && soil.moisture <= 70) {
    score += 10;
  }
  
  if (vegetation.ndvi > 0.6) {
    score += 5;
  }
  
  return Math.round(Math.max(0, Math.min(100, score)));
}

export default router;

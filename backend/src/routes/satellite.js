import express from 'express';
import NodeCache from 'node-cache';

const router = express.Router();
const cache = new NodeCache({ stdTTL: 604800 }); // 7 days

router.get('/vegetation', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const cacheKey = `vegetation_${lat}_${lon}`;
    const cached = cache.get(cacheKey);
    
    if (cached) {
      return res.json({ ...cached, cached: true });
    }

    const vegetationData = getMockVegetationData(parseFloat(lat), parseFloat(lon));
    cache.set(cacheKey, vegetationData);
    res.json(vegetationData);
  } catch (error) {
    console.error('Satellite route error:', error);
    res.status(500).json({ error: 'Failed to fetch vegetation data' });
  }
});

function getMockVegetationData(lat, lon) {
  const isEquatorial = Math.abs(lat) < 10;
  const isTropical = Math.abs(lat) < 23.5;
  
  const baseNdvi = isEquatorial ? 0.75 : isTropical ? 0.6 : 0.45;
  const ndvi = baseNdvi + (Math.random() * 0.15 - 0.075);
  
  return {
    ndvi: parseFloat(ndvi.toFixed(3)),
    evi: parseFloat((ndvi * 0.85).toFixed(3)),
    coverage: parseFloat(((ndvi + 1) * 45).toFixed(1)),
    healthScore: parseFloat(((ndvi + 1) * 50).toFixed(1)),
    changeRate: parseFloat((Math.random() * 8 - 1).toFixed(2)),
    lastUpdated: new Date().toISOString(),
    timestamp: new Date().toISOString()
  };
}

export default router;

import express from 'express';
import NodeCache from 'node-cache';

const router = express.Router();
const cache = new NodeCache({ stdTTL: 604800 }); // 7 days

router.get('/vegetation', async (req, res) => {
  try {
    const { lat, lon, nocache } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const cacheKey = `vegetation_${lat}_${lon}`;
    
    // Check if cache bypass is requested
    if (nocache !== 'true') {
      const cached = cache.get(cacheKey);
      
      if (cached) {
        console.log(`✓ Satellite: Returning CACHED data for ${lat}, ${lon} (7 day cache)`);
        return res.json({ ...cached, cached: true, cacheInfo: 'Data from cache (7 day TTL)' });
      }
    } else {
      console.log(`🔄 Satellite: Cache bypass requested for ${lat}, ${lon}`);
    }

    console.log(`🌐 Satellite: Generating vegetation data for ${lat}, ${lon}...`);
    const vegetationData = getMockVegetationData(parseFloat(lat), parseFloat(lon));
    console.log('✅ Vegetation data generated (Note: Using mock data - Sentinel Hub integration pending)');
    cache.set(cacheKey, vegetationData);
    res.json({ ...vegetationData, cached: false, cacheInfo: 'Fresh mock data (Sentinel Hub integration pending)' });
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

// Cache management endpoints
router.get('/cache/stats', (req, res) => {
  const keys = cache.keys();
  res.json({
    totalCached: keys.length,
    keys: keys,
    ttl: '7 days'
  });
});

router.delete('/cache/clear', (req, res) => {
  const keyCount = cache.keys().length;
  cache.flushAll();
  console.log('🗑️  Satellite cache cleared');
  res.json({ 
    message: 'Satellite cache cleared',
    clearedKeys: keyCount
  });
});

export default router;

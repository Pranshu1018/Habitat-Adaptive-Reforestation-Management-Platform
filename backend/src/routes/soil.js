import express from 'express';
import axios from 'axios';
import NodeCache from 'node-cache';

const router = express.Router();
const cache = new NodeCache({ stdTTL: 86400 }); // 24 hours

const BASE_URL = 'https://rest.isric.org/soilgrids/v2.0';

router.get('/data', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const cacheKey = `soil_${lat}_${lon}`;
    const cached = cache.get(cacheKey);
    
    if (cached) {
      return res.json({ ...cached, cached: true });
    }

    try {
      // SoilGrids v2.0 API - correct format
      const properties = ['phh2o', 'nitrogen', 'soc', 'bdod', 'clay', 'sand'];
      
      // Make individual requests for each property (SoilGrids limitation)
      const propertyRequests = properties.map(prop =>
        axios.get(`${BASE_URL}/properties/query`, {
          params: {
            lon: parseFloat(lon),
            lat: parseFloat(lat),
            property: prop,
            depth: '0-5cm',
            value: 'mean'
          },
          timeout: 10000,
          headers: {
            'Accept': 'application/json'
          }
        }).catch(err => {
          console.log(`Failed to fetch ${prop}:`, err.message);
          return null;
        })
      );

      const responses = await Promise.all(propertyRequests);
      
      // Check if we got at least some data
      const validResponses = responses.filter(r => r !== null);
      if (validResponses.length === 0) {
        throw new Error('All SoilGrids requests failed');
      }

      const soilData = parseSoilGridsResponses(responses, properties);
      cache.set(cacheKey, soilData);
      res.json(soilData);
    } catch (error) {
      console.error('SoilGrids API error:', error.message);
      console.log('Using mock soil data due to API error');
      const mockData = getMockSoilData(parseFloat(lat), parseFloat(lon));
      res.json({ ...mockData, mock: true, apiError: true });
    }
  } catch (error) {
    console.error('Soil route error:', error);
    res.status(500).json({ error: 'Failed to fetch soil data' });
  }
});

function parseSoilGridsResponses(responses, properties) {
  const getPropertyValue = (index) => {
    if (!responses[index] || !responses[index].data) return 0;
    const data = responses[index].data;
    const layers = data.properties?.layers || [];
    if (layers.length === 0) return 0;
    return layers[0]?.depths?.[0]?.values?.mean || 0;
  };

  const phValue = getPropertyValue(0) / 10 || 6.5;
  const nitrogenValue = getPropertyValue(1) || 30;
  const organicCarbon = getPropertyValue(2) / 10 || 15;
  const bulkDensity = getPropertyValue(3) / 100 || 1.3;
  const clayContent = getPropertyValue(4) / 10 || 25;
  const sandContent = getPropertyValue(5) / 10 || 40;

  const classifyNutrient = (value, thresholds) => {
    if (value < thresholds[0]) return 'low';
    if (value < thresholds[1]) return 'medium';
    return 'high';
  };

  const moisture = Math.min(95, 30 + (clayContent * 0.5) + (organicCarbon * 2));

  return {
    ph: parseFloat(phValue.toFixed(2)),
    nitrogen: classifyNutrient(nitrogenValue, [20, 40]),
    phosphorus: classifyNutrient(organicCarbon * 10, [15, 30]),
    potassium: classifyNutrient(clayContent, [20, 40]),
    moisture: parseFloat(moisture.toFixed(1)),
    organicCarbon: parseFloat(organicCarbon.toFixed(1)),
    bulkDensity: parseFloat(bulkDensity.toFixed(2)),
    clayContent: parseFloat(clayContent.toFixed(1)),
    sandContent: parseFloat(sandContent.toFixed(1)),
    timestamp: new Date().toISOString(),
    source: 'SoilGrids'
  };
}

function parseSoilGridsData(data) {
  const properties = data.properties?.layers || [];
  
  const getPropertyValue = (name) => {
    const layer = properties.find(p => p.name === name);
    return layer?.depths?.[0]?.values?.mean || 0;
  };

  const phValue = getPropertyValue('phh2o') / 10;
  const nitrogenValue = getPropertyValue('nitrogen');
  const organicCarbon = getPropertyValue('soc') / 10;
  const bulkDensity = getPropertyValue('bdod') / 100;
  const clayContent = getPropertyValue('clay') / 10;
  const sandContent = getPropertyValue('sand') / 10;

  const classifyNutrient = (value, thresholds) => {
    if (value < thresholds[0]) return 'low';
    if (value < thresholds[1]) return 'medium';
    return 'high';
  };

  const moisture = Math.min(95, 30 + (clayContent * 0.5) + (organicCarbon * 2));

  return {
    ph: phValue || 6.5,
    nitrogen: classifyNutrient(nitrogenValue, [20, 40]),
    phosphorus: classifyNutrient(organicCarbon * 10, [15, 30]),
    potassium: classifyNutrient(clayContent, [20, 40]),
    moisture: moisture || 60,
    organicCarbon: organicCarbon || 15,
    bulkDensity: bulkDensity || 1.3,
    clayContent: clayContent || 25,
    sandContent: sandContent || 40,
    timestamp: new Date().toISOString()
  };
}

function getMockSoilData(lat, lon) {
  const isEquatorial = Math.abs(lat) < 10;
  const isTropical = Math.abs(lat) < 23.5;
  
  const basePh = isEquatorial ? 5.5 : isTropical ? 6.0 : 6.5;
  const moisture = isEquatorial ? 75 : isTropical ? 65 : 55;
  
  return {
    ph: basePh + (Math.random() * 0.8 - 0.4),
    nitrogen: Math.random() > 0.5 ? 'medium' : Math.random() > 0.5 ? 'high' : 'low',
    phosphorus: Math.random() > 0.6 ? 'low' : 'medium',
    potassium: Math.random() > 0.5 ? 'medium' : 'high',
    moisture: moisture + (Math.random() * 20 - 10),
    organicCarbon: 10 + Math.random() * 20,
    bulkDensity: 1.2 + Math.random() * 0.4,
    clayContent: 20 + Math.random() * 30,
    sandContent: 30 + Math.random() * 30,
    mock: true,
    timestamp: new Date().toISOString()
  };
}

export default router;

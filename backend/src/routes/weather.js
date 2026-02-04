import express from 'express';
import axios from 'axios';
import NodeCache from 'node-cache';

const router = express.Router();
const cache = new NodeCache({ stdTTL: 1800 }); // 30 minutes

const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Get current weather
router.get('/current', async (req, res, next) => {
  try {
    const { lat, lon } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const cacheKey = `weather_${lat}_${lon}`;
    const cached = cache.get(cacheKey);
    
    if (cached) {
      return res.json({ ...cached, cached: true });
    }

    // Access API key from process.env at runtime (not at import time)
    const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

    if (!OPENWEATHER_API_KEY || OPENWEATHER_API_KEY === 'demo') {
      console.log('⚠️  Using mock weather data - OpenWeatherMap API key not configured');
      return res.json(getMockWeatherData(parseFloat(lat), parseFloat(lon)));
    }

    try {
      const response = await axios.get(`${BASE_URL}/weather`, {
        params: {
          lat,
          lon,
          appid: OPENWEATHER_API_KEY,
          units: 'metric'
        },
        timeout: 5000
      });

      console.log('✅ Real weather data fetched successfully');
      const weatherData = {
        current: {
          temp: response.data.main.temp,
          humidity: response.data.main.humidity,
          precipitation: response.data.rain?.['1h'] || 0,
          windSpeed: response.data.wind.speed,
        },
        location: {
          name: response.data.name,
          country: response.data.sys.country
        },
        cached: false,
        source: 'OpenWeatherMap API'
      };

      cache.set(cacheKey, weatherData);
      return res.json(weatherData);

    } catch (error) {
      console.log('❌ OpenWeatherMap API Error:', error.response?.data?.message || error.message);
      console.log('🔄 Falling back to mock data...');
      return res.json({
        ...getMockWeatherData(parseFloat(lat), parseFloat(lon)),
        apiError: true,
        errorMessage: error.response?.data?.message || error.message
      });
    }
  } catch (error) {
    console.error('Weather route error:', error.message);
    res.json(getMockWeatherData(parseFloat(lat), parseFloat(lon)));
  }
});

// Get forecast
router.get('/forecast', async (req, res, next) => {
  try {
    const { lat, lon } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const cacheKey = `forecast_${lat}_${lon}`;
    const cached = cache.get(cacheKey);
    
    if (cached) {
      return res.json({ ...cached, cached: true });
    }

    // Access API key from process.env at runtime
    const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

    if (!OPENWEATHER_API_KEY || OPENWEATHER_API_KEY === 'demo') {
      console.log('⚠️  Using mock forecast data - OpenWeatherMap API key not configured');
      return res.json({ forecast: getMockForecast() });
    }

    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        lat,
        lon,
        appid: OPENWEATHER_API_KEY,
        units: 'metric'
      },
      timeout: 5000
    });

    const forecast = response.data.list.slice(0, 28).map(item => ({
      date: item.dt_txt,
      temp: item.main.temp,
      precipitation: item.rain?.['3h'] || 0,
      humidity: item.main.humidity,
    }));

    const forecastData = { forecast, timestamp: new Date().toISOString() };
    cache.set(cacheKey, forecastData);
    res.json(forecastData);
  } catch (error) {
    console.error('Forecast API error:', error.message);
    res.json({ forecast: getMockForecast() });
  }
});

// Mock data functions
function getMockWeatherData(lat, lon) {
  const isEquatorial = Math.abs(lat) < 10;
  const isTropical = Math.abs(lat) < 23.5;
  
  return {
    current: {
      temp: isEquatorial ? 27 : isTropical ? 24 : 18,
      humidity: isEquatorial ? 80 : 65,
      precipitation: isEquatorial ? 5 : 2,
      windSpeed: 3.5,
    },
    location: {
      name: 'Sample Location',
      country: 'XX'
    },
    mock: true,
    timestamp: new Date().toISOString()
  };
}

function getMockForecast() {
  const forecast = [];
  const now = new Date();
  
  for (let i = 0; i < 28; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() + i);
    
    forecast.push({
      date: date.toISOString(),
      temp: 20 + Math.random() * 10,
      precipitation: Math.random() * 5,
      humidity: 60 + Math.random() * 20,
    });
  }
  
  return forecast;
}

export default router;

// Quick test to verify OpenWeatherMap API key
import dotenv from 'dotenv';
import axios from 'axios';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from backend directory
dotenv.config({ path: path.join(__dirname, 'backend/.env') });

const API_KEY = process.env.OPENWEATHER_API_KEY;

console.log('🔑 Testing OpenWeatherMap API Key');
console.log('API Key:', API_KEY ? `${API_KEY.substring(0, 8)}...` : 'NOT_FOUND');
console.log('Key Length:', API_KEY?.length || 0);

async function testAPI() {
  try {
    console.log('\n🌍 Testing API call...');
    const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: {
        lat: 1.37,
        lon: 32.29,
        appid: API_KEY,
        units: 'metric'
      },
      timeout: 10000
    });

    console.log('✅ API Key VALID!');
    console.log(`📍 Location: ${response.data.name}, ${response.data.sys.country}`);
    console.log(`🌡️  Temperature: ${response.data.main.temp}°C`);
    console.log(`💧 Humidity: ${response.data.main.humidity}%`);
    console.log(`🌧️  Rain: ${response.data.rain?.['1h'] || 0}mm`);
    console.log(`💨 Wind: ${response.data.wind.speed} m/s`);
    
  } catch (error) {
    console.log('❌ API Key INVALID or ERROR:');
    if (error.response) {
      console.log(`Status: ${error.response.status}`);
      console.log(`Message: ${error.response.data.message}`);
    } else {
      console.log(`Error: ${error.message}`);
    }
  }
}

testAPI();

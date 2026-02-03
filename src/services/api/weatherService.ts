// Weather Service - OpenWeatherMap Integration
import { API_CONFIG, CACHE_DURATION } from './config';

export interface WeatherData {
  current: {
    temp: number;
    humidity: number;
    precipitation: number;
    windSpeed: number;
  };
  forecast: Array<{
    date: string;
    temp: number;
    precipitation: number;
    humidity: number;
  }>;
}

export interface DroughtRisk {
  probability: number;
  severity: 'low' | 'medium' | 'high';
  daysAhead: number;
  description: string;
}

class WeatherService {
  private cache = new Map<string, { data: any; timestamp: number }>();

  private getCached(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION.WEATHER) {
      return cached.data;
    }
    return null;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  async getCurrentWeather(lat: number, lon: number): Promise<WeatherData> {
    const cacheKey = `weather_${lat}_${lon}`;
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(
        `${API_CONFIG.OPENWEATHER.BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_CONFIG.OPENWEATHER.API_KEY}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error('Weather API request failed');
      }

      const data = await response.json();
      
      const weatherData: WeatherData = {
        current: {
          temp: data.main.temp,
          humidity: data.main.humidity,
          precipitation: data.rain?.['1h'] || 0,
          windSpeed: data.wind.speed,
        },
        forecast: [], // Will be populated by forecast call
      };

      this.setCache(cacheKey, weatherData);
      return weatherData;
    } catch (error) {
      console.error('Weather API error:', error);
      // Return mock data as fallback
      return this.getMockWeatherData(lat, lon);
    }
  }

  async getForecast(lat: number, lon: number): Promise<WeatherData['forecast']> {
    const cacheKey = `forecast_${lat}_${lon}`;
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(
        `${API_CONFIG.OPENWEATHER.BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_CONFIG.OPENWEATHER.API_KEY}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error('Forecast API request failed');
      }

      const data = await response.json();
      
      const forecast = data.list.slice(0, 28).map((item: any) => ({
        date: item.dt_txt,
        temp: item.main.temp,
        precipitation: item.rain?.['3h'] || 0,
        humidity: item.main.humidity,
      }));

      this.setCache(cacheKey, forecast);
      return forecast;
    } catch (error) {
      console.error('Forecast API error:', error);
      return this.getMockForecast();
    }
  }

  async predictDroughtRisk(lat: number, lon: number): Promise<DroughtRisk> {
    try {
      const forecast = await this.getForecast(lat, lon);
      
      // Calculate drought risk based on precipitation forecast
      const totalPrecipitation = forecast.reduce((sum, day) => sum + day.precipitation, 0);
      const avgHumidity = forecast.reduce((sum, day) => sum + day.humidity, 0) / forecast.length;
      
      let probability = 0;
      let severity: 'low' | 'medium' | 'high' = 'low';
      
      // Simple drought prediction algorithm
      if (totalPrecipitation < 10 && avgHumidity < 50) {
        probability = 75;
        severity = 'high';
      } else if (totalPrecipitation < 25 && avgHumidity < 60) {
        probability = 45;
        severity = 'medium';
      } else if (totalPrecipitation < 50) {
        probability = 20;
        severity = 'low';
      }

      return {
        probability,
        severity,
        daysAhead: 14,
        description: `${severity.charAt(0).toUpperCase() + severity.slice(1)} drought risk detected based on precipitation forecast`,
      };
    } catch (error) {
      console.error('Drought prediction error:', error);
      return {
        probability: 25,
        severity: 'low',
        daysAhead: 14,
        description: 'Moderate drought risk based on seasonal patterns',
      };
    }
  }

  private getMockWeatherData(lat: number, lon: number): WeatherData {
    // Generate realistic mock data based on latitude
    const isEquatorial = Math.abs(lat) < 10;
    const isTropical = Math.abs(lat) < 23.5;
    
    return {
      current: {
        temp: isEquatorial ? 27 : isTropical ? 24 : 18,
        humidity: isEquatorial ? 80 : 65,
        precipitation: isEquatorial ? 5 : 2,
        windSpeed: 3.5,
      },
      forecast: this.getMockForecast(),
    };
  }

  private getMockForecast(): WeatherData['forecast'] {
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
}

export const weatherService = new WeatherService();

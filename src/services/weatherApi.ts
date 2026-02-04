/**
 * Open-Meteo Weather API Service
 * 
 * Free weather API with no authentication required
 * Documentation: https://open-meteo.com/en/docs
 * 
 * Features:
 * - Real-time weather data
 * - Historical data (past 7 days)
 * - No API key required
 * - 10,000 requests/day limit (more than enough for demo)
 */

export interface WeatherData {
    latitude: number;
    longitude: number;
    timezone: string;
    daily: {
        time: string[];
        rain_sum: number[];
        temperature_2m_mean: number[];
        relative_humidity_2m_mean: number[];
    };
}

export interface MoistureMetrics {
    moistureIndex: number; // 0-100
    avgRainfall: number;   // mm/day
    avgTemperature: number; // °C
    avgHumidity: number;    // %
    lastUpdated: string;
}

const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds
const weatherCache = new Map<string, { data: WeatherData; timestamp: number }>();

/**
 * Fetch weather data from Open-Meteo API
 */
export async function fetchWeatherData(
    latitude: number,
    longitude: number,
    pastDays: number = 7
): Promise<WeatherData> {
    const cacheKey = `${latitude},${longitude},${pastDays}`;

    // Check cache first
    const cached = weatherCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        console.log('🌦️ Using cached weather data');
        return cached.data;
    }

    try {
        const url = new URL('https://api.open-meteo.com/v1/forecast');
        url.searchParams.set('latitude', latitude.toString());
        url.searchParams.set('longitude', longitude.toString());
        url.searchParams.set('daily', 'rain_sum,temperature_2m_mean,relative_humidity_2m_mean');
        url.searchParams.set('past_days', pastDays.toString());
        url.searchParams.set('timezone', 'auto');

        console.log('🌐 Fetching live weather data from Open-Meteo...');
        const response = await fetch(url.toString());

        if (!response.ok) {
            throw new Error(`Open-Meteo API error: ${response.status}`);
        }

        const data: WeatherData = await response.json();

        // Cache the result
        weatherCache.set(cacheKey, { data, timestamp: Date.now() });

        console.log('✅ Weather data fetched successfully');
        return data;
    } catch (error) {
        console.error('❌ Failed to fetch weather data:', error);

        // Return fallback mock data for demo stability
        return getFallbackWeatherData(latitude, longitude);
    }
}

/**
 * Calculate moisture index from weather data
 * 
 * Formula:
 * - Rainfall score: min(rainfall * 5, 100)
 * - Humidity score: humidity %
 * - Temperature penalty: max(0, (temp - 30) * 2)
 * - Moisture Index = (rainfall_score * 0.6 + humidity * 0.4) - temp_penalty
 */
export function calculateMoistureIndex(
    rainfall: number,      // mm/day
    humidity: number,      // %
    temperature: number    // °C
): number {
    // Normalize rainfall to 0-100 scale (20mm/day = 100)
    const rainfallScore = Math.min(rainfall * 5, 100);

    // Humidity is already 0-100
    const humidityScore = humidity;

    // Temperature penalty for extreme heat
    const tempPenalty = Math.max(0, (temperature - 30) * 2);

    // Weighted combination
    const moistureIndex = (rainfallScore * 0.6 + humidityScore * 0.4) - tempPenalty;

    // Clamp to 0-100 range
    return Math.max(0, Math.min(100, Math.round(moistureIndex)));
}

/**
 * Get moisture metrics from weather data
 */
export function getMoistureMetrics(weatherData: WeatherData): MoistureMetrics {
    const { daily } = weatherData;

    // Calculate averages from recent data
    const avgRainfall = average(daily.rain_sum);
    const avgTemperature = average(daily.temperature_2m_mean);
    const avgHumidity = average(daily.relative_humidity_2m_mean);

    // Calculate moisture index
    const moistureIndex = calculateMoistureIndex(
        avgRainfall,
        avgHumidity,
        avgTemperature
    );

    return {
        moistureIndex,
        avgRainfall: Math.round(avgRainfall * 10) / 10,
        avgTemperature: Math.round(avgTemperature * 10) / 10,
        avgHumidity: Math.round(avgHumidity),
        lastUpdated: new Date().toISOString()
    };
}

/**
 * Fallback weather data for demo stability
 */
function getFallbackWeatherData(latitude: number, longitude: number): WeatherData {
    console.log('⚠️ Using fallback weather data (API unavailable)');

    const today = new Date();
    const dates: string[] = [];
    const rainfall: number[] = [];
    const temperature: number[] = [];
    const humidity: number[] = [];

    // Generate 7 days of mock data
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        dates.push(date.toISOString().split('T')[0]);

        // Realistic mock values with some variation
        rainfall.push(Math.random() * 15 + 2); // 2-17mm
        temperature.push(Math.random() * 8 + 22); // 22-30°C
        humidity.push(Math.random() * 20 + 60); // 60-80%
    }

    return {
        latitude,
        longitude,
        timezone: 'auto',
        daily: {
            time: dates,
            rain_sum: rainfall,
            temperature_2m_mean: temperature,
            relative_humidity_2m_mean: humidity
        }
    };
}

/**
 * Helper: Calculate average of array
 */
function average(arr: number[]): number {
    return arr.reduce((sum, val) => sum + val, 0) / arr.length;
}

/**
 * Clear weather cache (useful for testing)
 */
export function clearWeatherCache(): void {
    weatherCache.clear();
    console.log('🗑️ Weather cache cleared');
}

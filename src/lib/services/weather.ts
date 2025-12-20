// Open-Meteo API client
// Fetches weather for 7 Turkish cities and calculates weighted average

import { get } from './api-client'

const OPEN_METEO_BASE_URL = 'https://api.open-meteo.com/v1/forecast'

// 7 major cities with population-based weights
const CITIES = [
  { name: 'Istanbul', lat: 41.0082, lon: 28.9784, weight: 0.44 },
  { name: 'Ankara', lat: 39.9334, lon: 32.8597, weight: 0.15 },
  { name: 'Izmir', lat: 38.4237, lon: 27.1428, weight: 0.13 },
  { name: 'Bursa', lat: 40.1885, lon: 29.0610, weight: 0.09 },
  { name: 'Antalya', lat: 36.8969, lon: 30.7133, weight: 0.08 },
  { name: 'Adana', lat: 37.0000, lon: 35.3213, weight: 0.06 },
  { name: 'Konya', lat: 37.8746, lon: 32.4932, weight: 0.05 },
] as const

const HOURLY_VARIABLES = [
  'temperature_2m',
  'apparent_temperature',
  'relative_humidity_2m',
  'precipitation',
  'wind_speed_10m',
  'shortwave_radiation',
  'weather_code',
] as const

interface OpenMeteoResponse {
  hourly: {
    time: string[]
    temperature_2m: number[]
    apparent_temperature: number[]
    relative_humidity_2m: number[]
    precipitation: number[]
    wind_speed_10m: number[]
    shortwave_radiation: number[]
    weather_code: number[]
  }
}

export interface WeatherData {
  datetime: string
  temperature_2m: number
  apparent_temperature: number
  relative_humidity_2m: number
  precipitation: number
  wind_speed_10m: number
  shortwave_radiation: number
  weather_code: number
}

async function fetchCityWeather(
  lat: number,
  lon: number,
  forecastDays: number = 7
): Promise<OpenMeteoResponse> {
  return get<OpenMeteoResponse>(OPEN_METEO_BASE_URL, {
    params: {
      latitude: lat,
      longitude: lon,
      hourly: HOURLY_VARIABLES.join(','),
      timezone: 'Europe/Istanbul',
      forecast_days: forecastDays,
    },
  })
}

function calculateWeightedAverage(
  citiesData: OpenMeteoResponse[],
  hourIndex: number,
  variable: keyof OpenMeteoResponse['hourly']
): number {
  if (variable === 'time') return 0

  let weightedSum = 0
  for (let i = 0; i < CITIES.length; i++) {
    const value = citiesData[i].hourly[variable][hourIndex]
    weightedSum += value * CITIES[i].weight
  }
  return weightedSum
}

// Fetch weather forecast for Turkey (weighted average of 7 cities)
export async function getWeatherForecast(forecastDays: number = 7): Promise<WeatherData[]> {
  // Fetch all cities in parallel
  const citiesData = await Promise.all(
    CITIES.map((city) => fetchCityWeather(city.lat, city.lon, forecastDays))
  )

  const hourCount = citiesData[0].hourly.time.length
  const weatherData: WeatherData[] = []

  for (let i = 0; i < hourCount; i++) {
    weatherData.push({
      datetime: citiesData[0].hourly.time[i],
      temperature_2m: calculateWeightedAverage(citiesData, i, 'temperature_2m'),
      apparent_temperature: calculateWeightedAverage(citiesData, i, 'apparent_temperature'),
      relative_humidity_2m: calculateWeightedAverage(citiesData, i, 'relative_humidity_2m'),
      precipitation: calculateWeightedAverage(citiesData, i, 'precipitation'),
      wind_speed_10m: calculateWeightedAverage(citiesData, i, 'wind_speed_10m'),
      shortwave_radiation: calculateWeightedAverage(citiesData, i, 'shortwave_radiation'),
      weather_code: Math.round(calculateWeightedAverage(citiesData, i, 'weather_code')),
    })
  }

  return weatherData
}

// Get current weather (latest hour)
export async function getCurrentWeather(): Promise<WeatherData> {
  const forecast = await getWeatherForecast(1)
  const now = new Date()
  const currentHour = now.getHours()

  // Find the closest hour
  return forecast[currentHour] || forecast[0]
}

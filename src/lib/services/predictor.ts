// FastAPI client for electricity consumption prediction

import { post, get } from './api-client'
import type { WeatherData } from './weather'

const MODELS_API_URL = process.env.MODELS_API_URL || 'http://localhost:8000'

export type ModelName = 'catboost' | 'lightgbm' | 'xgboost'

interface LagData {
  lag_1h: number
  lag_24h: number
  lag_168h: number
}

interface PredictionRequest {
  datetime: string
  weather: {
    temperature_2m: number
    apparent_temperature: number
    relative_humidity_2m: number
    precipitation: number
    wind_speed_10m: number
    shortwave_radiation: number
    weather_code: number
  }
  lags: LagData
  model: ModelName
}

interface PredictionResponse {
  prediction: number
  model: string
  datetime: string
}

interface ModelsResponse {
  models: string[]
  default: string
}

// Make a prediction using FastAPI
export async function predict(
  datetime: Date,
  weather: Omit<WeatherData, 'datetime'>,
  lags: LagData,
  model: ModelName = 'catboost'
): Promise<PredictionResponse> {
  const request: PredictionRequest = {
    datetime: datetime.toISOString(),
    weather: {
      temperature_2m: weather.temperature_2m,
      apparent_temperature: weather.apparent_temperature,
      relative_humidity_2m: weather.relative_humidity_2m,
      precipitation: weather.precipitation,
      wind_speed_10m: weather.wind_speed_10m,
      shortwave_radiation: weather.shortwave_radiation,
      weather_code: weather.weather_code,
    },
    lags,
    model,
  }

  return post<PredictionResponse>(`${MODELS_API_URL}/predict`, request)
}

// Get available models
export async function getModels(): Promise<ModelsResponse> {
  return get<ModelsResponse>(`${MODELS_API_URL}/models`)
}

// Health check
export async function healthCheck(): Promise<boolean> {
  try {
    await get<{ status: string }>(`${MODELS_API_URL}/health`)
    return true
  } catch {
    return false
  }
}

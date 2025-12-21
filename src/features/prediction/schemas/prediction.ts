// Prediction validation schemas

import { z } from 'zod'

// Model seçenekleri
export const modelNameSchema = z.enum(['catboost', 'lightgbm', 'xgboost'])

// Tahmin getirme
export const getPredictionsSchema = z.object({
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  model: modelNameSchema.optional().default('catboost'),
})

// Simülasyon için manuel input
export const simulationInputSchema = z.object({
  datetime: z.coerce.date(),
  model: modelNameSchema.optional().default('catboost'),
  weather: z.object({
    temperature_2m: z.number(),
    apparent_temperature: z.number(),
    relative_humidity_2m: z.number().min(0).max(100),
    precipitation: z.number().min(0),
    wind_speed_10m: z.number().min(0),
    shortwave_radiation: z.number().min(0),
    weather_code: z.number().int().min(0),
  }),
  lags: z.object({
    lag_1h: z.number().min(0),
    lag_24h: z.number().min(0),
    lag_168h: z.number().min(0),
  }),
})

// Tarihe göre tek tahmin
export const getPredictionByDateSchema = z.object({
  datetime: z.coerce.date(),
  model: modelNameSchema.optional().default('catboost'),
})

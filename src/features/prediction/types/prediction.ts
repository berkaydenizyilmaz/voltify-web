// Prediction types

import { z } from "zod";
import type {
  modelNameSchema,
  getPredictionsSchema,
  simulationInputSchema,
  getPredictionByDateSchema,
} from "../schemas";

// Input types (from schemas)
export type ModelName = z.infer<typeof modelNameSchema>;
export type GetPredictionsInput = z.infer<typeof getPredictionsSchema>;
export type SimulationInput = z.infer<typeof simulationInputSchema>;
export type GetPredictionByDateInput = z.infer<
  typeof getPredictionByDateSchema
>;

// Weather data (from Open-Meteo)
export type WeatherSnapshot = {
  temperature_2m: number;
  apparent_temperature: number;
  relative_humidity_2m: number;
  precipitation: number;
  wind_speed_10m: number;
  shortwave_radiation: number;
  weather_code: number;
};
// Prediction result
export interface PredictionResult {
  datetime: Date;
  model: ModelName;
  predictedValue: number;
  weatherData: WeatherSnapshot;
}

// Hourly forecast item (for charts)
export interface HourlyForecast {
  datetime: string;
  predicted: number;
  actual?: number;
  model: ModelName;
}

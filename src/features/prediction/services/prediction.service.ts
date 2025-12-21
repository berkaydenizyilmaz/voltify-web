// Prediction business logic

import { predictions, consumption } from "@/lib/data";
import { getWeatherForecast, predict as callPredictor } from "@/lib/services";
import type {
  ModelName,
  PredictionResult,
  SimulationInput,
  WeatherSnapshot,
  HourlyForecast,
} from "../types";

// Generate predictions for next 168 hours (7 days) starting from current hour
// Uses iterative forecasting: previous predictions become lags for future predictions
export async function generatePredictions(
  hours: number = 168,
  model: ModelName = "catboost"
): Promise<PredictionResult[]> {
  // Fetch weather forecast (already filtered to future hours)
  const weatherData = await getWeatherForecast(hours);

  const results: PredictionResult[] = [];
  const previousPredictions: number[] = []; // Store predictions for use as lags

  for (let i = 0; i < weatherData.length; i++) {
    const weather = weatherData[i];
    const datetime = new Date(weather.datetime);

    // Get base lag values from DB (for hours where real data exists)
    const baseLags = await consumption.getLags(datetime);

    // Build lags using iterative strategy
    const lags = {
      // lag_1h: Use previous prediction if hour > 2, else use real data
      lag_1h:
        i >= 3 && previousPredictions[i - 1]
          ? previousPredictions[i - 1]
          : baseLags.lag_1h,

      // lag_24h: Use prediction from 24 hours ago if available, else real data
      lag_24h:
        i >= 24 && previousPredictions[i - 24]
          ? previousPredictions[i - 24]
          : baseLags.lag_24h,

      // lag_168h: Use prediction from 168 hours ago if available, else real data
      lag_168h:
        i >= 168 && previousPredictions[i - 168]
          ? previousPredictions[i - 168]
          : baseLags.lag_168h,
    };

    // Call FastAPI predictor
    const response = await callPredictor(datetime, weather, lags, model);

    // Store this prediction for future iterations
    previousPredictions[i] = response.prediction;

    const weatherSnapshot: WeatherSnapshot = {
      temperature_2m: weather.temperature_2m,
      apparent_temperature: weather.apparent_temperature,
      relative_humidity_2m: weather.relative_humidity_2m,
      precipitation: weather.precipitation,
      wind_speed_10m: weather.wind_speed_10m,
      shortwave_radiation: weather.shortwave_radiation,
      weather_code: weather.weather_code,
    };

    // Save to database
    await predictions.upsert(datetime, model, {
      predictedValue: response.prediction,
      weatherData: weatherSnapshot,
    });

    results.push({
      datetime,
      model,
      predictedValue: response.prediction,
      weatherData: weatherSnapshot,
    });
  }

  return results;
}

// Run simulation with custom inputs
export async function runSimulation(
  input: SimulationInput
): Promise<PredictionResult> {
  const response = await callPredictor(
    input.datetime,
    input.weather,
    input.lags,
    input.model
  );

  return {
    datetime: input.datetime,
    model: input.model,
    predictedValue: response.prediction,
    weatherData: input.weather,
  };
}

// Get stored predictions for date range
export async function getPredictionsByRange(
  startDate: Date,
  endDate: Date,
  model?: ModelName
): Promise<HourlyForecast[]> {
  const stored = await predictions.getByDateRange(startDate, endDate, model);
  const actuals = await consumption.getByDateRange(startDate, endDate);

  // Map actuals by datetime for quick lookup
  const actualMap = new Map(
    actuals.map((a) => [a.datetime.toISOString(), a.value])
  );

  return stored.map((p) => ({
    datetime: p.targetDatetime.toISOString(),
    predicted: p.predictedValue,
    actual: actualMap.get(p.targetDatetime.toISOString()),
    model: p.modelName as ModelName,
  }));
}

// Get latest predictions (next N hours from now)
export async function getLatestPredictions(
  hours: number = 168,
  model?: ModelName
): Promise<HourlyForecast[]> {
  const stored = await predictions.getLatest(hours, model);

  return stored.map((p) => ({
    datetime: p.targetDatetime.toISOString(),
    predicted: p.predictedValue,
    model: p.modelName as ModelName,
  }));
}

// Get single prediction
export async function getPrediction(
  datetime: Date,
  model: ModelName = "catboost"
): Promise<PredictionResult | null> {
  const stored = await predictions.getOne(datetime, model);

  if (!stored) return null;

  return {
    datetime: stored.targetDatetime,
    model: stored.modelName as ModelName,
    predictedValue: stored.predictedValue,
    weatherData: stored.weatherData as WeatherSnapshot,
  };
}

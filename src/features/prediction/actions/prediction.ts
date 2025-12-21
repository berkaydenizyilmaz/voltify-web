'use server'

// Prediction server actions

import { publicAction } from '@/lib/safe-action'
import {
  getPredictionsSchema,
  simulationInputSchema,
  getPredictionByDateSchema,
} from '../schemas'
import {
  getPredictionsByRange,
  getLatestPredictions,
  getPrediction,
  runSimulation,
} from '../services'

// Get predictions for date range
export const getPredictionsAction = publicAction
  .schema(getPredictionsSchema)
  .action(async ({ parsedInput }) => {
    const { startDate, endDate, model } = parsedInput
    const data = await getPredictionsByRange(startDate, endDate, model)
    return { data }
  })

// Get latest predictions (next 7 days)
export const getLatestPredictionsAction = publicAction
  .schema(getPredictionsSchema.pick({ model: true }))
  .action(async ({ parsedInput }) => {
    const data = await getLatestPredictions(168, parsedInput.model)
    return { data }
  })

// Get single prediction by datetime
export const getPredictionAction = publicAction
  .schema(getPredictionByDateSchema)
  .action(async ({ parsedInput }) => {
    const { datetime, model } = parsedInput
    const data = await getPrediction(datetime, model)
    return { data }
  })

// Run simulation with custom inputs
export const runSimulationAction = publicAction
  .schema(simulationInputSchema)
  .action(async ({ parsedInput }) => {
    const result = await runSimulation(parsedInput)
    return { data: result }
  })

// Prediction DAL

import prisma from '@/lib/db'
import type { Prisma } from '@/app/generated/prisma'

export type PredictionCreate = Prisma.PredictionCreateInput
export type PredictionWhere = Prisma.PredictionWhereInput

// Create a new prediction
export async function create(data: PredictionCreate) {
  return prisma.prediction.create({ data })
}

// Create or update prediction (upsert by targetDatetime + modelName)
export async function upsert(
  targetDatetime: Date,
  modelName: string,
  data: Omit<PredictionCreate, 'targetDatetime' | 'modelName'>
) {
  return prisma.prediction.upsert({
    where: {
      targetDatetime_modelName: { targetDatetime, modelName },
    },
    create: { targetDatetime, modelName, ...data },
    update: data,
  })
}

// Create many predictions (batch insert)
export async function createMany(data: PredictionCreate[]) {
  return prisma.prediction.createMany({
    data,
    skipDuplicates: true,
  })
}

// Get predictions by date range
export async function getByDateRange(
  start: Date,
  end: Date,
  modelName?: string
) {
  return prisma.prediction.findMany({
    where: {
      targetDatetime: { gte: start, lte: end },
      ...(modelName && { modelName }),
    },
    orderBy: { targetDatetime: 'asc' },
  })
}

// Get latest predictions (next N hours)
export async function getLatest(hours: number = 168, modelName?: string) {
  const now = new Date()
  const end = new Date(now.getTime() + hours * 60 * 60 * 1000)

  return prisma.prediction.findMany({
    where: {
      targetDatetime: { gte: now, lte: end },
      ...(modelName && { modelName }),
    },
    orderBy: { targetDatetime: 'asc' },
  })
}

// Get single prediction
export async function getOne(targetDatetime: Date, modelName: string) {
  return prisma.prediction.findUnique({
    where: {
      targetDatetime_modelName: { targetDatetime, modelName },
    },
  })
}

// Delete old predictions (cleanup)
export async function deleteOlderThan(date: Date) {
  return prisma.prediction.deleteMany({
    where: { targetDatetime: { lt: date } },
  })
}

// Count predictions
export async function count(where?: PredictionWhere) {
  return prisma.prediction.count({ where })
}

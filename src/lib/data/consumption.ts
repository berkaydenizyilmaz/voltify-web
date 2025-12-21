// Actual Consumption DAL

import prisma from "@/lib/db";
import type { Prisma } from "@/app/generated/prisma/client";

export type ConsumptionCreate = Prisma.ActualConsumptionCreateInput;
export type ConsumptionWhere = Prisma.ActualConsumptionWhereInput;

// Create a new consumption record
export async function create(data: ConsumptionCreate) {
  return prisma.actualConsumption.create({ data });
}

// Create or update consumption (upsert by datetime)
export async function upsert(datetime: Date, value: number) {
  return prisma.actualConsumption.upsert({
    where: { datetime },
    create: { datetime, value },
    update: { value },
  });
}

// Create many consumption records (batch insert)
export async function createMany(data: ConsumptionCreate[]) {
  return prisma.actualConsumption.createMany({
    data,
    skipDuplicates: true,
  });
}

// Get consumption by date range
export async function getByDateRange(start: Date, end: Date) {
  return prisma.actualConsumption.findMany({
    where: {
      datetime: { gte: start, lte: end },
    },
    orderBy: { datetime: "asc" },
  });
}

// Get single consumption record
export async function getOne(datetime: Date) {
  return prisma.actualConsumption.findUnique({
    where: { datetime },
  });
}

// Get lag values for prediction (1h, 24h, 168h ago)
// Uses forward-fill strategy: if exact lag not found, use most recent known value
export async function getLags(targetDatetime: Date) {
  const lag1h = new Date(targetDatetime.getTime() - 1 * 60 * 60 * 1000);
  const lag24h = new Date(targetDatetime.getTime() - 24 * 60 * 60 * 1000);
  const lag168h = new Date(targetDatetime.getTime() - 168 * 60 * 60 * 1000);

  const [val1h, val24h, val168h] = await Promise.all([
    getOne(lag1h),
    getOne(lag24h),
    getOne(lag168h),
  ]);

  // If lag values not found, use most recent known consumption (forward fill)
  let fallback: number | null = null;
  if (!val1h || !val24h || !val168h) {
    const latest = await getLatest(1);
    fallback = latest[0]?.value ?? 35000; // Default to ~35GWh if no data
  }

  return {
    lag_1h: val1h?.value ?? fallback ?? 35000,
    lag_24h: val24h?.value ?? fallback ?? 35000,
    lag_168h: val168h?.value ?? fallback ?? 35000,
  };
}

// Get latest N records
export async function getLatest(limit: number = 24) {
  return prisma.actualConsumption.findMany({
    orderBy: { datetime: "desc" },
    take: limit,
  });
}

// Delete old records (cleanup)
export async function deleteOlderThan(date: Date) {
  return prisma.actualConsumption.deleteMany({
    where: { datetime: { lt: date } },
  });
}

// Count records
export async function count(where?: ConsumptionWhere) {
  return prisma.actualConsumption.count({ where });
}

// Get historical average for same day-of-week and hour
// Useful for filling missing lag values
export async function getHistoricalAverage(dayOfWeek: number, hour: number) {
  // Get last 4 weeks of data for same day/hour
  const fourWeeksAgo = new Date();
  fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);

  const records = await prisma.actualConsumption.findMany({
    where: {
      datetime: { gte: fourWeeksAgo },
    },
    orderBy: { datetime: "desc" },
  });

  // Filter by day of week and hour
  const matching = records.filter((r) => {
    const d = new Date(r.datetime);
    return d.getDay() === dayOfWeek && d.getHours() === hour;
  });

  if (matching.length === 0) return null;

  const sum = matching.reduce((acc, r) => acc + r.value, 0);
  return sum / matching.length;
}

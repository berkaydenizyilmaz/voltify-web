// Consumption sync business logic

import { consumption, predictions } from "@/lib/data";
import { getUecm } from "@/lib/services";

// Smart sync: Only fetch consumption for predictions that don't have actual values yet
// This ensures no gaps and no unnecessary requests
export async function syncFromEpias(): Promise<number> {
  const now = new Date();

  // Find predictions from the past that don't have matching consumption data
  // EPİAŞ has ~2 hour delay, so only look at predictions older than 2 hours
  const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);

  // Get past predictions (from last 7 days up to 2 hours ago)
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const pastPredictions = await predictions.getByDateRange(
    sevenDaysAgo,
    twoHoursAgo
  );

  if (pastPredictions.length === 0) {
    return 0; // No past predictions to match
  }

  // Get existing consumption data for the same range
  const existingConsumption = await consumption.getByDateRange(
    sevenDaysAgo,
    twoHoursAgo
  );
  const existingSet = new Set(
    existingConsumption.map((c) => c.datetime.toISOString())
  );

  // Find predictions without matching consumption
  const missingHours = pastPredictions
    .filter((p) => !existingSet.has(p.targetDatetime.toISOString()))
    .map((p) => p.targetDatetime);

  if (missingHours.length === 0) {
    return 0; // All predictions have matching consumption
  }

  // Find the date range to fetch
  const minDate = new Date(Math.min(...missingHours.map((d) => d.getTime())));
  const maxDate = new Date(Math.max(...missingHours.map((d) => d.getTime())));

  // Add 1 hour buffer on each side
  minDate.setHours(minDate.getHours() - 1);
  maxDate.setHours(maxDate.getHours() + 1);

  // Fetch from EPİAŞ
  const data = await getUecm(minDate, maxDate);

  let syncedCount = 0;

  for (const item of data.items) {
    // Upsert to DB
    await consumption.upsert(item.datetime, item.consumption);
    syncedCount++;
  }

  return syncedCount;
}

// Get consumption stats for dashboard
export async function getStats(): Promise<{
  lastSyncedAt: Date | null;
  totalRecords: number;
  latestValue: number | null;
}> {
  const latest = await consumption.getLatest(1);
  const total = await consumption.count();

  return {
    lastSyncedAt: latest[0]?.datetime ?? null,
    totalRecords: total,
    latestValue: latest[0]?.value ?? null,
  };
}

// Get consumption for date range (for charts)
export async function getConsumptionByRange(startDate: Date, endDate: Date) {
  return consumption.getByDateRange(startDate, endDate);
}

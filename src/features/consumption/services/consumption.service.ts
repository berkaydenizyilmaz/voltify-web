// Consumption sync business logic

import { consumption } from "@/lib/data";
import { getUecm } from "@/lib/services";

// Sync consumption data from EPİAŞ to DB
// EPİAŞ data is ~2 hours delayed
// Called hourly, so we fetch last 4 hours to catch any missed data
export async function syncFromEpias(): Promise<number> {
  const endDate = new Date();
  const startDate = new Date(endDate.getTime() - 4 * 60 * 60 * 1000); // 4 hours back

  // Fetch from EPİAŞ
  const data = await getUecm(startDate, endDate);

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

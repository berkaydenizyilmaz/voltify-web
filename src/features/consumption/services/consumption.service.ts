// Consumption sync business logic

import { consumption } from '@/lib/data'
import { getUecm } from '@/lib/services'

// Sync consumption data from EPİAŞ to DB
// EPİAŞ has ~2 hour delay, so we fetch last 24-48 hours
export async function syncFromEpias(hoursBack: number = 48): Promise<number> {
  const endDate = new Date()
  const startDate = new Date(endDate.getTime() - hoursBack * 60 * 60 * 1000)

  // Fetch from EPİAŞ
  const data = await getUecm(startDate, endDate)

  let syncedCount = 0

  for (const item of data.items) {
    // Parse EPİAŞ date format and hour
    const datetime = new Date(item.date)
    datetime.setHours(item.hour, 0, 0, 0)

    // Upsert to DB
    await consumption.upsert(datetime, item.consumption)
    syncedCount++
  }

  return syncedCount
}

// Get consumption stats for dashboard
export async function getStats(): Promise<{
  lastSyncedAt: Date | null
  totalRecords: number
  latestValue: number | null
}> {
  const latest = await consumption.getLatest(1)
  const total = await consumption.count()

  return {
    lastSyncedAt: latest[0]?.datetime ?? null,
    totalRecords: total,
    latestValue: latest[0]?.value ?? null,
  }
}

// Get consumption for date range (for charts)
export async function getConsumptionByRange(startDate: Date, endDate: Date) {
  return consumption.getByDateRange(startDate, endDate)
}

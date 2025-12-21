"use server";

// Consumption server actions

import { z } from "zod";
import { publicAction } from "@/lib/safe-action";
import { syncFromEpias, getStats, getConsumptionByRange } from "../services";

// Sync consumption from EPİAŞ
export const syncConsumptionAction = publicAction
  .schema(z.object({ hoursBack: z.number().min(1).max(168).optional() }))
  .action(async () => {
    const synced = await syncFromEpias();
    return { synced, message: `${synced} kayıt senkronize edildi` };
  });

// Get consumption stats
export const getConsumptionStatsAction = publicAction
  .schema(z.object({}))
  .action(async () => {
    const stats = await getStats();
    return { data: stats };
  });

// Get consumption by date range
export const getConsumptionByRangeAction = publicAction
  .schema(
    z.object({
      startDate: z.coerce.date(),
      endDate: z.coerce.date(),
    })
  )
  .action(async ({ parsedInput }) => {
    const data = await getConsumptionByRange(
      parsedInput.startDate,
      parsedInput.endDate
    );
    return { data };
  });

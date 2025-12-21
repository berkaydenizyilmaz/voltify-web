// Cron: Sync consumption data from EPİAŞ
// Runs every hour

import { NextResponse } from "next/server";
import { syncFromEpias } from "@/features/consumption";

// Cron secret for security
const CRON_SECRET = process.env.CRON_SECRET;

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Sync last 48 hours (to catch any delayed data)
    const synced = await syncFromEpias();

    return NextResponse.json({
      success: true,
      synced,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Consumption sync failed:", error);
    return NextResponse.json(
      { error: "Sync failed", message: String(error) },
      { status: 500 }
    );
  }
}

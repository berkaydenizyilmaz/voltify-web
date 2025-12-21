// Cron: Generate predictions for next 7 days
// Runs every hour

import { NextResponse } from 'next/server'
import { generatePredictions } from '@/features/prediction'

// Vercel cron secret for security
const CRON_SECRET = process.env.CRON_SECRET

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Generate predictions for next 168 hours (7 days)
    const predictions = await generatePredictions(168, 'catboost')

    return NextResponse.json({
      success: true,
      generated: predictions.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Prediction sync failed:', error)
    return NextResponse.json(
      { error: 'Sync failed', message: String(error) },
      { status: 500 }
    )
  }
}

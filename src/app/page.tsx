import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  FlashIcon,
  Calendar03Icon,
  ChartLineData02Icon,
  CpuIcon,
} from '@hugeicons/core-free-icons'
import { getLatestPredictions } from '@/features/prediction/services'
import { getStats } from '@/features/consumption/services'

async function getDashboardData() {
  try {
    const [predictions, stats] = await Promise.all([
      getLatestPredictions(24),
      getStats(),
    ])
    return { predictions, stats, error: null }
  } catch (e) {
    console.error('Dashboard data error:', e)
    return { predictions: [], stats: null, error: String(e) }
  }
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat('tr-TR', {
    maximumFractionDigits: 0,
  }).format(num)
}

function formatDate(date: Date | null): string {
  if (!date) return '-'
  return new Intl.DateTimeFormat('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export default async function DashboardPage() {
  const { predictions, stats } = await getDashboardData()

  const currentPrediction = predictions[0]
  const avgPrediction =
    predictions.length > 0
      ? predictions.reduce((sum, p) => sum + p.predicted, 0) / predictions.length
      : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Türkiye geneli elektrik tüketim tahminleri
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <HugeiconsIcon icon={FlashIcon} size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Anlık Tahmin</p>
              <p className="text-xl font-bold">
                {currentPrediction ? formatNumber(currentPrediction.predicted) : '-'} MWh
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500/10">
              <HugeiconsIcon icon={ChartLineData02Icon} size={20} className="text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">24 Saat Ort.</p>
              <p className="text-xl font-bold">
                {avgPrediction ? formatNumber(avgPrediction) : '-'} MWh
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-green-500/10">
              <HugeiconsIcon icon={Calendar03Icon} size={20} className="text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Son Sync</p>
              <p className="text-sm font-medium">
                {formatDate(stats?.lastSyncedAt ?? null)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-purple-500/10">
              <HugeiconsIcon icon={CpuIcon} size={20} className="text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Aktif Model</p>
              <Badge variant="secondary">CatBoost</Badge>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-4">
        <h2 className="mb-4 text-lg font-semibold">Önümüzdeki 24 Saat</h2>
        {predictions.length === 0 ? (
          <p className="text-muted-foreground">Henüz tahmin verisi yok.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-2 font-medium">Saat</th>
                  <th className="pb-2 font-medium">Tahmin (MWh)</th>
                  <th className="pb-2 font-medium">Model</th>
                </tr>
              </thead>
              <tbody>
                {predictions.slice(0, 12).map((p) => (
                  <tr key={p.datetime} className="border-b last:border-0">
                    <td className="py-2">
                      {new Date(p.datetime).toLocaleString('tr-TR', {
                        hour: '2-digit',
                        minute: '2-digit',
                        day: '2-digit',
                        month: '2-digit',
                      })}
                    </td>
                    <td className="py-2 font-mono">{formatNumber(p.predicted)}</td>
                    <td className="py-2">
                      <Badge variant="outline">{p.model}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}

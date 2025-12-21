import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getPredictionsByRange } from '@/features/prediction/services'
import { getConsumptionByRange } from '@/features/consumption/services'

async function getComparisonData() {
  try {
    const endDate = new Date()
    const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000)

    const [predictions, actuals] = await Promise.all([
      getPredictionsByRange(startDate, endDate),
      getConsumptionByRange(startDate, endDate),
    ])

    return { predictions, actuals }
  } catch (e) {
    console.error('Comparison error:', e)
    return { predictions: [], actuals: [] }
  }
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat('tr-TR', {
    maximumFractionDigits: 0,
  }).format(num)
}

function calculateMetrics(
  predictions: { datetime: string; predicted: number }[],
  actuals: { datetime: Date; value: number }[]
) {
  if (predictions.length === 0 || actuals.length === 0) {
    return { mae: 0, rmse: 0, mape: 0, count: 0 }
  }

  const actualMap = new Map(
    actuals.map((a) => [a.datetime.toISOString(), a.value])
  )

  let sumError = 0
  let sumSquaredError = 0
  let sumPercentError = 0
  let count = 0

  for (const p of predictions) {
    const actual = actualMap.get(p.datetime)
    if (actual !== undefined) {
      const error = Math.abs(p.predicted - actual)
      sumError += error
      sumSquaredError += error * error
      sumPercentError += (error / actual) * 100
      count++
    }
  }

  if (count === 0) return { mae: 0, rmse: 0, mape: 0, count: 0 }

  return {
    mae: sumError / count,
    rmse: Math.sqrt(sumSquaredError / count),
    mape: sumPercentError / count,
    count,
  }
}

export default async function KarsilastirmaPage() {
  const { predictions, actuals } = await getComparisonData()
  const metrics = calculateMetrics(predictions, actuals)

  const actualMap = new Map(
    actuals.map((a) => [a.datetime.toISOString(), a.value])
  )

  const comparisonData = predictions
    .map((p) => ({
      datetime: p.datetime,
      predicted: p.predicted,
      actual: actualMap.get(p.datetime),
      error: actualMap.has(p.datetime)
        ? Math.abs(p.predicted - actualMap.get(p.datetime)!)
        : null,
    }))
    .filter((d) => d.actual !== undefined)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Karşılaştırma</h1>
        <p className="text-muted-foreground">
          Tahminler vs gerçek tüketim (son 7 gün)
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="p-4 text-center">
          <p className="text-sm text-muted-foreground">Veri Sayısı</p>
          <p className="text-2xl font-bold">{metrics.count}</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-sm text-muted-foreground">MAE</p>
          <p className="text-2xl font-bold">{formatNumber(metrics.mae)} MWh</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-sm text-muted-foreground">RMSE</p>
          <p className="text-2xl font-bold">{formatNumber(metrics.rmse)} MWh</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-sm text-muted-foreground">MAPE</p>
          <p className="text-2xl font-bold">{metrics.mape.toFixed(2)}%</p>
        </Card>
      </div>

      <Card className="p-4">
        <h2 className="mb-4 text-lg font-semibold">Detaylı Karşılaştırma</h2>
        {comparisonData.length === 0 ? (
          <p className="text-muted-foreground">
            Karşılaştırılacak veri bulunamadı.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-2 font-medium">Tarih/Saat</th>
                  <th className="pb-2 font-medium">Tahmin</th>
                  <th className="pb-2 font-medium">Gerçek</th>
                  <th className="pb-2 font-medium">Hata</th>
                  <th className="pb-2 font-medium">Durum</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.slice(0, 50).map((d) => {
                  const errorPercent = d.actual
                    ? (d.error! / d.actual) * 100
                    : 0
                  const isGood = errorPercent < 5
                  const isOk = errorPercent < 10

                  return (
                    <tr key={d.datetime} className="border-b last:border-0">
                      <td className="py-2">
                        {new Date(d.datetime).toLocaleString('tr-TR', {
                          day: '2-digit',
                          month: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="py-2 font-mono">
                        {formatNumber(d.predicted)}
                      </td>
                      <td className="py-2 font-mono">
                        {formatNumber(d.actual!)}
                      </td>
                      <td className="py-2 font-mono">
                        {formatNumber(d.error!)} ({errorPercent.toFixed(1)}%)
                      </td>
                      <td className="py-2">
                        <Badge
                          variant={isGood ? 'default' : isOk ? 'secondary' : 'destructive'}
                        >
                          {isGood ? 'İyi' : isOk ? 'Orta' : 'Kötü'}
                        </Badge>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}

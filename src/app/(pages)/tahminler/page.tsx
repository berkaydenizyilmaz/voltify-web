import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getLatestPredictions } from '@/features/prediction/services'

async function getPredictions() {
  try {
    return await getLatestPredictions(168)
  } catch (e) {
    console.error('Predictions error:', e)
    return []
  }
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat('tr-TR', {
    maximumFractionDigits: 0,
  }).format(num)
}

function groupByDay(predictions: Awaited<ReturnType<typeof getPredictions>>) {
  const groups: Record<string, typeof predictions> = {}

  for (const p of predictions) {
    const date = new Date(p.datetime)
    const key = date.toLocaleDateString('tr-TR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    })
    if (!groups[key]) groups[key] = []
    groups[key].push(p)
  }

  return groups
}

export default async function TahminlerPage() {
  const predictions = await getPredictions()
  const grouped = groupByDay(predictions)

  const minPrediction = predictions.length > 0
    ? Math.min(...predictions.map((p) => p.predicted))
    : 0
  const maxPrediction = predictions.length > 0
    ? Math.max(...predictions.map((p) => p.predicted))
    : 0
  const avgPrediction = predictions.length > 0
    ? predictions.reduce((sum, p) => sum + p.predicted, 0) / predictions.length
    : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Tahminler</h1>
        <p className="text-muted-foreground">
          Önümüzdeki 7 gün için saatlik elektrik tüketim tahminleri
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-4 text-center">
          <p className="text-sm text-muted-foreground">Minimum</p>
          <p className="text-2xl font-bold">{formatNumber(minPrediction)} MWh</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-sm text-muted-foreground">Ortalama</p>
          <p className="text-2xl font-bold">{formatNumber(avgPrediction)} MWh</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-sm text-muted-foreground">Maksimum</p>
          <p className="text-2xl font-bold">{formatNumber(maxPrediction)} MWh</p>
        </Card>
      </div>

      {predictions.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Henüz tahmin verisi yok.</p>
        </Card>
      ) : (
        Object.entries(grouped).map(([day, dayPredictions]) => (
          <Card key={day} className="p-4">
            <h2 className="mb-4 text-lg font-semibold capitalize">{day}</h2>
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
                  {dayPredictions.map((p) => (
                    <tr key={p.datetime} className="border-b last:border-0">
                      <td className="py-2">
                        {new Date(p.datetime).toLocaleTimeString('tr-TR', {
                          hour: '2-digit',
                          minute: '2-digit',
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
          </Card>
        ))
      )}
    </div>
  )
}

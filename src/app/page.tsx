import { Card } from '@/components/ui/card'

export default function DashboardPage() {
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
          <p className="text-sm text-muted-foreground">Anlık Tahmin</p>
          <p className="text-xl font-bold">- MWh</p>
        </Card>

        <Card className="p-4">
          <p className="text-sm text-muted-foreground">24 Saat Ort.</p>
          <p className="text-xl font-bold">- MWh</p>
        </Card>

        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Son Sync</p>
          <p className="text-sm font-medium">-</p>
        </Card>

        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Aktif Model</p>
          <p className="text-sm font-medium">CatBoost</p>
        </Card>
      </div>

      <Card className="p-4">
        <h2 className="mb-4 text-lg font-semibold">Önümüzdeki 24 Saat</h2>
        <p className="text-muted-foreground">Henüz tahmin verisi yok.</p>
      </Card>
    </div>
  )
}

import { Card } from '@/components/ui/card'

export default function KarsilastirmaPage() {
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
          <p className="text-2xl font-bold">0</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-sm text-muted-foreground">MAE</p>
          <p className="text-2xl font-bold">- MWh</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-sm text-muted-foreground">RMSE</p>
          <p className="text-2xl font-bold">- MWh</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-sm text-muted-foreground">MAPE</p>
          <p className="text-2xl font-bold">- %</p>
        </Card>
      </div>

      <Card className="p-8 text-center">
        <p className="text-muted-foreground">
          Karşılaştırma için hem tahmin hem de gerçek tüketim verisi gerekli.
          PostgreSQL bağlantısı ve EPİAŞ sync çalıştırılmalı.
        </p>
      </Card>
    </div>
  )
}

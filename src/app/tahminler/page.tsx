import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function TahminlerPage() {
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
          <p className="text-2xl font-bold">- MWh</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-sm text-muted-foreground">Ortalama</p>
          <p className="text-2xl font-bold">- MWh</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-sm text-muted-foreground">Maksimum</p>
          <p className="text-2xl font-bold">- MWh</p>
        </Card>
      </div>

      <Card className="p-8 text-center">
        <p className="text-muted-foreground">
          Tahmin verisi yüklemek için PostgreSQL bağlantısı ve cron job çalıştırılmalı.
        </p>
      </Card>
    </div>
  )
}

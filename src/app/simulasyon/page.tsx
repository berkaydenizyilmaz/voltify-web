import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const MODELS = [
  { value: 'catboost', label: 'CatBoost' },
  { value: 'lightgbm', label: 'LightGBM' },
  { value: 'xgboost', label: 'XGBoost' },
]

export default function SimulasyonPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Simülasyon</h1>
        <p className="text-muted-foreground">
          Manuel parametrelerle tahmin hesapla
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold">Parametreler</h2>
          <form className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="datetime">Tarih/Saat</Label>
                <Input
                  id="datetime"
                  name="datetime"
                  type="datetime-local"
                  defaultValue={new Date().toISOString().slice(0, 16)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <select
                  id="model"
                  name="model"
                  className="flex h-9 w-full rounded-md border bg-background px-3 py-1 text-sm"
                  defaultValue="catboost"
                >
                  {MODELS.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-medium">Hava Durumu</h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-1">
                  <Label htmlFor="temperature" className="text-xs">Sıcaklık (°C)</Label>
                  <Input id="temperature" name="temperature" type="number" step="0.1" defaultValue="20" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="apparent_temp" className="text-xs">Hissedilen (°C)</Label>
                  <Input id="apparent_temp" name="apparent_temp" type="number" step="0.1" defaultValue="20" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="humidity" className="text-xs">Nem (%)</Label>
                  <Input id="humidity" name="humidity" type="number" min="0" max="100" defaultValue="50" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="precipitation" className="text-xs">Yağış (mm)</Label>
                  <Input id="precipitation" name="precipitation" type="number" step="0.1" min="0" defaultValue="0" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="wind_speed" className="text-xs">Rüzgar (km/h)</Label>
                  <Input id="wind_speed" name="wind_speed" type="number" step="0.1" min="0" defaultValue="10" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="radiation" className="text-xs">Işınım (W/m²)</Label>
                  <Input id="radiation" name="radiation" type="number" min="0" defaultValue="200" />
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-medium">Geçmiş Tüketim (MWh)</h3>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="space-y-1">
                  <Label htmlFor="lag_1h" className="text-xs">1 Saat Önce</Label>
                  <Input id="lag_1h" name="lag_1h" type="number" defaultValue="35000" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="lag_24h" className="text-xs">24 Saat Önce</Label>
                  <Input id="lag_24h" name="lag_24h" type="number" defaultValue="35000" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="lag_168h" className="text-xs">1 Hafta Önce</Label>
                  <Input id="lag_168h" name="lag_168h" type="number" defaultValue="35000" />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled>
              Tahmin Et (API bağlantısı gerekli)
            </Button>
          </form>
        </Card>

        <Card className="flex flex-col items-center justify-center p-6">
          <h2 className="mb-4 text-lg font-semibold">Sonuç</h2>
          <p className="text-muted-foreground">
            FastAPI bağlantısı kurulunca çalışacak
          </p>
        </Card>
      </div>
    </div>
  )
}

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const MODELS = [
  {
    name: 'CatBoost',
    id: 'catboost',
    description: 'Gradient boosting algoritması, kategorik değişkenleri native olarak destekler',
    r2: 0.9972,
    mae: 456,
    rmse: 623,
    features: 20,
    isDefault: true,
  },
  {
    name: 'LightGBM',
    id: 'lightgbm',
    description: 'Microsoft tarafından geliştirilen hızlı gradient boosting framework',
    r2: 0.9968,
    mae: 489,
    rmse: 658,
    features: 20,
    isDefault: false,
  },
  {
    name: 'XGBoost',
    id: 'xgboost',
    description: 'Extreme Gradient Boosting, yaygın kullanılan ensemble yöntemi',
    r2: 0.9965,
    mae: 512,
    rmse: 687,
    features: 20,
    isDefault: false,
  },
]

const FEATURES = [
  { name: 'temperature_2m', description: 'Sıcaklık (2m)', category: 'Hava' },
  { name: 'apparent_temperature', description: 'Hissedilen sıcaklık', category: 'Hava' },
  { name: 'relative_humidity_2m', description: 'Bağıl nem', category: 'Hava' },
  { name: 'precipitation', description: 'Yağış miktarı', category: 'Hava' },
  { name: 'wind_speed_10m', description: 'Rüzgar hızı', category: 'Hava' },
  { name: 'shortwave_radiation', description: 'Kısa dalga ışınımı', category: 'Hava' },
  { name: 'weather_code', description: 'Hava durumu kodu', category: 'Hava' },
  { name: 'hour_sin/cos', description: 'Saat (cyclical)', category: 'Zaman' },
  { name: 'day_of_week_sin/cos', description: 'Haftanın günü (cyclical)', category: 'Zaman' },
  { name: 'is_weekend', description: 'Hafta sonu mu?', category: 'Zaman' },
  { name: 'is_holiday', description: 'Tatil günü mü?', category: 'Zaman' },
  { name: 'HDD', description: 'Isıtma derece günü', category: 'Türetilmiş' },
  { name: 'CDD', description: 'Soğutma derece günü', category: 'Türetilmiş' },
  { name: 'lag_1h', description: '1 saat önceki tüketim', category: 'Lag' },
  { name: 'lag_24h', description: '24 saat önceki tüketim', category: 'Lag' },
  { name: 'lag_168h', description: '1 hafta önceki tüketim', category: 'Lag' },
]

export default function ModellerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Modeller</h1>
        <p className="text-muted-foreground">
          Elektrik tüketim tahmin modelleri ve performansları
        </p>
      </div>

      {/* Models */}
      <div className="grid gap-4 md:grid-cols-3">
        {MODELS.map((model) => (
          <Card key={model.id} className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold">{model.name}</h3>
              {model.isDefault && <Badge>Varsayılan</Badge>}
            </div>
            <p className="mb-4 text-sm text-muted-foreground">
              {model.description}
            </p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">R²: </span>
                <span className="font-mono font-medium">{model.r2}</span>
              </div>
              <div>
                <span className="text-muted-foreground">MAE: </span>
                <span className="font-mono font-medium">{model.mae}</span>
              </div>
              <div>
                <span className="text-muted-foreground">RMSE: </span>
                <span className="font-mono font-medium">{model.rmse}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Features: </span>
                <span className="font-mono font-medium">{model.features}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Features */}
      <Card className="p-4">
        <h2 className="mb-4 text-lg font-semibold">Girdi Özellikleri (20)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-2 font-medium">Özellik</th>
                <th className="pb-2 font-medium">Açıklama</th>
                <th className="pb-2 font-medium">Kategori</th>
              </tr>
            </thead>
            <tbody>
              {FEATURES.map((f) => (
                <tr key={f.name} className="border-b last:border-0">
                  <td className="py-2 font-mono text-xs">{f.name}</td>
                  <td className="py-2">{f.description}</td>
                  <td className="py-2">
                    <Badge variant="outline">{f.category}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Output */}
      <Card className="p-4">
        <h2 className="mb-4 text-lg font-semibold">Çıktı</h2>
        <div className="flex items-center gap-4">
          <div className="font-mono text-sm">uecm</div>
          <div className="text-muted-foreground">
            Türkiye geneli saatlik elektrik tüketimi (MWh)
          </div>
        </div>
      </Card>
    </div>
  )
}

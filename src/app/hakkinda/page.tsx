import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function HakkindaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Hakkında</h1>
        <p className="text-muted-foreground">
          Voltify projesi hakkında bilgiler
        </p>
      </div>

      {/* Overview */}
      <Card className="p-6">
        <h2 className="mb-4 text-lg font-semibold">Proje Özeti</h2>
        <p className="text-muted-foreground">
          Voltify, Türkiye geneli saatlik elektrik tüketimini tahmin eden bir
          makine öğrenmesi uygulamasıdır. Hava durumu verileri ve geçmiş tüketim
          değerlerini kullanarak önümüzdeki 7 gün için saatlik tahminler üretir.
        </p>
      </Card>

      {/* Architecture */}
      <Card className="p-6">
        <h2 className="mb-4 text-lg font-semibold">Mimari</h2>
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <Badge variant="outline" className="mt-0.5 shrink-0">
              Frontend
            </Badge>
            <div>
              <p className="font-medium">Next.js 16</p>
              <p className="text-sm text-muted-foreground">
                React Server Components, Server Actions, App Router
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Badge variant="outline" className="mt-0.5 shrink-0">
              Backend
            </Badge>
            <div>
              <p className="font-medium">FastAPI</p>
              <p className="text-sm text-muted-foreground">
                ML model inference, feature engineering
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Badge variant="outline" className="mt-0.5 shrink-0">
              Database
            </Badge>
            <div>
              <p className="font-medium">PostgreSQL + Prisma</p>
              <p className="text-sm text-muted-foreground">
                Tahminler ve gerçek tüketim verileri
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Badge variant="outline" className="mt-0.5 shrink-0">
              ML
            </Badge>
            <div>
              <p className="font-medium">CatBoost, LightGBM, XGBoost</p>
              <p className="text-sm text-muted-foreground">
                3 farklı gradient boosting modeli
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Data Sources */}
      <Card className="p-6">
        <h2 className="mb-4 text-lg font-semibold">Veri Kaynakları</h2>
        <div className="space-y-4">
          <div>
            <p className="font-medium">Open-Meteo</p>
            <p className="text-sm text-muted-foreground">
              7 büyük şehir için saatlik hava durumu tahminleri (nüfus ağırlıklı
              ortalama)
            </p>
            <p className="mt-1 font-mono text-xs text-muted-foreground">
              api.open-meteo.com
            </p>
          </div>
          <div>
            <p className="font-medium">EPİAŞ Şeffaflık Platformu</p>
            <p className="text-sm text-muted-foreground">
              Türkiye geneli gerçek zamanlı elektrik tüketim verileri (UECM)
            </p>
            <p className="mt-1 font-mono text-xs text-muted-foreground">
              seffaflik.epias.com.tr
            </p>
          </div>
        </div>
      </Card>

      {/* Cities */}
      <Card className="p-6">
        <h2 className="mb-4 text-lg font-semibold">Hava Durumu Şehirleri</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Hava durumu verileri aşağıdaki şehirlerden nüfus ağırlıklı olarak
          toplanmaktadır:
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            { name: 'İstanbul', weight: '44%' },
            { name: 'Ankara', weight: '15%' },
            { name: 'İzmir', weight: '13%' },
            { name: 'Bursa', weight: '9%' },
            { name: 'Antalya', weight: '8%' },
            { name: 'Adana', weight: '6%' },
            { name: 'Konya', weight: '5%' },
          ].map((city) => (
            <Badge key={city.name} variant="secondary">
              {city.name} ({city.weight})
            </Badge>
          ))}
        </div>
      </Card>

      {/* Tech Stack */}
      <Card className="p-6">
        <h2 className="mb-4 text-lg font-semibold">Teknolojiler</h2>
        <div className="flex flex-wrap gap-2">
          {[
            'Next.js 16',
            'React 19',
            'TypeScript',
            'Tailwind CSS 4',
            'shadcn/ui',
            'Prisma',
            'FastAPI',
            'Python',
            'CatBoost',
            'LightGBM',
            'XGBoost',
            'PostgreSQL',
          ].map((tech) => (
            <Badge key={tech} variant="outline">
              {tech}
            </Badge>
          ))}
        </div>
      </Card>
    </div>
  )
}

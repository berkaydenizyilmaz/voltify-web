import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Database01Icon,
  CloudIcon,
  CpuIcon,
  Layers01Icon,
  CodeIcon,
  ServerStack01Icon,
} from "@hugeicons/core-free-icons";

export default function HakkindaPage() {
  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold">Proje Hakkında</h1>
        <p className="text-muted-foreground mt-2 text-lg max-w-3xl">
          Voltify, Türkiye Elektrik Piyasası&apos;nın dinamiklerini analiz
          ederek, yapay zeka destekli yüksek doğruluklu tüketim tahminleri sunan
          bir Ar-Ge projesidir.
        </p>
      </div>

      {/* Main Goal Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6 bg-linear-to-br from-primary/5 to-transparent border-primary/20">
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
            <HugeiconsIcon icon={CpuIcon} size={24} className="text-primary" />
            Projenin Amacı
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Enerji piyasalarında arz-talep dengesinin sağlanması, hem maliyet
            optimizasyonu hem de şebeke kararlılığı için kritiktir. Bu proje,{" "}
            <strong>EPİAŞ</strong> Şeffaflık Platformu&apos;ndan alınan Gerçek
            Zamanlı Tüketim verileri ve meteorolojik değişkenleri birleştirerek,
            Türkiye geneli elektrik talebini %99&apos;un üzerinde bir doğrulukla
            öngörmeyi amaçlamaktadır.
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
            <HugeiconsIcon
              icon={Layers01Icon}
              size={24}
              className="text-blue-500"
            />
            Kullanılan Metodoloji
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Zaman serisi analizi ve denetimli makine öğrenmesi (Supervised
            Learning) teknikleri harmanlanmıştır. Veri setimiz,{" "}
            <strong>20.000+ saatlik</strong> tarihsel veriden oluşmakta olup,
            mevsimsellik, tatil günleri ve hava durumu etkilerini modellemek
            için özellik mühendisliği (Feature Engineering) süreçlerinden
            geçirilmiştir.
          </p>
        </Card>
      </div>

      {/* Data Sources and Processing */}
      <h2 className="text-2xl font-bold mt-4">Veri Kaynakları ve İşleme</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {/* EPİAŞ */}
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-orange-500/10 rounded-lg text-orange-600">
              <HugeiconsIcon icon={Database01Icon} size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-orange-700 dark:text-orange-400">
                EPİAŞ Veri Servisi
              </h3>
              <p className="text-sm text-foreground/80 mt-1 mb-3 font-medium">
                Enerji Piyasaları İşletme A.Ş.
              </p>
              <p className="text-sm text-muted-foreground">
                Modelimiz, eğitim ve doğrulama süreçlerinde hedef değişken
                (Ground Truth) olarak EPİAŞ tarafından yayınlanan{" "}
                <strong>Gerçek Zamanlı Tüketim</strong> verilerini kullanır.
                Veriler saatlik frekansta (MWh) çekilmekte ve anlık olarak
                doğrulanmaktadır.
              </p>
              <div className="mt-4 flex gap-2">
                <Badge
                  variant="outline"
                  className="border-orange-500/20 text-orange-600 bg-orange-500/5"
                >
                  Gerçek Zamanlı Tüketim
                </Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* Open-Meteo */}
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-500/10 rounded-lg text-blue-600">
              <HugeiconsIcon icon={CloudIcon} size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-blue-700 dark:text-blue-400">
                Meteorolojik Veriler
              </h3>
              <p className="text-sm text-foreground/80 mt-1 mb-3 font-medium">
                Nüfus Ağırlıklı Hava Durumu Modeli
              </p>
              <p className="text-sm text-muted-foreground">
                Tek bir sıcaklık değeri yerine, Türkiye elektrik tüketimini en
                çok etkileyen 7 büyük ilin verileri, nüfus oranlarına göre
                ağırlıklandırılarak modele verilir.
              </p>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {[
                  { name: "İstanbul", w: "44%" },
                  { name: "Ankara", w: "15%" },
                  { name: "İzmir", w: "13%" },
                  { name: "Bursa", w: "9%" },
                  { name: "Antalya", w: "8%" },
                  { name: "Adana", w: "6%" },
                  { name: "Konya", w: "5%" },
                ].map((city) => (
                  <Badge
                    key={city.name}
                    variant="secondary"
                    className="text-[10px]"
                  >
                    {city.name} {city.w}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Technology Stack Grid */}
      <h2 className="text-2xl font-bold mt-4">Teknoloji Yığını</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 border-l-4 border-l-blue-500">
          <div className="flex items-center gap-2 mb-3">
            <HugeiconsIcon
              icon={CodeIcon}
              size={20}
              className="text-blue-500"
            />
            <span className="font-bold">Frontend & UI</span>
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
            <li>Next.js 16 (App Router)</li>
            <li>React Server Components</li>
            <li>TailwindCSS v4</li>
            <li>Shadcn/UI & Recharts</li>
          </ul>
        </Card>

        <Card className="p-4 border-l-4 border-l-green-500">
          <div className="flex items-center gap-2 mb-3">
            <HugeiconsIcon
              icon={ServerStack01Icon}
              size={20}
              className="text-green-500"
            />
            <span className="font-bold">Backend & API</span>
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
            <li>Python FastAPI</li>
            <li>Pydantic v2</li>
            <li>PostgreSQL (Veritabanı)</li>
            <li>Prisma ORM</li>
          </ul>
        </Card>

        <Card className="p-4 border-l-4 border-l-purple-500">
          <div className="flex items-center gap-2 mb-3">
            <HugeiconsIcon
              icon={CpuIcon}
              size={20}
              className="text-purple-500"
            />
            <span className="font-bold">AI & ML Core</span>
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
            <li>CatBoost / XGBoost / LightGBM</li>
            <li>Scikit-Learn (Metrics)</li>
            <li>Pandas & NumPy</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

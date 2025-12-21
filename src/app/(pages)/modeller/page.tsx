"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ChartLineData02Icon,
  CpuIcon,
  FlashIcon,
  Settings01Icon,
  AnalysisTextLinkIcon,
  ChartHistogramIcon,
} from "@hugeicons/core-free-icons";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

const MODELS_DATA = [
  {
    name: "CatBoost",
    MAE: 194.74,
    RMSE: 261.69,
    R2: 99.71,
    MAPE: 0.51,
    fill: "#8884d8",
  },
  {
    name: "LightGBM",
    MAE: 200.96,
    RMSE: 271.18,
    R2: 99.69,
    MAPE: 0.53,
    fill: "#82ca9d",
  },
  {
    name: "XGBoost",
    MAE: 213.54,
    RMSE: 284.06,
    R2: 99.66,
    MAPE: 0.56,
    fill: "#ffc658",
  },
];

// Feature Importance (CatBoost Model - Gerçek Değerler)
const FEATURE_IMPORTANCE = [
  { feature: "Lag Features", importance: 76.1 },
  { feature: "Zaman Kodlaması", importance: 14.9 },
  { feature: "Hava & Sıcaklık", importance: 5.9 },
  { feature: "Takvim", importance: 2.6 },
  { feature: "HDD/CDD", importance: 0.5 },
];

const FEATURES_LIST = [
  {
    category: "Meteorolojik Değişkenler",
    desc: "7 farklı şehirden (İstanbul, Ankara, İzmir, Bursa, Antalya, Adana, Konya) nüfus ağırlıklı ortalama ile hesaplanır.",
    items: [
      "Sıcaklık (Temperature 2m)",
      "Hissedilen Sıcaklık (Apparent)",
      "Bağıl Nem (Humidity)",
      "Yağış (Precipitation)",
      "Rüzgar Hızı (Wind Speed 10m)",
      "Güneş Radyasyonu (Shortwave)",
      "Hava Durumu Kodu (WMO Code)",
    ],
  },
  {
    category: "Zaman Kodlaması (Cyclical Encoding)",
    desc: "Zamanın döngüsel yapısını (23:00 ile 00:00'ın yakınlığı gibi) modele öğretmek için Trigonometrik Dönüşüm uygulandı.",
    items: [
      "Hour Sin/Cos (Günün saati)",
      "Day of Week Sin/Cos (Haftanın günü)",
      "Day of Year Sin/Cos (Yılın günü/Mevsimsellik)",
    ],
  },
  {
    category: "Gecikmeli Değişkenler (Lag Features)",
    desc: "Zaman serisindeki otokorelasyonu yakalamak için geçmiş değerler özellik olarak eklendi.",
    items: [
      "Lag 1h (1 saat önceki talep)",
      "Lag 24h (1 gün önceki talep)",
      "Lag 168h (1 hafta önceki talep)",
    ],
  },
  {
    category: "Türetilmiş Özellikler (Domain Features)",
    desc: "Enerji tüketim karakteristiğine özgü hesaplanan mühendislik özellikleri.",
    items: [
      "HDD (Isıtma Derece Günü): 18°C altı",
      "CDD (Soğutma Derece Günü): 18°C üstü",
      "Is Weekend (Hafta sonu etkisi)",
      "Is Holiday (Resmi tatil etkisi)",
    ],
  },
];

// Custom Tooltip Types
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number | string;
    color: string;
    dataKey?: string;
  }>;
  label?: string;
}

// Custom Tooltip for Charts
const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/95 border rounded-lg p-3 shadow-lg text-sm">
        <p className="font-bold mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function ModellerPage() {
  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Makine Öğrenmesi Modelleri</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Kullanılan algoritmalar, performans metrikleri ve özellik mühendisliği
          (Feature Engineering) detayları.
        </p>
      </div>

      {/* Training Dataset Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Toplam Veri</p>
              <p className="text-2xl font-bold mt-1">17,376 saat</p>
              <p className="text-xs text-muted-foreground mt-1">~2 yıl</p>
            </div>
            <HugeiconsIcon icon={CpuIcon} size={20} className="text-primary" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Eğitim Seti</p>
              <p className="text-2xl font-bold mt-1">16,656 saat</p>
              <p className="text-xs text-muted-foreground mt-1">~23 ay (%96)</p>
            </div>
            <HugeiconsIcon
              icon={FlashIcon}
              size={20}
              className="text-green-500"
            />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Test Seti</p>
              <p className="text-2xl font-bold mt-1">720 saat</p>
              <p className="text-xs text-muted-foreground mt-1">30 gün (%4)</p>
            </div>
            <HugeiconsIcon
              icon={AnalysisTextLinkIcon}
              size={20}
              className="text-blue-500"
            />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Özellik Sayısı</p>
              <p className="text-2xl font-bold mt-1">20</p>
              <p className="text-xs text-muted-foreground mt-1">
                Feature engineering
              </p>
            </div>
            <HugeiconsIcon
              icon={Settings01Icon}
              size={20}
              className="text-orange-500"
            />
          </div>
        </Card>
      </div>

      {/* Model Performance Comparison Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Error Metrics Chart */}
        <Card className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <HugeiconsIcon
                  icon={ChartLineData02Icon}
                  size={20}
                  className="text-primary"
                />
                Hata Metrikleri Karşılaştırması
              </h2>
              <p className="text-sm text-muted-foreground">
                Düşük değer daha iyidir (MAE & RMSE)
              </p>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={MODELS_DATA}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="name" />
                <YAxis unit=" MWh" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  dataKey="MAE"
                  name="Ortalama Mutlak Hata (MAE)"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="RMSE"
                  name="Kök Ortalama Kare Hata (RMSE)"
                  fill="#ef4444"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Feature Importance Radar Chart */}
        <Card className="p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <HugeiconsIcon
                icon={AnalysisTextLinkIcon}
                size={20}
                className="text-purple-500"
              />
              Özellik Önem Dağılımı (Feature Importance)
            </h2>
            <p className="text-sm text-muted-foreground">
              Modelin tahmin yaparken hangi verilere ağırlık verdiği
            </p>
          </div>
          <div className="h-[300px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart
                cx="50%"
                cy="50%"
                outerRadius="80%"
                data={FEATURE_IMPORTANCE}
              >
                <PolarGrid opacity={0.2} />
                <PolarAngleAxis
                  dataKey="feature"
                  tick={{ fill: "currentColor", fontSize: 12 }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 50]}
                  tick={{ fontSize: 10 }}
                />
                <Radar
                  name="Önem Düzeyi (%)"
                  dataKey="importance"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Model Details Cards */}
      <h2 className="text-2xl font-bold mt-8">
        Algoritma Performans Detayları
      </h2>
      <div className="grid gap-4 md:grid-cols-3">
        {MODELS_DATA.map((model) => (
          <Card
            key={model.name}
            className={`p-6 border-l-4 ${
              model.name === "CatBoost"
                ? "border-l-green-500 bg-green-500/5"
                : "border-l-gray-300"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-xl">{model.name}</h3>
              {model.name === "CatBoost" && <Badge>Production Model</Badge>}
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-muted-foreground">R² Score (Başarı)</span>
                <span className="font-mono font-bold text-lg text-green-600">
                  %{model.R2}
                </span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-muted-foreground">MAPE (Hata Payı)</span>
                <span className="font-mono font-bold text-lg">
                  %{model.MAPE}
                </span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-muted-foreground">MAE</span>
                <span className="font-mono">{model.MAE} MWh</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-muted-foreground">RMSE</span>
                <span className="font-mono">{model.RMSE} MWh</span>
              </div>
            </div>

            <div className="mt-4 pt-4 text-sm text-muted-foreground">
              {model.name === "CatBoost" &&
                "Kategorik değişkenleri otomatik işleyebilen, gradient boosting tabanlı, simetrik ağaç yapısını kullanan en performanslı modelimiz."}
              {model.name === "LightGBM" &&
                "Microsoft tarafından geliştirilen, yaprak odaklı büyüme (leaf-wise growth) kullanan hızlı ve verimli algoritma."}
              {model.name === "XGBoost" &&
                "Sistem optimizasyonu ve ölçeklenebilirlik üzerine kurulu, Kaggle yarışmalarının popüler algoritması."}
            </div>
          </Card>
        ))}
      </div>

      {/* Feature Engineering Grid */}
      <div>
        <h2 className="text-2xl font-bold mt-12 mb-6">
          Özellik Mühendisliği (Feature Engineering)
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {FEATURES_LIST.map((feat, idx) => (
            <Card key={idx} className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {idx === 0 && <HugeiconsIcon icon={FlashIcon} size={24} />}
                  {idx === 1 && (
                    <HugeiconsIcon icon={ChartHistogramIcon} size={24} />
                  )}
                  {idx === 2 && (
                    <HugeiconsIcon icon={AnalysisTextLinkIcon} size={24} />
                  )}
                  {idx === 3 && (
                    <HugeiconsIcon icon={Settings01Icon} size={24} />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{feat.category}</h3>
                  <p className="text-sm text-muted-foreground mt-1 mb-4">
                    {feat.desc}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {feat.items.map((item, i) => (
                      <Badge
                        key={i}
                        variant="secondary"
                        className="font-normal text-xs"
                      >
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Technical Workflow */}
      <Card className="p-8 mt-8 bg-muted/30 border-dashed">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <HugeiconsIcon icon={CpuIcon} size={24} />
          Model Pipeline Mimarisi
        </h3>
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between text-sm">
            <div className="p-4 bg-background border rounded-lg text-center w-full md:w-auto hover:shadow-md transition-all">
              <div className="font-bold text-primary">1. Veri Toplama</div>
              <div className="text-muted-foreground text-xs mt-1">
                EPİAŞ (Tüketim)
              </div>
              <div className="text-muted-foreground text-xs">
                Open-Meteo (Hava)
              </div>
            </div>
            <div className="hidden md:block h-px flex-1 bg-border relative">
              <div className="absolute right-0 -top-1.5 ">▶</div>
            </div>
            <div className="p-4 bg-background border rounded-lg text-center w-full md:w-auto hover:shadow-md transition-all">
              <div className="font-bold text-primary">2. Ön İşleme & FE</div>
              <div className="text-muted-foreground text-xs mt-1">
                Weighted Avg Weather
              </div>
              <div className="text-muted-foreground text-xs">
                Cyclical & Lag Features
              </div>
            </div>
            <div className="hidden md:block h-px flex-1 bg-border relative">
              <div className="absolute right-0 -top-1.5 ">▶</div>
            </div>
            <div className="p-4 bg-background border rounded-lg text-center w-full md:w-auto hover:shadow-md transition-all">
              <div className="font-bold text-primary">3. CatBoost Model</div>
              <div className="text-muted-foreground text-xs mt-1">
                Geriye Dönük Tesler
              </div>
              <div className="text-muted-foreground text-xs">
                Hiperparametre Optimizasyonu
              </div>
            </div>
            <div className="hidden md:block h-px flex-1 bg-border relative">
              <div className="absolute right-0 -top-1.5 ">▶</div>
            </div>
            <div className="p-4 bg-background border rounded-lg text-center w-full md:w-auto hover:shadow-md transition-all">
              <div className="font-bold text-primary">4. Tahmin Servisi</div>
              <div className="text-muted-foreground text-xs mt-1">
                FastAPI Endpoint
              </div>
              <div className="text-muted-foreground text-xs">
                PostgreSQL Storage
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground text-center max-w-2xl mx-auto">
            Sistem, her saat başı otomatik olarak çalışarak EPİAŞ ve Hava Durumu
            servislerinden güncel verileri çeker, özellik çıkarımı (feature
            engineering) pipeline&apos;ından geçirir ve eğitilmiş CatBoost
            modeli üzerinden sonraki 168 saatin (7 gün) tahminlerini üretir.
          </p>
        </div>
      </Card>
    </div>
  );
}

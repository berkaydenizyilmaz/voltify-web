"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
    MAE: 519.44,
    RMSE: 644.75,
    R2: 98.26,
    MAPE: 1.37,
    fill: "#8884d8",
  },
  {
    name: "LightGBM",
    MAE: 555.17,
    RMSE: 688.22,
    R2: 98.02,
    MAPE: 1.46,
    fill: "#82ca9d",
  },
  {
    name: "XGBoost",
    MAE: 583.26,
    RMSE: 721.12,
    R2: 97.83,
    MAPE: 1.53,
    fill: "#ffc658",
  },
];

const FEATURE_IMPORTANCE = [
  { feature: "Zaman Kodlaması", importance: 69.2 },
  { feature: "Takvim", importance: 12.8 },
  { feature: "Hava & Sıcaklık", importance: 12.4 },
  { feature: "HDD/CDD", importance: 5.6 },
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
              <p className="text-2xl font-bold mt-1">17</p>
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

      {/* Feature Importance Interpretation */}
      <Card className="p-6 bg-linear-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200 dark:border-blue-800">
        <div className="flex gap-4">
          <div className="shrink-0">
            <HugeiconsIcon
              icon={ChartHistogramIcon}
              size={24}
              className="text-blue-600 dark:text-blue-400"
            />
          </div>
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">
              📊 Feature Importance Yorumu
            </h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">
                  Zaman Kodlaması (%69.2):
                </strong>{" "}
                Elektrik talebi{" "}
                <span className="text-blue-600 dark:text-blue-400 font-medium">
                  güçlü zamansal pattern&apos;lere
                </span>{" "}
                sahiptir. Saat, gün ve mevsim bilgisi tahmin için en kritik
                faktördür.
              </p>
              <p>
                <strong className="text-foreground">
                  Takvim & Hava (%25.2):
                </strong>{" "}
                Tatil günleri, hafta sonları ve meteorolojik koşullar talebi
                önemli ölçüde etkiler. HDD/CDD gibi türetilmiş özellikler iklim
                etkisini modelliyor.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Technical Details Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Training Process */}
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <HugeiconsIcon icon={CpuIcon} size={20} className="text-primary" />
            Model Eğitim Süreci
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex gap-2">
              <span className="font-medium min-w-[140px]">Veri Ayrımı:</span>
              <span className="text-muted-foreground">
                %96 eğitim (16,656 saat), %4 test (720 saat / 30 gün)
              </span>
            </div>
            <div className="flex gap-2">
              <span className="font-medium min-w-[140px]">Algoritma:</span>
              <span className="text-muted-foreground">
                Gradient Boosting (CatBoost, LightGBM, XGBoost)
              </span>
            </div>
            <div className="flex gap-2">
              <span className="font-medium min-w-[140px]">
                Hiperparametreler:
              </span>
              <span className="text-muted-foreground">
                1000 iterasyon, learning_rate=0.1, max_depth=8
              </span>
            </div>
            <div className="flex gap-2">
              <span className="font-medium min-w-[140px]">Optimizasyon:</span>
              <span className="text-muted-foreground">
                MAE (Mean Absolute Error) minimizasyonu
              </span>
            </div>
            <div className="flex gap-2">
              <span className="font-medium min-w-[140px]">Değerlendirme:</span>
              <span className="text-muted-foreground">
                Son 30 günlük gerçek veriye karşı test edildi
              </span>
            </div>
          </div>
        </Card>

        {/* Feature Importance Methodology */}
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <HugeiconsIcon
              icon={ChartHistogramIcon}
              size={20}
              className="text-primary"
            />
            Feature Importance Hesaplama
          </h3>
          <div className="space-y-3 text-sm">
            <div>
              <p className="font-medium mb-1">
                CatBoost Gain-Based Importance:
              </p>
              <p className="text-muted-foreground">
                Her özelliğin model dallarında sağladığı{" "}
                <strong>bilgi kazancı</strong> (information gain) ölçülür.
                Yüksek gain = daha iyi ayrım.
              </p>
            </div>
            <div className="mt-3 pt-3 border-t">
              <p className="font-medium mb-1">Hesaplama Mantığı:</p>
              <p className="text-muted-foreground">
                Model, her dallanmada hatayı en çok azaltan özelliği seçer.
                Toplam hata azalması o özelliğin &quot;importance&quot;
                değeridir.
              </p>
            </div>
            <div className="mt-3 pt-3 border-t">
              <p className="font-medium mb-1">Normalizasyon:</p>
              <p className="text-muted-foreground">
                Tüm özellikler toplamı %100 olacak şekilde normalize edilir.
                Grafikte gösterilen değerler bu yüzdelik dağılımdır.
              </p>
            </div>
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

      {/* Akademik Detaylar - Accordion */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">📚 Akademik Detaylar</h2>
        <Accordion className="w-full">
          {/* Gradient Boosting */}
          <AccordionItem value="gradient-boosting">
            <AccordionTrigger className="text-lg font-semibold">
              Gradient Boosting Nedir?
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <p>
                <strong>Gradient Boosting</strong>, zayıf öğrenicileri (weak
                learners) sıralı olarak birleştirerek güçlü bir model oluşturan{" "}
                <strong>ensemble learning</strong> tekniğidir.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">📖 Temel Mantık</h4>
                  <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                    <li>
                      Her yeni model, öncekinin{" "}
                      <strong>hatalarını düzeltir</strong>
                    </li>
                    <li>
                      Gradient Descent ile kayıp fonksiyonunu minimize eder
                    </li>
                    <li>Modeller sıralı (sequential) olarak eğitilir</li>
                    <li>Son tahmin: tüm modellerin ağırlıklı toplamı</li>
                  </ul>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">⚡ Avantajları</h4>
                  <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                    <li>Tabular data için yüksek doğruluk</li>
                    <li>Kategorik + sayısal değişkenler birlikte</li>
                    <li>Eksik verilere karşı robust</li>
                    <li>Feature importance otomatik hesaplanır</li>
                  </ul>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Model Karşılaştırma */}
          <AccordionItem value="model-comparison">
            <AccordionTrigger className="text-lg font-semibold">
              CatBoost vs LightGBM vs XGBoost
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-3 font-semibold">
                        Özellik
                      </th>
                      <th className="text-left py-2 px-3 font-semibold text-blue-600">
                        CatBoost ⭐
                      </th>
                      <th className="text-left py-2 px-3 font-semibold">
                        LightGBM
                      </th>
                      <th className="text-left py-2 px-3 font-semibold">
                        XGBoost
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b">
                      <td className="py-2 px-3 font-medium text-foreground">
                        Geliştirici
                      </td>
                      <td className="py-2 px-3">Yandex (2017)</td>
                      <td className="py-2 px-3">Microsoft (2016)</td>
                      <td className="py-2 px-3">DMLC (2014)</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-3 font-medium text-foreground">
                        Kategorik Değişken
                      </td>
                      <td className="py-2 px-3">
                        <Badge className="bg-green-600">Native ✓</Badge>
                      </td>
                      <td className="py-2 px-3">Encoding gerekli</td>
                      <td className="py-2 px-3">Encoding gerekli</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-3 font-medium text-foreground">
                        Overfitting Önleme
                      </td>
                      <td className="py-2 px-3">Ordered boosting</td>
                      <td className="py-2 px-3">Leaf-wise</td>
                      <td className="py-2 px-3">Level-wise</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-3 font-medium text-foreground">
                        Eğitim Hızı
                      </td>
                      <td className="py-2 px-3">Orta</td>
                      <td className="py-2 px-3">
                        <Badge className="bg-green-600">En hızlı ⚡</Badge>
                      </td>
                      <td className="py-2 px-3">Yavaş</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-medium text-foreground">
                        Bu Projede
                      </td>
                      <td className="py-2 px-3 bg-blue-50 dark:bg-blue-950/30 rounded">
                        <strong>En düşük hata</strong>
                      </td>
                      <td className="py-2 px-3">2. sırada</td>
                      <td className="py-2 px-3">3. sırada</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Metrikler */}
          <AccordionItem value="metrics">
            <AccordionTrigger className="text-lg font-semibold">
              Değerlendirme Metrikleri
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-bold text-blue-600 mb-1">
                    MAE (Mean Absolute Error)
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Ortalama Mutlak Hata
                  </p>
                  <code className="text-xs bg-muted px-2 py-1 rounded block mb-2">
                    MAE = (1/n) × Σ|gerçek - tahmin|
                  </code>
                  <p className="text-sm">
                    <strong>Yorum:</strong> 519 MWh → ~%1.5 hata (çok iyi)
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-bold text-red-600 mb-1">
                    RMSE (Root Mean Square Error)
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Kök Ortalama Kare Hata
                  </p>
                  <code className="text-xs bg-muted px-2 py-1 rounded block mb-2">
                    RMSE = √[(1/n) × Σ(gerçek - tahmin)²]
                  </code>
                  <p className="text-sm">
                    <strong>Yorum:</strong> Büyük hataları daha çok cezalandırır
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-bold text-green-600 mb-1">
                    R² (Determination Coefficient)
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Belirleme Katsayısı
                  </p>
                  <code className="text-xs bg-muted px-2 py-1 rounded block mb-2">
                    R² = 1 - (SS_res / SS_tot)
                  </code>
                  <p className="text-sm">
                    <strong>Yorum:</strong> %98.26 → Varyansın %98&apos;i
                    açıklanıyor
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-bold text-purple-600 mb-1">MAPE</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Ortalama Mutlak Yüzde Hata
                  </p>
                  <code className="text-xs bg-muted px-2 py-1 rounded block mb-2">
                    MAPE = (100/n) × Σ(|hata| / gerçek)
                  </code>
                  <p className="text-sm">
                    <strong>Yorum:</strong> %1.37 → Mükemmel (&lt;5% çok iyi)
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Feature Importance */}
          <AccordionItem value="feature-importance">
            <AccordionTrigger className="text-lg font-semibold">
              Feature Importance Nasıl Hesaplanır?
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <p className="text-muted-foreground">
                CatBoost <strong>Gain-based Importance</strong> kullanır: her
                özelliğin model dallarında sağladığı bilgi kazancı (information
                gain) ölçülür.
              </p>
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Hesaplama Mantığı</h4>
                <ol className="text-sm space-y-2 list-decimal list-inside text-muted-foreground">
                  <li>
                    Model her dallanmada <strong>hatayı en çok azaltan</strong>{" "}
                    özelliği seçer
                  </li>
                  <li>
                    Bu özelliğin toplam hata azaltması = &quot;importance&quot;
                    değeri
                  </li>
                  <li>
                    Tüm özellikler{" "}
                    <strong>%100 olacak şekilde normalize</strong> edilir
                  </li>
                </ol>
              </div>
              <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <p className="text-sm">
                  <strong>Bu projede:</strong> Zaman kodlaması (%69.2) en yüksek
                  - elektrik tüketiminin güçlü günlük/haftalık/mevsimsel
                  patternleri olduğunu gösterir.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>
    </div>
  );
}

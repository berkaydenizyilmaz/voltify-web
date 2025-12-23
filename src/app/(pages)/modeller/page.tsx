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

// Model performans verileri
const MODELS_DATA = [
  {
    name: "CatBoost",
    MAE: 519.44,
    RMSE: 644.75,
    R2: 98.26,
    MAPE: 1.37,
    color: "#3b82f6",
    description:
      "Simetrik ağaçlar kullanır - her seviyede aynı bölme kriteri. Overfitting'e en dayanıklı, GPU'da çok hızlı.",
  },
  {
    name: "LightGBM",
    MAE: 555.17,
    RMSE: 688.22,
    R2: 98.02,
    MAPE: 1.46,
    color: "#22c55e",
    description:
      "Yaprak odaklı (leaf-wise) büyütür - en çok hata azaltan yaprağı genişletir. En hızlı eğitim süresi.",
  },
  {
    name: "XGBoost",
    MAE: 583.26,
    RMSE: 721.12,
    R2: 97.83,
    MAPE: 1.53,
    color: "#f59e0b",
    description:
      "Seviye odaklı (level-wise) büyütür - her seviyedeki tüm yaprakları genişletir. Dengeli ama yavaş.",
  },
];

// Feature importance verileri
const FEATURE_IMPORTANCE = [
  { feature: "Zaman Kodlaması", importance: 69.2 },
  { feature: "Takvim", importance: 12.8 },
  { feature: "Hava & Sıcaklık", importance: 12.4 },
  { feature: "HDD/CDD", importance: 5.6 },
];

// Tüm özellikler (17 adet, lag hariç)
const FEATURES = [
  {
    name: "turkey_temperature_2m",
    label: "Sıcaklık (2m)",
    category: "Meteorolojik",
    description: "7 şehrin nüfus ağırlıklı ortalama hava sıcaklığı (°C)",
  },
  {
    name: "turkey_apparent_temperature",
    label: "Hissedilen Sıcaklık",
    category: "Meteorolojik",
    description: "Rüzgar ve nem etkisiyle algılanan sıcaklık (°C)",
  },
  {
    name: "turkey_relative_humidity_2m",
    label: "Bağıl Nem",
    category: "Meteorolojik",
    description: "Havadaki nem oranı (%)",
  },
  {
    name: "turkey_precipitation",
    label: "Yağış",
    category: "Meteorolojik",
    description: "Saatlik yağış miktarı (mm)",
  },
  {
    name: "turkey_wind_speed_10m",
    label: "Rüzgar Hızı",
    category: "Meteorolojik",
    description: "10 metre yükseklikteki rüzgar hızı (km/h)",
  },
  {
    name: "turkey_shortwave_radiation",
    label: "Güneş Radyasyonu",
    category: "Meteorolojik",
    description: "Yüzeye ulaşan kısa dalga radyasyonu (W/m²)",
  },
  {
    name: "turkey_weather_code",
    label: "Hava Durumu Kodu",
    category: "Meteorolojik",
    description: "WMO standart hava durumu kodu (0-99)",
  },
  {
    name: "hour_sin",
    label: "Saat (Sin)",
    category: "Zaman Kodlama",
    description: "Günün saatinin sinüs dönüşümü (döngüsel kodlama)",
  },
  {
    name: "hour_cos",
    label: "Saat (Cos)",
    category: "Zaman Kodlama",
    description: "Günün saatinin kosinüs dönüşümü (döngüsel kodlama)",
  },
  {
    name: "dow_sin",
    label: "Haftanın Günü (Sin)",
    category: "Zaman Kodlama",
    description: "Haftanın gününün sinüs dönüşümü",
  },
  {
    name: "dow_cos",
    label: "Haftanın Günü (Cos)",
    category: "Zaman Kodlama",
    description: "Haftanın gününün kosinüs dönüşümü",
  },
  {
    name: "doy_sin",
    label: "Yılın Günü (Sin)",
    category: "Zaman Kodlama",
    description: "Mevsimselliği yakalamak için yılın gününün sinüs dönüşümü",
  },
  {
    name: "doy_cos",
    label: "Yılın Günü (Cos)",
    category: "Zaman Kodlama",
    description: "Mevsimselliği yakalamak için yılın gününün kosinüs dönüşümü",
  },
  {
    name: "is_weekend",
    label: "Hafta Sonu",
    category: "Takvim",
    description: "Cumartesi veya Pazar günü mü? (0/1)",
  },
  {
    name: "is_holiday",
    label: "Resmi Tatil",
    category: "Takvim",
    description: "Türkiye resmi tatil günü mü? (0/1)",
  },
  {
    name: "HDD",
    label: "Isıtma Derece Günü",
    category: "Türetilmiş",
    description: "18°C altındaki sıcaklık farkı (ısıtma ihtiyacı göstergesi)",
  },
  {
    name: "CDD",
    label: "Soğutma Derece Günü",
    category: "Türetilmiş",
    description: "18°C üzerindeki sıcaklık farkı (soğutma ihtiyacı göstergesi)",
  },
];

// Grafik tooltip
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number | string;
    color: string;
  }>;
  label?: string;
}

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
  // Kategorilere göre grupla
  const featuresByCategory = FEATURES.reduce((acc, feat) => {
    if (!acc[feat.category]) acc[feat.category] = [];
    acc[feat.category].push(feat);
    return acc;
  }, {} as Record<string, typeof FEATURES>);

  return (
    <div className="space-y-8 pb-10">
      {/* 1. Başlık */}
      <div>
        <h1 className="text-3xl font-bold">Makine Öğrenmesi Modelleri</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Bu sayfada kullanılan algoritmaların performansları, değerlendirme
          metrikleri ve özellik mühendisliği (feature engineering) detayları yer
          almaktadır.
        </p>
      </div>

      {/* 2. Veri Seti İstatistikleri */}
      <div>
        <h2 className="text-xl font-bold mb-4">📊 Veri Seti Bilgileri</h2>
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Toplam Veri</p>
                <p className="text-2xl font-bold mt-1">17,376 saat</p>
                <p className="text-xs text-muted-foreground mt-1">~2 yıl</p>
              </div>
              <HugeiconsIcon
                icon={CpuIcon}
                size={20}
                className="text-primary"
              />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Eğitim Seti</p>
                <p className="text-2xl font-bold mt-1">16,656 saat</p>
                <p className="text-xs text-muted-foreground mt-1">%96</p>
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
                <p className="text-xs text-muted-foreground mt-1">
                  30 gün (%4)
                </p>
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
                <p className="text-xs text-muted-foreground mt-1">Feature</p>
              </div>
              <HugeiconsIcon
                icon={Settings01Icon}
                size={20}
                className="text-orange-500"
              />
            </div>
          </Card>
        </div>
      </div>

      {/* 3. Gradient Boosting Nedir? */}
      <Card className="p-6 border-l-4 border-l-purple-500">
        <h2 className="text-xl font-bold mb-3">📚 Gradient Boosting Nedir?</h2>
        <p className="text-muted-foreground">
          <strong className="text-foreground">Gradient Boosting</strong>, zayıf
          öğrenicileri (karar ağaçları) sıralı olarak birleştirerek güçlü bir
          model oluşturan{" "}
          <strong className="text-foreground">ensemble learning</strong>{" "}
          tekniğidir. Her yeni ağaç, önceki modelin hatalarını düzeltmeye
          çalışır. Gradient Descent algoritması ile kayıp fonksiyonu minimize
          edilir.
        </p>
      </Card>

      {/* 4. Model Karşılaştırma */}
      <div>
        <h2 className="text-xl font-bold mb-4">
          🏆 Model Performans Karşılaştırması
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {MODELS_DATA.map((model, idx) => (
            <Card
              key={model.name}
              className={`p-6 ${
                idx === 0
                  ? "border-2 border-blue-500 bg-blue-50/30 dark:bg-blue-950/20"
                  : ""
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-xl">{model.name}</h3>
                {idx === 0 && <Badge className="bg-blue-600">En İyi</Badge>}
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">R² Score</span>
                  <span className="font-mono font-bold text-lg text-green-600">
                    %{model.R2}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">MAE</span>
                  <span className="font-mono">{model.MAE} MWh</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">RMSE</span>
                  <span className="font-mono">{model.RMSE} MWh</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">MAPE</span>
                  <span className="font-mono">%{model.MAPE}</span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mt-4 pt-4 border-t">
                {model.description}
              </p>
            </Card>
          ))}
        </div>

        {/* Grafik */}
        <Card className="p-6 mt-4">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <HugeiconsIcon
              icon={ChartLineData02Icon}
              size={20}
              className="text-primary"
            />
            Hata Metrikleri Grafiği
          </h3>
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
                  name="MAE (MWh)"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="RMSE"
                  name="RMSE (MWh)"
                  fill="#ef4444"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* 5. Metrik Açıklamaları */}
      <div>
        <h2 className="text-xl font-bold mb-4">📐 Değerlendirme Metrikleri</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="p-4 border-l-4 border-l-blue-500">
            <h4 className="font-bold text-blue-600">MAE</h4>
            <p className="text-sm text-muted-foreground">Mean Absolute Error</p>
            <code className="text-xs bg-muted px-2 py-1 rounded block my-2">
              Σ|gerçek - tahmin| / n
            </code>
            <p className="text-sm">
              Tahminlerin gerçek değerlerden ortalama sapması. Outlier&apos;lara
              duyarsız, yorumlaması kolay.
            </p>
          </Card>
          <Card className="p-4 border-l-4 border-l-red-500">
            <h4 className="font-bold text-red-600">RMSE</h4>
            <p className="text-sm text-muted-foreground">
              Root Mean Square Error
            </p>
            <code className="text-xs bg-muted px-2 py-1 rounded block my-2">
              √[Σ(hata)² / n]
            </code>
            <p className="text-sm">
              Hataların karekökü. Büyük hataları daha fazla cezalandırır, kritik
              sapmaları vurgular.
            </p>
          </Card>
          <Card className="p-4 border-l-4 border-l-green-500">
            <h4 className="font-bold text-green-600">R² Score</h4>
            <p className="text-sm text-muted-foreground">Belirleme Katsayısı</p>
            <code className="text-xs bg-muted px-2 py-1 rounded block my-2">
              1 - (SS_res / SS_tot)
            </code>
            <p className="text-sm">
              Modelin varyansı ne kadar açıkladığını gösterir. %98.26 =
              Varyansın %98&apos;i model tarafından açıklanıyor.
            </p>
          </Card>
          <Card className="p-4 border-l-4 border-l-purple-500">
            <h4 className="font-bold text-purple-600">MAPE</h4>
            <p className="text-sm text-muted-foreground">
              Mean Absolute % Error
            </p>
            <code className="text-xs bg-muted px-2 py-1 rounded block my-2">
              Σ(|hata|/gerçek) × 100
            </code>
            <p className="text-sm">
              Yüzdelik hata oranı. %1.37 = Mükemmel performans (&lt;5% çok iyi
              kabul edilir).
            </p>
          </Card>
        </div>
      </div>

      {/* 6. Feature Importance */}
      <div>
        <h2 className="text-xl font-bold mb-4">🎯 Özellik Önem Dağılımı</h2>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Radar Grafiği</h3>
            <div className="h-[300px] w-full">
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
                    domain={[0, 80]}
                    tick={{ fontSize: 10 }}
                  />
                  <Radar
                    name="Önem (%)"
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
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Yorum</h3>
            <div className="space-y-4">
              <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                <strong className="text-purple-600">
                  Zaman Kodlaması (%69.2)
                </strong>
                <p className="text-sm text-muted-foreground mt-1">
                  Elektrik tüketimi güçlü günlük, haftalık ve mevsimsel
                  döngülere sahiptir. Sin/Cos dönüşümleri bu pattern&apos;leri
                  yakalar.
                </p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                <strong className="text-blue-600">Takvim (%12.8)</strong>
                <p className="text-sm text-muted-foreground mt-1">
                  Hafta sonları ve tatil günlerinde tüketim profili değişir.
                  is_weekend ve is_holiday bunu yakalar.
                </p>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                <strong className="text-green-600">
                  Hava & Sıcaklık (%12.4)
                </strong>
                <p className="text-sm text-muted-foreground mt-1">
                  Sıcaklık, nem ve radyasyon ısıtma/soğutma talebini etkiler.
                </p>
              </div>
              <div className="p-3 bg-orange-50 dark:bg-orange-950/30 rounded-lg">
                <strong className="text-orange-600">HDD/CDD (%5.6)</strong>
                <p className="text-sm text-muted-foreground mt-1">
                  Isıtma ve soğutma derece günleri enerji ihtiyacını modelliyor.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* 7. Kullanılan Özellikler (17 adet) */}
      <div>
        <h2 className="text-xl font-bold mb-4">
          🔧 Kullanılan Özellikler (17 Adet)
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {Object.entries(featuresByCategory).map(([category, features]) => (
            <Card key={category} className="p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                {category === "Meteorolojik" && (
                  <HugeiconsIcon
                    icon={FlashIcon}
                    size={20}
                    className="text-blue-500"
                  />
                )}
                {category === "Zaman Kodlama" && (
                  <HugeiconsIcon
                    icon={ChartHistogramIcon}
                    size={20}
                    className="text-purple-500"
                  />
                )}
                {category === "Takvim" && (
                  <HugeiconsIcon
                    icon={AnalysisTextLinkIcon}
                    size={20}
                    className="text-green-500"
                  />
                )}
                {category === "Türetilmiş" && (
                  <HugeiconsIcon
                    icon={Settings01Icon}
                    size={20}
                    className="text-orange-500"
                  />
                )}
                {category}
                <Badge variant="secondary">{features.length}</Badge>
              </h3>
              <div className="space-y-3">
                {features.map((feat) => (
                  <div key={feat.name} className="border-b pb-2 last:border-0">
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-muted px-2 py-0.5 rounded">
                        {feat.name}
                      </code>
                      <span className="font-medium text-sm">{feat.label}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {feat.description}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* 8. Pipeline Mimarisi */}
      <Card className="p-8 bg-muted/30 border-dashed">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <HugeiconsIcon icon={CpuIcon} size={24} />
          Model Pipeline Mimarisi
        </h2>
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between text-sm">
          <div className="p-4 bg-background border rounded-lg text-center w-full md:w-auto">
            <div className="font-bold text-primary">1. Veri Toplama</div>
            <div className="text-muted-foreground text-xs mt-1">
              EPİAŞ (Tüketim)
            </div>
            <div className="text-muted-foreground text-xs">
              Open-Meteo (Hava)
            </div>
          </div>
          <div className="hidden md:block text-2xl">→</div>
          <div className="p-4 bg-background border rounded-lg text-center w-full md:w-auto">
            <div className="font-bold text-primary">2. Feature Engineering</div>
            <div className="text-muted-foreground text-xs mt-1">
              Nüfus Ağırlıklı Ortalama
            </div>
            <div className="text-muted-foreground text-xs">
              Cyclical Encoding
            </div>
          </div>
          <div className="hidden md:block text-2xl">→</div>
          <div className="p-4 bg-background border rounded-lg text-center w-full md:w-auto">
            <div className="font-bold text-primary">3. Model Eğitimi</div>
            <div className="text-muted-foreground text-xs mt-1">
              CatBoost Regressor
            </div>
            <div className="text-muted-foreground text-xs">
              MAE Optimizasyonu
            </div>
          </div>
          <div className="hidden md:block text-2xl">→</div>
          <div className="p-4 bg-background border rounded-lg text-center w-full md:w-auto">
            <div className="font-bold text-primary">4. Tahmin Servisi</div>
            <div className="text-muted-foreground text-xs mt-1">
              FastAPI + PostgreSQL
            </div>
            <div className="text-muted-foreground text-xs">168 Saat Tahmin</div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground text-center mt-6 max-w-3xl mx-auto">
          Sistem her saat başı otomatik çalışarak güncel hava durumu verilerini
          çeker, özellik çıkarımı yapar ve CatBoost modeli ile sonraki 7 günün
          tahminlerini üretir.
        </p>
      </Card>
    </div>
  );
}

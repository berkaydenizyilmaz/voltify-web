import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  FlashIcon,
  ChartLineData02Icon,
  CpuIcon,
  Sun01Icon,
  CloudIcon,
  ThermometerIcon,
  HumidityIcon,
  ArrowUp01Icon,
  ArrowDown01Icon,
} from "@hugeicons/core-free-icons";
import { getLatestPredictions } from "@/features/prediction/services";
import { getStats } from "@/features/consumption/services";
import { predictions } from "@/lib/data";

export const dynamic = "force-dynamic";

async function getDashboardData() {
  try {
    const [predictionsList, stats, totalPredictions] = await Promise.all([
      getLatestPredictions(24),
      getStats(),
      predictions.count(),
    ]);
    return {
      predictions: predictionsList,
      stats,
      totalPredictions,
      error: null,
    };
  } catch (e) {
    console.error("Dashboard data error:", e);
    return {
      predictions: [],
      stats: null,
      totalPredictions: 0,
      error: String(e),
    };
  }
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat("tr-TR", {
    maximumFractionDigits: 0,
  }).format(num);
}

function getWeatherIcon(weatherCode: number) {
  // Simplified weather code mapping
  if (weatherCode <= 1) return Sun01Icon; // Clear
  return CloudIcon; // Cloudy/Other
}

function getWeatherDescription(weatherCode: number): string {
  if (weatherCode === 0) return "Açık";
  if (weatherCode <= 3) return "Parçalı Bulutlu";
  if (weatherCode <= 48) return "Sisli";
  if (weatherCode <= 67) return "Yağmurlu";
  if (weatherCode <= 77) return "Karlı";
  return "Fırtınalı";
}

export default async function DashboardPage() {
  const { predictions: predictionsList } = await getDashboardData();

  const currentPrediction = predictionsList[0];
  const nextHourPrediction = predictionsList[1];

  const avgPrediction =
    predictionsList.length > 0
      ? predictionsList.reduce((sum, p) => sum + p.predicted, 0) /
        predictionsList.length
      : 0;

  const minPrediction =
    predictionsList.length > 0
      ? Math.min(...predictionsList.map((p) => p.predicted))
      : 0;

  const maxPrediction =
    predictionsList.length > 0
      ? Math.max(...predictionsList.map((p) => p.predicted))
      : 0;

  // Get weather data from first prediction (if available)
  const firstPredictionWithWeather = await (async () => {
    if (!currentPrediction) return null;
    const stored = await predictions.getOne(
      new Date(currentPrediction.datetime),
      "catboost"
    );
    return stored;
  })();

  const weather = firstPredictionWithWeather?.weatherData as {
    temperature_2m?: number;
    apparent_temperature?: number;
    relative_humidity_2m?: number;
    wind_speed_10m?: number;
    weather_code?: number;
  } | null;

  const WeatherIcon = weather
    ? getWeatherIcon(weather.weather_code ?? 0)
    : Sun01Icon;

  return (
    <div className="space-y-6">
      {/* Hero / Project Intro Section */}
      <section className="relative overflow-hidden rounded-3xl bg-primary/5 px-6 py-12 text-center md:px-12 md:py-16 lg:text-left">
        <div className="absolute -left-20 -top-20 size-60 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 size-60 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col justify-center space-y-4">
            <div className="inline-flex w-fit items-center rounded-full border bg-background/50 px-3 py-1 text-sm text-muted-foreground backdrop-blur-sm">
              <span className="mr-2 flex size-2 items-center justify-center rounded-full bg-green-500">
                <span className="size-1.5 animate-pulse rounded-full bg-white" />
              </span>
              Sistem Aktif ve Çalışıyor
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              Türkiye&apos;nin Enerji Talebini{" "}
              <span className="text-primary">Veri Odaklı</span> Yönetin
            </h1>
            <p className="max-w-xl text-lg text-muted-foreground">
              Voltify, EPİAŞ verileri ve gelişmiş tahminleme algoritmaları ile
              Türkiye&apos;nin anlık enerji tüketimini analiz eder. Gerçek
              zamanlı veri akışı ve yüksek doğruluklu öngörüler sunar.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="flex flex-col gap-2 border-none bg-background/60 p-4 shadow-sm backdrop-blur-sm transition-all hover:bg-background/80">
              <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                <HugeiconsIcon icon={CpuIcon} size={20} />
              </div>
              <div>
                <h3 className="font-semibold">Gelişmiş ML Modeli</h3>
                <p className="text-sm text-muted-foreground">
                  CatBoost algoritması ile geçmiş verilerden öğrenen dinamik
                  tahminleme.
                </p>
              </div>
            </Card>

            <Card className="flex flex-col gap-2 border-none bg-background/60 p-4 shadow-sm backdrop-blur-sm transition-all hover:bg-background/80">
              <div className="flex size-10 items-center justify-center rounded-lg bg-yellow-500/10 text-yellow-500">
                <HugeiconsIcon icon={Sun01Icon} size={20} />
              </div>
              <div>
                <h3 className="font-semibold">Hava Durumu Entegre</h3>
                <p className="text-sm text-muted-foreground">
                  Sıcaklık, nem ve rüzgar verilerini anlık işleyerek tüketim
                  etkisi analizi.
                </p>
              </div>
            </Card>

            <Card className="flex flex-col gap-2 border-none bg-background/60 p-4 shadow-sm backdrop-blur-sm transition-all hover:bg-background/80">
              <div className="flex size-10 items-center justify-center rounded-lg bg-green-500/10 text-green-500">
                <HugeiconsIcon icon={ChartLineData02Icon} size={20} />
              </div>
              <div>
                <h3 className="font-semibold">Gerçek Zamanlı Veri</h3>
                <p className="text-sm text-muted-foreground">
                  EPİAŞ üzerinden anlık tüketim verileriyle sürekli doğrulama.
                </p>
              </div>
            </Card>

            <Card className="flex flex-col gap-2 border-none bg-background/60 p-4 shadow-sm backdrop-blur-sm transition-all hover:bg-background/80">
              <div className="flex size-10 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500">
                <HugeiconsIcon icon={FlashIcon} size={20} />
              </div>
              <div>
                <h3 className="font-semibold">Yüksek Doğruluk</h3>
                <p className="text-sm text-muted-foreground">
                  Sürekli kendini güncelleyen model ile minimize edilmiş hata
                  payı.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <div className="flex items-center justify-between border-b pb-4 pt-4">
        <div>
          <h2 className="text-2xl font-bold">Canlı Analiz Paneli</h2>
          <p className="text-muted-foreground">
            Anlık sistem durumu ve tahmin verileri
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="h-8 gap-1 px-3">
            <span className="size-1.5 rounded-full bg-green-500" />
            Canlı
          </Badge>
        </div>
      </div>

      {/* Hero Section - Current/Next Hour Prediction with Weather */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Main Prediction Card */}
        <Card className="relative overflow-hidden bg-linear-to-br from-primary/10 via-primary/5 to-background p-6 transition-all hover:shadow-md">
          <div className="absolute -right-10 -top-10 size-40 rounded-full bg-primary/10 blur-3xl" />
          <div className="relative">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="bg-primary/20 text-primary"
                >
                  {currentPrediction
                    ? new Date(currentPrediction.datetime).toLocaleString(
                        "tr-TR",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                          day: "2-digit",
                          month: "long",
                        }
                      )
                    : "Şu an"}
                </Badge>
              </div>
              <Badge variant="outline" className="gap-1">
                <HugeiconsIcon icon={CpuIcon} size={14} />
                CatBoost v1
              </Badge>
            </div>

            <div className="mb-2 flex items-baseline gap-2">
              <span className="text-5xl font-bold tracking-tight">
                {currentPrediction
                  ? formatNumber(currentPrediction.predicted)
                  : "-"}
              </span>
              <span className="text-2xl text-muted-foreground">MWh</span>
            </div>

            <p className="text-sm text-muted-foreground">
              Şu anki tahmini elektrik tüketimi
            </p>

            {nextHourPrediction && currentPrediction && (
              <div className="mt-6 flex items-center gap-2 rounded-lg bg-background/50 p-3 text-sm backdrop-blur-sm">
                {nextHourPrediction.predicted > currentPrediction.predicted ? (
                  <div className="flex items-center gap-2 text-red-500">
                    <div className="flex size-6 items-center justify-center rounded-full bg-red-500/10">
                      <HugeiconsIcon icon={ArrowUp01Icon} size={14} />
                    </div>
                    <span className="font-medium">
                      Yükseliş Bekleniyor (+
                      {formatNumber(
                        nextHourPrediction.predicted -
                          currentPrediction.predicted
                      )}{" "}
                      MWh)
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-green-500">
                    <div className="flex size-6 items-center justify-center rounded-full bg-green-500/10">
                      <HugeiconsIcon icon={ArrowDown01Icon} size={14} />
                    </div>
                    <span className="font-medium">
                      Düşüş Bekleniyor (-
                      {formatNumber(
                        currentPrediction.predicted -
                          nextHourPrediction.predicted
                      )}{" "}
                      MWh)
                    </span>
                  </div>
                )}
                <span className="ml-auto text-muted-foreground">
                  1 saat sonra
                </span>
              </div>
            )}
          </div>
        </Card>

        {/* Weather Card */}
        <Card className="relative overflow-hidden bg-linear-to-br from-blue-500/10 via-blue-500/5 to-background p-6 transition-all hover:shadow-md">
          <div className="absolute -right-10 -top-10 size-40 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="relative h-full flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2">
                <HugeiconsIcon
                  icon={Sun01Icon}
                  size={18}
                  className="text-orange-500"
                />
                Hava Durumu Etkisi
              </h3>
              <Badge
                variant="secondary"
                className="bg-background/80 backdrop-blur-sm"
              >
                Türkiye Ortalaması
              </Badge>
            </div>

            {weather ? (
              <div className="mt-6 grid grid-cols-2 gap-6">
                <div className="flex items-center gap-4">
                  <div className="flex size-16 items-center justify-center rounded-2xl bg-yellow-500/10 shadow-sm">
                    <HugeiconsIcon
                      icon={WeatherIcon}
                      size={32}
                      className="text-yellow-500"
                    />
                  </div>
                  <div>
                    <p className="text-4xl font-bold tracking-tight">
                      {Math.round(weather.temperature_2m ?? 0)}°
                    </p>
                    <p className="font-medium text-muted-foreground">
                      {getWeatherDescription(weather.weather_code ?? 0)}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-md bg-background/50 p-2 text-sm backdrop-blur-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <HugeiconsIcon icon={ThermometerIcon} size={16} />
                      <span>Hissedilen</span>
                    </div>
                    <span className="font-semibold">
                      {Math.round(weather.apparent_temperature ?? 0)}°
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-md bg-background/50 p-2 text-sm backdrop-blur-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <HugeiconsIcon icon={HumidityIcon} size={16} />
                      <span>Nem</span>
                    </div>
                    <span className="font-semibold">
                      {Math.round(weather.relative_humidity_2m ?? 0)}%
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-32 items-center justify-center">
                <p className="text-muted-foreground">
                  Hava durumu verisi yükleniyor...
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="flex flex-col justify-between p-4 transition-all hover:shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                24 Saat Ort.
              </p>
              <p className="mt-2 text-2xl font-bold text-blue-600">
                {avgPrediction ? formatNumber(avgPrediction) : "-"}
              </p>
            </div>
            <div className="flex size-8 items-center justify-center rounded-full bg-blue-500/10">
              <HugeiconsIcon
                icon={ChartLineData02Icon}
                size={16}
                className="text-blue-500"
              />
            </div>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            Günlük ortalama tüketim
          </div>
        </Card>

        <Card className="flex flex-col justify-between p-4 transition-all hover:shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Günün En Düşüğü
              </p>
              <p className="mt-2 text-2xl font-bold text-green-600">
                {minPrediction ? formatNumber(minPrediction) : "-"}
              </p>
            </div>
            <div className="flex size-8 items-center justify-center rounded-full bg-green-500/10">
              <HugeiconsIcon
                icon={ArrowDown01Icon}
                size={16}
                className="text-green-500"
              />
            </div>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            Minimum anlık talep
          </div>
        </Card>

        <Card className="flex flex-col justify-between p-4 transition-all hover:shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Günün En Yükseği
              </p>
              <p className="mt-2 text-2xl font-bold text-red-600">
                {maxPrediction ? formatNumber(maxPrediction) : "-"}
              </p>
            </div>
            <div className="flex size-8 items-center justify-center rounded-full bg-red-500/10">
              <HugeiconsIcon
                icon={ArrowUp01Icon}
                size={16}
                className="text-red-500"
              />
            </div>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            Maksimum anlık talep
          </div>
        </Card>
      </div>

      {/* Upcoming Predictions Table */}
      <Card className="mt-6">
        <div className="flex items-center justify-between border-b p-4">
          <div>
            <h2 className="font-semibold">Saatlik Tahmin Detayları</h2>
            <p className="text-sm text-muted-foreground">
              Önümüzdeki 12 saat için detaylı tüketim öngörüsü
            </p>
          </div>
          <Badge variant="outline" className="hidden sm:flex">
            Son Güncelleme:{" "}
            {new Date().toLocaleTimeString("tr-TR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Badge>
        </div>

        {predictionsList.length === 0 ? (
          <div className="flex h-32 items-center justify-center rounded-b-lg bg-muted/5">
            <div className="text-center">
              <p className="text-muted-foreground">Henüz tahmin verisi yok.</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Tahminler saatlik olarak güncellenir.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40">
                <tr className="text-left">
                  <th className="px-4 py-3 font-medium text-muted-foreground">
                    Zaman Aralığı
                  </th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">
                    Tahmin (MWh)
                  </th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">
                    Değişim
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {predictionsList.slice(0, 12).map((p, index) => {
                  const prevPrediction =
                    index > 0 ? predictionsList[index - 1] : null;
                  const change = prevPrediction
                    ? p.predicted - prevPrediction.predicted
                    : 0;

                  return (
                    <tr
                      key={p.datetime}
                      className="transition-colors hover:bg-muted/50"
                    >
                      <td className="px-4 py-3 font-medium">
                        {new Date(p.datetime).toLocaleString("tr-TR", {
                          hour: "2-digit",
                          minute: "2-digit",
                          // day: "2-digit",
                          // month: "2-digit",
                        })}
                      </td>
                      <td className="px-4 py-3 font-mono text-base">
                        {formatNumber(p.predicted)}
                      </td>
                      <td className="px-4 py-3">
                        {index > 0 && (
                          <div
                            className={`flex items-center gap-1 ${
                              change >= 0 ? "text-red-500" : "text-green-500"
                            }`}
                          >
                            {change >= 0 ? (
                              <HugeiconsIcon icon={ArrowUp01Icon} size={14} />
                            ) : (
                              <HugeiconsIcon icon={ArrowDown01Icon} size={14} />
                            )}
                            <span>
                              {Math.abs(change) > 0
                                ? formatNumber(Math.abs(change))
                                : "0"}
                            </span>
                          </div>
                        )}
                        {index === 0 && (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Footer info using only standard HTML/text */}
      <div className="mt-8 text-center text-xs text-muted-foreground">
        <p>
          Voltify Enerji Tahminleme Sistemi &copy; {new Date().getFullYear()}
        </p>
        <p className="mt-1">
          Veriler EPİAŞ Şeffaflık Platformu ve Open-Meteo servislerinden
          sağlanmaktadır.
        </p>
      </div>
    </div>
  );
}

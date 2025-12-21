import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ChartLineData02Icon,
  CpuIcon,
  Sun01Icon,
  CloudIcon,
  ThermometerIcon,
  HumidityIcon,
  WindPower01Icon,
  ArrowUp01Icon,
  ArrowDown01Icon,
} from "@hugeicons/core-free-icons";
import { getLatestPredictions } from "@/features/prediction/services";
import { getStats } from "@/features/consumption/services";
import { predictions } from "@/lib/data";

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
  const {
    predictions: predictionsList,
  } = await getDashboardData();

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
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Voltify Dashboard</h1>
        <p className="text-muted-foreground">
          Türkiye geneli elektrik tüketim tahminleri ve analiz
        </p>
      </div>

      {/* Hero Section - Current/Next Hour Prediction with Weather */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Main Prediction Card */}
        <Card className="relative overflow-hidden bg-linear-to-br from-primary/10 via-primary/5 to-background p-6">
          <div className="absolute -right-10 -top-10 size-40 rounded-full bg-primary/10 blur-3xl" />
          <div className="relative">
            <div className="mb-4 flex items-center gap-2">
              <Badge variant="secondary" className="bg-primary/20 text-primary">
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
              <Badge variant="outline">CatBoost</Badge>
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
              Tahmini elektrik tüketimi
            </p>

            {nextHourPrediction && currentPrediction && (
              <div className="mt-4 flex items-center gap-2 text-sm">
                {nextHourPrediction.predicted > currentPrediction.predicted ? (
                  <>
                    <HugeiconsIcon
                      icon={ArrowUp01Icon}
                      size={16}
                      className="text-red-500"
                    />
                    <span className="text-red-500">
                      +
                      {formatNumber(
                        nextHourPrediction.predicted -
                          currentPrediction.predicted
                      )}{" "}
                      MWh sonraki saatte
                    </span>
                  </>
                ) : (
                  <>
                    <HugeiconsIcon
                      icon={ArrowDown01Icon}
                      size={16}
                      className="text-green-500"
                    />
                    <span className="text-green-500">
                      {formatNumber(
                        nextHourPrediction.predicted -
                          currentPrediction.predicted
                      )}{" "}
                      MWh sonraki saatte
                    </span>
                  </>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* Weather Card */}
        <Card className="relative overflow-hidden bg-linear-to-br from-blue-500/10 via-blue-500/5 to-background p-6">
          <div className="absolute -right-10 -top-10 size-40 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="relative">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold">Hava Durumu</h3>
              <Badge variant="outline">Türkiye Ortalaması</Badge>
            </div>

            {weather ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-14 items-center justify-center rounded-2xl bg-yellow-500/10">
                    <HugeiconsIcon
                      icon={WeatherIcon}
                      size={28}
                      className="text-yellow-500"
                    />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">
                      {Math.round(weather.temperature_2m ?? 0)}°
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {getWeatherDescription(weather.weather_code ?? 0)}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <HugeiconsIcon
                      icon={ThermometerIcon}
                      size={16}
                      className="text-orange-500"
                    />
                    <span className="text-muted-foreground">Hissedilen:</span>
                    <span className="font-medium">
                      {Math.round(weather.apparent_temperature ?? 0)}°
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <HugeiconsIcon
                      icon={HumidityIcon}
                      size={16}
                      className="text-blue-500"
                    />
                    <span className="text-muted-foreground">Nem:</span>
                    <span className="font-medium">
                      {Math.round(weather.relative_humidity_2m ?? 0)}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <HugeiconsIcon
                      icon={WindPower01Icon}
                      size={16}
                      className="text-cyan-500"
                    />
                    <span className="text-muted-foreground">Rüzgar:</span>
                    <span className="font-medium">
                      {Math.round(weather.wind_speed_10m ?? 0)} km/s
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
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500/10">
              <HugeiconsIcon
                icon={ChartLineData02Icon}
                size={20}
                className="text-blue-500"
              />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">24 Saat Ort.</p>
              <p className="text-xl font-bold">
                {avgPrediction ? formatNumber(avgPrediction) : "-"} MWh
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-green-500/10">
              <HugeiconsIcon
                icon={ArrowDown01Icon}
                size={20}
                className="text-green-500"
              />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">24 Saat Min</p>
              <p className="text-xl font-bold">
                {minPrediction ? formatNumber(minPrediction) : "-"} MWh
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-red-500/10">
              <HugeiconsIcon
                icon={ArrowUp01Icon}
                size={20}
                className="text-red-500"
              />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">24 Saat Max</p>
              <p className="text-xl font-bold">
                {maxPrediction ? formatNumber(maxPrediction) : "-"} MWh
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-purple-500/10">
              <HugeiconsIcon
                icon={CpuIcon}
                size={20}
                className="text-purple-500"
              />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Aktif Model</p>
              <Badge variant="secondary">CatBoost</Badge>
            </div>
          </div>
        </Card>
      </div>

      {/* Upcoming Predictions Table */}
      <Card className="p-4">
        <h2 className="mb-4 text-lg font-semibold">Önümüzdeki 12 Saat</h2>
        {predictionsList.length === 0 ? (
          <div className="flex h-32 items-center justify-center rounded-lg border border-dashed">
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
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-2 font-medium">Saat</th>
                  <th className="pb-2 font-medium">Tahmin (MWh)</th>
                  <th className="pb-2 font-medium">Değişim</th>
                  <th className="pb-2 font-medium">Model</th>
                </tr>
              </thead>
              <tbody>
                {predictionsList.slice(0, 12).map((p, index) => {
                  const prevPrediction =
                    index > 0 ? predictionsList[index - 1] : null;
                  const change = prevPrediction
                    ? p.predicted - prevPrediction.predicted
                    : 0;

                  return (
                    <tr key={p.datetime} className="border-b last:border-0">
                      <td className="py-2">
                        {new Date(p.datetime).toLocaleString("tr-TR", {
                          hour: "2-digit",
                          minute: "2-digit",
                          day: "2-digit",
                          month: "2-digit",
                        })}
                      </td>
                      <td className="py-2 font-mono font-medium">
                        {formatNumber(p.predicted)}
                      </td>
                      <td className="py-2">
                        {index > 0 && (
                          <span
                            className={
                              change >= 0 ? "text-red-500" : "text-green-500"
                            }
                          >
                            {change >= 0 ? "+" : ""}
                            {formatNumber(change)}
                          </span>
                        )}
                      </td>
                      <td className="py-2">
                        <Badge variant="outline">{p.model}</Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

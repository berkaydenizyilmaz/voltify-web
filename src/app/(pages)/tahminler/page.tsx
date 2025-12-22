import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  FlashIcon,
  ArrowDown01Icon,
  ArrowUp01Icon,
  ChartLineData02Icon,
} from "@hugeicons/core-free-icons";
import { getLatestPredictions } from "@/features/prediction/services";
import { PredictionsChart } from "./predictions-chart";

export const dynamic = "force-dynamic";

async function getPredictions() {
  try {
    return await getLatestPredictions(168);
  } catch (e) {
    console.error("Predictions error:", e);
    return [];
  }
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat("tr-TR", {
    maximumFractionDigits: 0,
  }).format(num);
}

function groupByDay(predictions: Awaited<ReturnType<typeof getPredictions>>) {
  const groups: Record<string, typeof predictions> = {};

  for (const p of predictions) {
    const date = new Date(p.datetime);
    const key = date.toLocaleDateString("tr-TR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
    if (!groups[key]) groups[key] = [];
    groups[key].push(p);
  }

  return groups;
}

export default async function TahminlerPage() {
  const predictions = await getPredictions();
  const grouped = groupByDay(predictions);

  const minPrediction =
    predictions.length > 0
      ? Math.min(...predictions.map((p) => p.predicted))
      : 0;
  const maxPrediction =
    predictions.length > 0
      ? Math.max(...predictions.map((p) => p.predicted))
      : 0;
  const avgPrediction =
    predictions.length > 0
      ? predictions.reduce((sum, p) => sum + p.predicted, 0) /
        predictions.length
      : 0;

  // Chart için verileri hazırla
  const chartData = predictions.map((p) => ({
    datetime: p.datetime,
    time: new Date(p.datetime).toLocaleString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }),
    predicted: Math.round(p.predicted),
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tahminler</h1>
          <p className="text-muted-foreground">
            Önümüzdeki 7 gün için saatlik elektrik tüketim tahminleri
          </p>
        </div>
        <Badge variant="secondary" className="hidden sm:flex gap-1.5">
          <HugeiconsIcon icon={ChartLineData02Icon} size={14} />
          {predictions.length} saat
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500/10">
              <HugeiconsIcon
                icon={ArrowDown01Icon}
                size={20}
                className="text-blue-500"
              />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Minimum</p>
              <p className="text-xl font-bold">
                {formatNumber(minPrediction)}{" "}
                <span className="text-sm font-normal text-muted-foreground">
                  MWh
                </span>
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <HugeiconsIcon
                icon={FlashIcon}
                size={20}
                className="text-primary"
              />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ortalama</p>
              <p className="text-xl font-bold">
                {formatNumber(avgPrediction)}{" "}
                <span className="text-sm font-normal text-muted-foreground">
                  MWh
                </span>
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-orange-500/10">
              <HugeiconsIcon
                icon={ArrowUp01Icon}
                size={20}
                className="text-orange-500"
              />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Maksimum</p>
              <p className="text-xl font-bold">
                {formatNumber(maxPrediction)}{" "}
                <span className="text-sm font-normal text-muted-foreground">
                  MWh
                </span>
              </p>
            </div>
          </div>
        </Card>
      </div>

      {predictions.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center">
          <HugeiconsIcon
            icon={ChartLineData02Icon}
            size={48}
            className="text-muted-foreground/50 mb-4"
          />
          <h3 className="text-lg font-medium">Henüz tahmin verisi yok</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Tahmin üretmek için /api/cron/sync-predictions endpoint&apos;ini
            çağırın
          </p>
        </Card>
      ) : (
        <>
          {/* Chart */}
          <Card className="p-4">
            <h2 className="mb-4 text-lg font-semibold">
              7 Günlük Tahmin Grafiği
            </h2>
            <PredictionsChart data={chartData} />
          </Card>

          {/* Daily Tables */}
          <div className="grid gap-4 lg:grid-cols-2">
            {Object.entries(grouped)
              .slice(0, 4)
              .map(([day, dayPredictions]) => (
                <Card key={day} className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-base font-semibold capitalize">
                      {day}
                    </h2>
                    <Badge variant="outline" className="text-xs">
                      {dayPredictions.length} saat
                    </Badge>
                  </div>
                  <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="sticky top-0 bg-background">
                        <tr className="border-b text-left">
                          <th className="pb-2 font-medium">Saat</th>
                          <th className="pb-2 font-medium text-right">
                            Tahmin
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {dayPredictions.map((p) => {
                          const isPeak = p.predicted >= avgPrediction * 1.1;
                          const isLow = p.predicted <= avgPrediction * 0.9;
                          return (
                            <tr
                              key={p.datetime}
                              className="border-b last:border-0 hover:bg-muted/50"
                            >
                              <td className="py-1.5">
                                {new Date(p.datetime).toLocaleTimeString(
                                  "tr-TR",
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </td>
                              <td className="py-1.5 text-right">
                                <span
                                  className={`font-mono ${
                                    isPeak
                                      ? "text-orange-500"
                                      : isLow
                                      ? "text-blue-500"
                                      : ""
                                  }`}
                                >
                                  {formatNumber(p.predicted)}
                                </span>
                                <span className="text-muted-foreground text-xs ml-1">
                                  MWh
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </Card>
              ))}
          </div>

          {/* Remaining Days Accordion */}
          {Object.entries(grouped).length > 4 && (
            <Card className="p-4">
              <h2 className="mb-4 text-lg font-semibold">Diğer Günler</h2>
              <div className="space-y-4">
                {Object.entries(grouped)
                  .slice(4)
                  .map(([day, dayPredictions]) => (
                    <details key={day} className="group">
                      <summary className="flex cursor-pointer items-center justify-between rounded-lg p-2 hover:bg-muted/50">
                        <span className="font-medium capitalize">{day}</span>
                        <Badge variant="outline">
                          {dayPredictions.length} saat
                        </Badge>
                      </summary>
                      <div className="mt-2 overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b text-left">
                              <th className="pb-2 font-medium">Saat</th>
                              <th className="pb-2 font-medium text-right">
                                Tahmin
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {dayPredictions.map((p) => (
                              <tr
                                key={p.datetime}
                                className="border-b last:border-0"
                              >
                                <td className="py-1.5">
                                  {new Date(p.datetime).toLocaleTimeString(
                                    "tr-TR",
                                    {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }
                                  )}
                                </td>
                                <td className="py-1.5 font-mono text-right">
                                  {formatNumber(p.predicted)}{" "}
                                  <span className="text-muted-foreground text-xs">
                                    MWh
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </details>
                  ))}
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Analytics01Icon,
  CheckmarkCircle02Icon,
  AlertCircleIcon,
  Target01Icon,
  PercentIcon,
  ChartLineData02Icon,
} from "@hugeicons/core-free-icons";
import { getPredictionsByRange } from "@/features/prediction/services";
import { getConsumptionByRange } from "@/features/consumption/services";
import { ComparisonChart } from "./comparison-chart";

async function getComparisonData() {
  try {
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [predictions, actuals] = await Promise.all([
      getPredictionsByRange(startDate, endDate),
      getConsumptionByRange(startDate, endDate),
    ]);

    return { predictions, actuals };
  } catch (e) {
    console.error("Comparison error:", e);
    return { predictions: [], actuals: [] };
  }
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat("tr-TR", {
    maximumFractionDigits: 0,
  }).format(num);
}

function calculateMetrics(
  predictions: { datetime: string; predicted: number }[],
  actuals: { datetime: Date; value: number }[]
) {
  if (predictions.length === 0 || actuals.length === 0) {
    return {
      mae: 0,
      rmse: 0,
      mape: 0,
      count: 0,
      accuracy: 0,
      goodCount: 0,
      okCount: 0,
      badCount: 0,
    };
  }

  const actualMap = new Map(
    actuals.map((a) => [a.datetime.toISOString(), a.value])
  );

  let sumError = 0;
  let sumSquaredError = 0;
  let sumPercentError = 0;
  let count = 0;
  let goodCount = 0;
  let okCount = 0;
  let badCount = 0;

  for (const p of predictions) {
    const actual = actualMap.get(p.datetime);
    if (actual !== undefined) {
      const error = Math.abs(p.predicted - actual);
      const percentError = (error / actual) * 100;
      sumError += error;
      sumSquaredError += error * error;
      sumPercentError += percentError;
      count++;

      if (percentError < 5) goodCount++;
      else if (percentError < 10) okCount++;
      else badCount++;
    }
  }

  if (count === 0)
    return {
      mae: 0,
      rmse: 0,
      mape: 0,
      count: 0,
      accuracy: 0,
      goodCount: 0,
      okCount: 0,
      badCount: 0,
    };

  const mape = sumPercentError / count;
  return {
    mae: sumError / count,
    rmse: Math.sqrt(sumSquaredError / count),
    mape,
    count,
    accuracy: 100 - mape,
    goodCount,
    okCount,
    badCount,
  };
}

export default async function KarsilastirmaPage() {
  const { predictions, actuals } = await getComparisonData();
  const metrics = calculateMetrics(predictions, actuals);

  const actualMap = new Map(
    actuals.map((a) => [a.datetime.toISOString(), a.value])
  );

  const comparisonData = predictions
    .map((p) => ({
      datetime: p.datetime,
      predicted: p.predicted,
      actual: actualMap.get(p.datetime),
      error: actualMap.has(p.datetime)
        ? Math.abs(p.predicted - actualMap.get(p.datetime)!)
        : null,
    }))
    .filter((d) => d.actual !== undefined);

  // Chart için veri hazırla
  const chartData = comparisonData.map((d) => ({
    datetime: d.datetime,
    time: new Date(d.datetime).toLocaleString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }),
    predicted: Math.round(d.predicted),
    actual: Math.round(d.actual!),
  }));

  const hasData = comparisonData.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Karşılaştırma</h1>
          <p className="text-muted-foreground">
            Tahminler vs gerçek tüketim (son 7 gün)
          </p>
        </div>
        {hasData && (
          <Badge
            variant={
              metrics.accuracy >= 95
                ? "default"
                : metrics.accuracy >= 90
                ? "secondary"
                : "destructive"
            }
            className="hidden sm:flex gap-1.5 text-sm"
          >
            <HugeiconsIcon icon={Target01Icon} size={14} />%
            {metrics.accuracy.toFixed(1)} Doğruluk
          </Badge>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <HugeiconsIcon
                icon={Analytics01Icon}
                size={20}
                className="text-primary"
              />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Veri Sayısı</p>
              <p className="text-xl font-bold">
                {metrics.count}{" "}
                <span className="text-sm font-normal text-muted-foreground">
                  saat
                </span>
              </p>
            </div>
          </div>
        </Card>
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
              <p className="text-sm text-muted-foreground">MAE</p>
              <p className="text-xl font-bold">
                {formatNumber(metrics.mae)}{" "}
                <span className="text-sm font-normal text-muted-foreground">
                  MWh
                </span>
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-purple-500/10">
              <HugeiconsIcon
                icon={Target01Icon}
                size={20}
                className="text-purple-500"
              />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">RMSE</p>
              <p className="text-xl font-bold">
                {formatNumber(metrics.rmse)}{" "}
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
                icon={PercentIcon}
                size={20}
                className="text-orange-500"
              />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">MAPE</p>
              <p className="text-xl font-bold">
                {metrics.mape.toFixed(2)}
                <span className="text-sm font-normal text-muted-foreground">
                  %
                </span>
              </p>
            </div>
          </div>
        </Card>
      </div>

      {!hasData ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center">
          <HugeiconsIcon
            icon={Analytics01Icon}
            size={48}
            className="text-muted-foreground/50 mb-4"
          />
          <h3 className="text-lg font-medium">
            Karşılaştırılacak veri bulunamadı
          </h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-md">
            EPİAŞ&apos;tan gerçek tüketim verilerini çekmek için
            /api/cron/sync-consumption endpoint&apos;ini çağırın
          </p>
        </Card>
      ) : (
        <>
          {/* Performance Summary */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HugeiconsIcon
                    icon={CheckmarkCircle02Icon}
                    size={18}
                    className="text-green-500"
                  />
                  <span className="text-sm font-medium">İyi (&lt;5%)</span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold text-green-500">
                    {metrics.goodCount}
                  </span>
                  <span className="text-sm text-muted-foreground ml-1">
                    ({((metrics.goodCount / metrics.count) * 100).toFixed(0)}%)
                  </span>
                </div>
              </div>
              <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{
                    width: `${(metrics.goodCount / metrics.count) * 100}%`,
                  }}
                />
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HugeiconsIcon
                    icon={AlertCircleIcon}
                    size={18}
                    className="text-yellow-500"
                  />
                  <span className="text-sm font-medium">Orta (5-10%)</span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold text-yellow-500">
                    {metrics.okCount}
                  </span>
                  <span className="text-sm text-muted-foreground ml-1">
                    ({((metrics.okCount / metrics.count) * 100).toFixed(0)}%)
                  </span>
                </div>
              </div>
              <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-yellow-500 rounded-full"
                  style={{
                    width: `${(metrics.okCount / metrics.count) * 100}%`,
                  }}
                />
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HugeiconsIcon
                    icon={AlertCircleIcon}
                    size={18}
                    className="text-red-500"
                  />
                  <span className="text-sm font-medium">Kötü (&gt;10%)</span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold text-red-500">
                    {metrics.badCount}
                  </span>
                  <span className="text-sm text-muted-foreground ml-1">
                    ({((metrics.badCount / metrics.count) * 100).toFixed(0)}%)
                  </span>
                </div>
              </div>
              <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-red-500 rounded-full"
                  style={{
                    width: `${(metrics.badCount / metrics.count) * 100}%`,
                  }}
                />
              </div>
            </Card>
          </div>

          {/* Comparison Chart */}
          <Card className="p-4">
            <h2 className="mb-4 text-lg font-semibold">
              Tahmin vs Gerçek Karşılaştırma
            </h2>
            <ComparisonChart data={chartData} />
          </Card>

          {/* Detailed Table */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Detaylı Karşılaştırma</h2>
              <Badge variant="outline">{comparisonData.length} kayıt</Badge>
            </div>
            <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-background">
                  <tr className="border-b text-left">
                    <th className="pb-2 font-medium">Tarih/Saat</th>
                    <th className="pb-2 font-medium text-right">Tahmin</th>
                    <th className="pb-2 font-medium text-right">Gerçek</th>
                    <th className="pb-2 font-medium text-right">Hata</th>
                    <th className="pb-2 font-medium text-center">Durum</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.slice(0, 100).map((d) => {
                    const errorPercent = d.actual
                      ? (d.error! / d.actual) * 100
                      : 0;
                    const isGood = errorPercent < 5;
                    const isOk = errorPercent < 10;

                    return (
                      <tr
                        key={d.datetime}
                        className="border-b last:border-0 hover:bg-muted/50"
                      >
                        <td className="py-2">
                          {new Date(d.datetime).toLocaleString("tr-TR", {
                            day: "2-digit",
                            month: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td className="py-2 font-mono text-right">
                          {formatNumber(d.predicted)}
                        </td>
                        <td className="py-2 font-mono text-right">
                          {formatNumber(d.actual!)}
                        </td>
                        <td className="py-2 font-mono text-right">
                          <span
                            className={
                              isGood
                                ? "text-green-500"
                                : isOk
                                ? "text-yellow-500"
                                : "text-red-500"
                            }
                          >
                            {formatNumber(d.error!)}
                          </span>
                          <span className="text-muted-foreground text-xs ml-1">
                            ({errorPercent.toFixed(1)}%)
                          </span>
                        </td>
                        <td className="py-2 text-center">
                          <Badge
                            variant={
                              isGood
                                ? "default"
                                : isOk
                                ? "secondary"
                                : "destructive"
                            }
                            className="text-xs"
                          >
                            {isGood ? "İyi" : isOk ? "Orta" : "Kötü"}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}

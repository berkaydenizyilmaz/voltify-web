"use client";

import { Line, LineChart, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";

interface ComparisonDataPoint {
  datetime: string;
  time: string;
  predicted: number;
  actual: number;
}

interface ComparisonChartProps {
  data: ComparisonDataPoint[];
}

const chartConfig = {
  predicted: {
    label: "Tahmin",
    color: "var(--chart-1)",
  },
  actual: {
    label: "Gerçek",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

export function ComparisonChart({ data }: ComparisonChartProps) {
  // Performance için veri noktalarını azalt (çok fazla olduğunda)
  const displayData =
    data.length > 72 ? data.filter((_, i) => i % 2 === 0) : data;

  const allValues = data.flatMap((d) => [d.predicted, d.actual]);
  const minValue = Math.min(...allValues) * 0.95;
  const maxValue = Math.max(...allValues) * 1.05;

  return (
    <ChartContainer config={chartConfig} className="h-[350px] w-full">
      <LineChart
        data={displayData}
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="time"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tick={{ fontSize: 11 }}
          interval="preserveStartEnd"
          minTickGap={60}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tick={{ fontSize: 11 }}
          domain={[minValue, maxValue]}
          tickFormatter={(value) =>
            new Intl.NumberFormat("tr-TR", {
              notation: "compact",
              maximumFractionDigits: 0,
            }).format(value)
          }
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              labelFormatter={(_, payload) => {
                if (payload && payload[0]) {
                  return new Date(payload[0].payload.datetime).toLocaleString(
                    "tr-TR",
                    {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  );
                }
                return "";
              }}
              formatter={(value, name) => {
                const label = name === "predicted" ? "Tahmin" : "Gerçek";
                return (
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-muted-foreground">{label}:</span>
                    <span className="font-mono font-semibold">
                      {new Intl.NumberFormat("tr-TR").format(value as number)}{" "}
                      MWh
                    </span>
                  </div>
                );
              }}
            />
          }
        />
        <ChartLegend content={<ChartLegendContent />} />
        <Line
          type="monotone"
          dataKey="predicted"
          stroke="var(--chart-1)"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, strokeWidth: 2 }}
        />
        <Line
          type="monotone"
          dataKey="actual"
          stroke="var(--chart-3)"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, strokeWidth: 2 }}
        />
      </LineChart>
    </ChartContainer>
  );
}

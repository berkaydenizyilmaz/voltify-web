"use client";

import { Area, AreaChart, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

interface PredictionDataPoint {
  datetime: string;
  time: string;
  predicted: number;
}

interface PredictionsChartProps {
  data: PredictionDataPoint[];
}

const chartConfig = {
  predicted: {
    label: "Tahmin",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function PredictionsChart({ data }: PredictionsChartProps) {
  // Grafikte çok fazla veri noktası olduğunda performans için aralıklı göster
  const displayData =
    data.length > 72
      ? data.filter((_, i) => i % 3 === 0) // Her 3 saatte bir göster
      : data;

  const minValue = Math.min(...data.map((d) => d.predicted)) * 0.95;
  const maxValue = Math.max(...data.map((d) => d.predicted)) * 1.05;

  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <AreaChart
        data={displayData}
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="fillPredicted" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.4} />
            <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.05} />
          </linearGradient>
        </defs>
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
              formatter={(value) => (
                <span className="font-mono font-semibold">
                  {new Intl.NumberFormat("tr-TR").format(value as number)} MWh
                </span>
              )}
            />
          }
        />
        <Area
          type="monotone"
          dataKey="predicted"
          stroke="var(--chart-1)"
          strokeWidth={2}
          fill="url(#fillPredicted)"
          dot={false}
          activeDot={{ r: 4, strokeWidth: 2 }}
        />
      </AreaChart>
    </ChartContainer>
  );
}

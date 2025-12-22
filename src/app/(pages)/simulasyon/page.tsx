"use client";

import { useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { runSimulationAction } from "@/features/prediction/actions";
import { toast } from "sonner";

const MODELS = [
  { value: "catboost", label: "CatBoost" },
  { value: "lightgbm", label: "LightGBM" },
  { value: "xgboost", label: "XGBoost" },
];

function formatNumber(num: number): string {
  return new Intl.NumberFormat("tr-TR", {
    maximumFractionDigits: 0,
  }).format(num);
}

export default function SimulasyonPage() {
  const [result, setResult] = useState<number | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>("catboost");

  const { execute, isPending } = useAction(runSimulationAction, {
    onSuccess: ({ data }) => {
      if (data?.data) {
        setResult(data.data.predictedValue);
        toast.success("Tahmin başarıyla hesaplandı");
      }
    },
    onError: ({ error }) => {
      toast.error(error.serverError || "Bir hata oluştu");
    },
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const datetime = new Date(formData.get("datetime") as string);

    execute({
      datetime,
      model: selectedModel as "catboost" | "lightgbm" | "xgboost",
      weather: {
        temperature_2m: parseFloat(formData.get("temperature") as string) || 20,
        apparent_temperature:
          parseFloat(formData.get("apparent_temp") as string) || 20,
        relative_humidity_2m:
          parseFloat(formData.get("humidity") as string) || 50,
        precipitation: parseFloat(formData.get("precipitation") as string) || 0,
        wind_speed_10m: parseFloat(formData.get("wind_speed") as string) || 10,
        shortwave_radiation:
          parseFloat(formData.get("radiation") as string) || 200,
        weather_code: parseInt(formData.get("weather_code") as string) || 0,
      },
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Simülasyon</h1>
        <p className="text-muted-foreground">
          Manuel parametrelerle tahmin hesapla
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold">Parametreler</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="datetime">Tarih/Saat</Label>
                <Input
                  id="datetime"
                  name="datetime"
                  type="datetime-local"
                  defaultValue={new Date().toISOString().slice(0, 16)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Model</Label>
                <Select
                  value={selectedModel}
                  onValueChange={(value) =>
                    setSelectedModel(value || "catboost")
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MODELS.map((m) => (
                      <SelectItem key={m.value} value={m.value}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-medium">Hava Durumu</h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-1">
                  <Label htmlFor="temperature" className="text-xs">
                    Sıcaklık (°C)
                  </Label>
                  <Input
                    id="temperature"
                    name="temperature"
                    type="number"
                    step="0.1"
                    defaultValue="20"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="apparent_temp" className="text-xs">
                    Hissedilen (°C)
                  </Label>
                  <Input
                    id="apparent_temp"
                    name="apparent_temp"
                    type="number"
                    step="0.1"
                    defaultValue="20"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="humidity" className="text-xs">
                    Nem (%)
                  </Label>
                  <Input
                    id="humidity"
                    name="humidity"
                    type="number"
                    min="0"
                    max="100"
                    defaultValue="50"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="precipitation" className="text-xs">
                    Yağış (mm)
                  </Label>
                  <Input
                    id="precipitation"
                    name="precipitation"
                    type="number"
                    step="0.1"
                    min="0"
                    defaultValue="0"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="wind_speed" className="text-xs">
                    Rüzgar (km/h)
                  </Label>
                  <Input
                    id="wind_speed"
                    name="wind_speed"
                    type="number"
                    step="0.1"
                    min="0"
                    defaultValue="10"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="radiation" className="text-xs">
                    Işınım (W/m²)
                  </Label>
                  <Input
                    id="radiation"
                    name="radiation"
                    type="number"
                    min="0"
                    defaultValue="200"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="weather_code" className="text-xs">
                    Hava Kodu
                  </Label>
                  <Input
                    id="weather_code"
                    name="weather_code"
                    type="number"
                    min="0"
                    defaultValue="0"
                  />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Hesaplanıyor..." : "Tahmin Et"}
            </Button>
          </form>
        </Card>

        <Card className="flex flex-col items-center justify-center p-6">
          <h2 className="mb-4 text-lg font-semibold">Sonuç</h2>
          {result !== null ? (
            <div className="text-center">
              <p className="text-5xl font-bold text-primary">
                {formatNumber(result)}
              </p>
              <p className="mt-2 text-muted-foreground">MWh</p>
            </div>
          ) : (
            <p className="text-muted-foreground">
              Parametreleri girin ve tahmin edin
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}

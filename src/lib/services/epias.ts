// EPİAŞ Şeffaflık Platformu API client
// Docs: https://seffaflik.epias.com.tr/electricity-service/technical/tr/index.html

import { post } from "./api-client";

const EPIAS_BASE_URL = "https://seffaflik.epias.com.tr/electricity-service/v1";
const EPIAS_AUTH_URL = "https://giris.epias.com.tr/cas/v1/tickets";

// TGT cache (in-memory, refreshes on restart)
let cachedTgt: { token: string; expiresAt: number } | null = null;

interface UecmResponse {
  items: Array<{
    date: string;
    hour: number;
    consumption: number; // MWh
  }>;
}

interface UecmRequest {
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
}

// Get credentials from env
function getCredentials(): { username: string; password: string } {
  const username = process.env.EPIAS_USERNAME;
  const password = process.env.EPIAS_PASSWORD;

  if (!username || !password) {
    throw new Error("EPIAS_USERNAME and EPIAS_PASSWORD must be set in .env");
  }

  return { username, password };
}

// Get TGT token (with caching)
async function getTgt(): Promise<string> {
  // Return cached token if still valid (with 5 min buffer)
  if (cachedTgt && cachedTgt.expiresAt > Date.now() + 5 * 60 * 1000) {
    return cachedTgt.token;
  }

  const { username, password } = getCredentials();

  // EPİAŞ expects x-www-form-urlencoded, returns TGT as plain text
  const response = await fetch(EPIAS_AUTH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "text/plain",
    },
    body: new URLSearchParams({ username, password }),
  });

  if (!response.ok) {
    throw new Error(`EPİAŞ auth failed: ${response.status}`);
  }

  const token = await response.text();

  if (!token.startsWith("TGT-")) {
    throw new Error(`Invalid TGT format: ${token.slice(0, 50)}`);
  }

  // Cache for 8 hours (EPİAŞ TGT typically valid for 8h)
  cachedTgt = {
    token: token.trim(),
    expiresAt: Date.now() + 8 * 60 * 60 * 1000,
  };

  return cachedTgt.token;
}

// Make authenticated request
async function authenticatedPost<T>(url: string, body: unknown): Promise<T> {
  const tgt = await getTgt();

  return post<T>(url, body, {
    headers: {
      TGT: tgt,
    },
  });
}

// Format date for EPİAŞ API
function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

// Fetch UECM (hourly consumption) data
export async function getUecm(
  startDate: Date,
  endDate: Date
): Promise<UecmResponse> {
  const request: UecmRequest = {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
  };

  return authenticatedPost<UecmResponse>(
    `${EPIAS_BASE_URL}/consumption/data/uecm`,
    request
  );
}

// Get lag values for prediction (1h, 24h, 168h ago)
export async function getLagValues(targetDatetime: Date): Promise<{
  lag_1h: number;
  lag_24h: number;
  lag_168h: number;
}> {
  const lag1h = new Date(targetDatetime.getTime() - 1 * 60 * 60 * 1000);
  const lag24h = new Date(targetDatetime.getTime() - 24 * 60 * 60 * 1000);
  const lag168h = new Date(targetDatetime.getTime() - 168 * 60 * 60 * 1000);

  // Fetch range covering all lags
  const startDate = new Date(lag168h);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(lag1h);
  endDate.setHours(23, 59, 59, 999);

  const data = await getUecm(startDate, endDate);

  // Find matching hours
  const findValue = (target: Date): number => {
    const targetHour = target.getHours();
    const targetDay = formatDate(target);

    const item = data.items.find(
      (i) => i.date === targetDay && i.hour === targetHour
    );
    return item?.consumption ?? 0;
  };

  return {
    lag_1h: findValue(lag1h),
    lag_24h: findValue(lag24h),
    lag_168h: findValue(lag168h),
  };
}

// Clear TGT cache (for testing or forced refresh)
export function clearTgtCache(): void {
  cachedTgt = null;
}

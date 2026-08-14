import { NextResponse } from "next/server";
import { SolarData } from "@/types/solar";

type FlareApi = {
  flareID?: string;
  classType?: string;
  maxTime?: string;
};

type StormApi = {
  gstID?: string;
  gstType?: string;
  onsetTime?: string;
};

type KpIndexEntry = {
  kp_index?: string | number;
  time_tag?: string;
};

export async function GET(request: Request) {
  try {
    // Get query parameters for date range (default to last 7 days)
    const { searchParams } = new URL(request.url);
    const endDate = searchParams.get("endDate") || new Date().toISOString().split("T")[0];
    const startDate = searchParams.get("startDate") ||
      new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    // NASA DONKI API key (using DEMO_KEY for now)
    const apiKey = "DEMO_KEY";

    // Fetch data from NASA DONKI APIs in parallel
    const [flaresResponse, stormsResponse, kpResponse] = await Promise.all([
      fetch(`https://api.nasa.gov/DONKI/FLR?startDate=${startDate}&endDate=${endDate}&api_key=${apiKey}`),
      fetch(`https://api.nasa.gov/DONKI/GST?startDate=${startDate}&endDate=${endDate}&api_key=${apiKey}`),
      fetch(`https://services.swpc.noaa.gov/json/planetary_k_index_1m.json`)
    ]);

    // Parse responses
    const flaresData = await flaresResponse.json();
    const stormsData = await stormsResponse.json();
    const kpData = await kpResponse.json();

    const flares = Array.isArray(flaresData) ? (flaresData as FlareApi[]) : [];
    const storms = Array.isArray(stormsData) ? (stormsData as StormApi[]) : [];
    const kpEntries = Array.isArray(kpData) ? (kpData as KpIndexEntry[]) : [];

    // Process and format the data
    const solarData: SolarData = {
      zones: [], // Will be populated by the map component based on user location
      flares: flares.map((flare) => ({
        id: flare.flareID || Math.random().toString(36).substr(2, 9),
        class: flare.classType || "Unknown",
        peakTime: flare.maxTime || new Date().toISOString(),
        source: "NASA DONKI API"
      })),
      storms: storms.map((storm) => ({
        id: storm.gstID || Math.random().toString(36).substr(2, 9),
        class: storm.gstType || "Unknown",
        onsetTime: storm.onsetTime || new Date().toISOString(),
        source: "NASA DONKI API"
      })),
      kpIndex: processKpIndex(kpEntries),
      lastUpdated: new Date().toISOString()
    };

    return NextResponse.json(solarData);
  } catch (error) {
    console.error("Error fetching solar data:", error);
    // Return mock data on error
    return NextResponse.json(getMockSolarData());
  }
}

// Helper function to process Kp index data
function processKpIndex(kpData: KpIndexEntry[]): { kp: number; time_tag: string; severity: "green" | "yellow" | "orange" | "red" } | null {
  if (!kpData || kpData.length === 0) return null;

  // Get the most recent Kp index reading
  const latestKp = kpData[kpData.length - 1];
  const kpValue = parseFloat(String(latestKp.kp_index ?? "0"));

  // Map Kp value to severity
  let severity: "green" | "yellow" | "orange" | "red";
  if (kpValue <= 3) {
    severity = "green";
  } else if (kpValue <= 5) {
    severity = "yellow";
  } else if (kpValue <= 7) {
    severity = "orange";
  } else {
    severity = "red";
  }

  return {
    kp: kpValue,
    time_tag: latestKp.time_tag || new Date().toISOString(),
    severity
  }
}

// Helper function to generate mock solar data
function getMockSolarData(): SolarData {
  return {
    zones: [],
    flares: [
      {
        id: "mock-1",
        class: "X1.2",
        peakTime: new Date().toISOString(),
        source: "NASA DONKI API (Mock)"
      }
    ],
    storms: [
      {
        id: "mock-2",
        class: "G2",
        onsetTime: new Date().toISOString(),
        source: "NASA DONKI API (Mock)"
      }
    ],
    kpIndex: {
      kp: 5,
      time_tag: new Date().toISOString(),
      severity: "yellow"
    },
    lastUpdated: new Date().toISOString(),
    isMock: true
  };
}

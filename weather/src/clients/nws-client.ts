import { HttpClient } from './http-client.js';

// API configuration
const NWS_API_BASE = 'https://api.weather.gov';
const USER_AGENT = 'weather-app/1.0';

// API response types
export interface NWSPointsResponse {
  properties: {
    forecast?: string;
    forecastGridData?: string;
    relativeLocation?: {
      properties: {
        city: string;
        state: string;
      };
    };
  };
}

export interface NWSForecastResponse {
  properties: {
    periods: Array<{
      name: string;
      startTime: string;
      endTime: string;
      temperature: number;
      temperatureUnit: string;
      windSpeed: string;
      windDirection: string;
      icon: string;
      shortForecast: string;
      detailedForecast: string;
    }>;
    generatedAt: string;
  };
}

export interface NWSAlertResponse {
  features: Array<{
    properties: {
      id: string;
      event: string;
      areaDesc: string;
      severity: string;
      status: string;
      headline: string;
      description: string;
      instruction?: string;
      expires: string;
      sent: string;
      effective: string;
    };
  }>;
}

export class NWSClient {
  private readonly headers: Record<string, string>;

  constructor(private readonly httpClient: HttpClient) {
    this.headers = {
      'User-Agent': USER_AGENT,
      'Accept': 'application/geo+json',
    };
  }

  async getAlerts(stateCode: string): Promise<NWSAlertResponse> {
    const url = `${NWS_API_BASE}/alerts?area=${stateCode}`;
    return this.httpClient.get<NWSAlertResponse>(url, this.headers);
  }

  async getPointData(latitude: number, longitude: number): Promise<NWSPointsResponse> {
    const url = `${NWS_API_BASE}/points/${latitude.toFixed(4)},${longitude.toFixed(4)}`;
    return this.httpClient.get<NWSPointsResponse>(url, this.headers);
  }

  async getForecast(forecastUrl: string): Promise<NWSForecastResponse> {
    return this.httpClient.get<NWSForecastResponse>(forecastUrl, this.headers);
  }
}
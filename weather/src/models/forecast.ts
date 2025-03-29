export interface ForecastPeriod {
  name: string;
  temperature: number;
  temperatureUnit: string;
  windSpeed: string;
  windDirection: string;
  shortForecast: string;
  detailedForecast?: string;
  startTime?: Date;
  endTime?: Date;
  icon?: string;
}

export interface Forecast {
  periods: ForecastPeriod[];
  location: {
    latitude: number;
    longitude: number;
    name?: string;
  };
  generatedAt: Date;
}
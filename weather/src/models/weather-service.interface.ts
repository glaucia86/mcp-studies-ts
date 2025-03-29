import { Alert } from "./alert.js";
import { Forecast } from "./forecast.js";

export interface WeatherService {
  getAlerts(stateCode: string): Promise<Alert[]>;
  getForecast(latitude: number, longitude: number): Promise<Forecast>;
}
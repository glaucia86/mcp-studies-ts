import { Alert } from "../models/alert.js";
import { Forecast } from "../models/forecast.js";

export class ResponseFormatter {
  formatAlert(alert: Alert): string {
    return [
      `Event: ${alert.event}`,
      `Area: ${alert.areaDesc}`,
      `Severity: ${alert.severity}`,
      `Status: ${alert.status}`,
      `Headline: ${alert.headline}`,
      alert.instruction ? `Instructions: ${alert.instruction}` : '',
      `Expires: ${alert.expires.toLocaleString()}`,
      '---'
    ].filter(Boolean).join('\n');
  }

  formatAlerts(stateCode: string, alerts: Alert[]): string {
    if (alerts.length === 0) {
      return `No active alerts for ${stateCode}`;
    }

    const formattedAlerts = alerts.map(alert => this.formatAlert(alert));
    return `Active alerts for ${stateCode}:\n\n${formattedAlerts.join('\n')}`;
  }

  formatForecastPeriod(period: Forecast['periods'][0]): string {
    return [
      `${period.name}:`,
      `Temperature: ${period.temperature}°${period.temperatureUnit}`,
      `Wind: ${period.windSpeed} ${period.windDirection}`,
      period.shortForecast,
      '---'
    ].join('\n');
  }

  formatForecast(forecast: Forecast): string {
    const { location } = forecast;
    const locationText = location.name
      ? `${location.name} (${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)})`
      : `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`;

    const formattedPeriods = forecast.periods.map(period => this.formatForecastPeriod(period));

    return [
      `Forecast for ${locationText}:`,
      `Generated at: ${forecast.generatedAt.toLocaleString()}`,
      '',
      ...formattedPeriods
    ].join('\n');
  }
}
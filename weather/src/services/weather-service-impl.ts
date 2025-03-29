import { NWSClient } from "../clients/nws-client.js";
import { Alert } from "../models/alert.js";
import { Forecast, ForecastPeriod } from "../models/forecast.js";
import { WeatherService } from "../models/weather-service.interface.js";
import { validateStateCode } from "../utils/validators.js";

export class NWSWeatherService implements WeatherService {
  constructor(private readonly nwsClient: NWSClient) { }

  async getAlerts(stateCode: string): Promise<Alert[]> {
    try {
      // Validate state code before making API request
      const validatedStateCode = validateStateCode(stateCode);

      const alertsResponse = await this.nwsClient.getAlerts(validatedStateCode);

      // Map API response to domain model
      return alertsResponse.features.map(feature => {
        const props = feature.properties;
        return {
          id: props.id,
          event: props.event || 'Unknown',
          areaDesc: props.areaDesc || 'Unknown',
          severity: props.severity || 'Unknown',
          status: props.status || 'Unknown',
          headline: props.headline || 'No headline available',
          description: props.description,
          instruction: props.instruction,
          expires: new Date(props.expires)
        };
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get weather alerts: ${error.message}`);
      }
      throw new Error('Failed to get weather alerts: Unknown error');
    }
  }

  async getForecast(latitude: number, longitude: number): Promise<Forecast> {
    try {
      // Validate coordinates
      if (latitude < -90 || latitude > 90) {
        throw new Error('Latitude must be between -90 and 90 degrees');
      }
      if (longitude < -180 || longitude > 180) {
        throw new Error('Longitude must be between -180 and 180 degrees');
      }

      // Get grid point data first
      const pointData = await this.nwsClient.getPointData(latitude, longitude);

      if (!pointData.properties.forecast) {
        throw new Error('Forecast URL not available for the provided coordinates');
      }

      // Get forecast using the URL from point data
      const forecastData = await this.nwsClient.getForecast(pointData.properties.forecast);

      // Extract location name if available
      let locationName: string | undefined;
      if (pointData.properties.relativeLocation?.properties) {
        const location = pointData.properties.relativeLocation.properties;
        locationName = `${location.city}, ${location.state}`;
      }

      // Map API forecast periods to domain model
      const forecastPeriods: ForecastPeriod[] = forecastData.properties.periods.map(period => ({
        name: period.name,
        startTime: new Date(period.startTime),
        endTime: new Date(period.endTime),
        temperature: period.temperature,
        temperatureUnit: period.temperatureUnit,
        windSpeed: period.windSpeed,
        windDirection: period.windDirection,
        shortForecast: period.shortForecast,
        detailedForecast: period.detailedForecast,
        icon: period.icon
      }));

      return {
        periods: forecastPeriods,
        location: {
          latitude,
          longitude,
          name: locationName
        },
        generatedAt: new Date(forecastData.properties.generatedAt || new Date().toISOString())
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get weather forecast: ${error.message}`);
      }
      throw new Error('Failed to get weather forecast: Unknown error');
    }
  }
}
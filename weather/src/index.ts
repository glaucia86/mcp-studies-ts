import { FetchHttpClient } from "./clients/http-client.js";
import { NWSClient } from "./clients/nws-client.js";
import { WeatherMcpServer } from "./server.js";
import { NWSWeatherService } from "./services/weather-service-impl.js";
import { Logger, LogLevel } from "./utils/logger.js";

async function bootstrap(): Promise<void> {
  const logger = new Logger('WeatherApp', LogLevel.INFO);

  try {
    logger.info('Starting Weather MCP Server');

    // Set up dependencies
    const httpClient = new FetchHttpClient();
    const nwsClient = new NWSClient(httpClient);
    const weatherService = new NWSWeatherService(nwsClient);

    // Create and start MCP server
    const weatherMcpServer = new WeatherMcpServer(weatherService);
    await weatherMcpServer.start();

    logger.info('Weather MCP Server running successfully');
  } catch (error) {
    logger.error('Failed to start Weather MCP Server', {
      error: error instanceof Error ? error.message : String(error)
    });
    process.exit(1);
  }
}

// Start the application
bootstrap().catch(error => {
  console.error('Fatal error during bootstrap:', error);
  process.exit(1);
});
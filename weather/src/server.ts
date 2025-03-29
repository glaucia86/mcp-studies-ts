import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { ResponseFormatter } from './services/response-formatter.js';
import { Logger, LogLevel } from './utils/logger.js';
import { WeatherService } from './models/weather-service.interface.js';

export class WeatherMcpServer {
  private readonly server: McpServer;
  private readonly formatter: ResponseFormatter;
  private readonly logger: Logger;

  constructor(private readonly weatherService: WeatherService) {
    this.server = new McpServer({
      name: 'weather',
      version: '1.0.0',
    });

    this.formatter = new ResponseFormatter();
    this.logger = new Logger('WeatherMcpServer', LogLevel.INFO);
    
    this.registerTools();
  }

  private registerTools(): void {
    // Register get-alerts tool
    this.server.tool(
      'get-alerts',
      'Get weather alerts for a state',
      {
        state: z.string().length(2).describe('Two-letter state code (e.g. CA, NY)')
      },
      async ({ state }, _extra) => {
        this.logger.debug('Processing get-alerts request', { state });
        
        try {
          const alerts = await this.weatherService.getAlerts(state);
          const formattedResponse = this.formatter.formatAlerts(state.toUpperCase(), alerts);
          
          return {
            content: [
              {
                type: 'text' as const,
                text: formattedResponse
              }
            ]
          };
        } catch (error) {
          this.logger.error('Error getting alerts', { 
            state, 
            error: error instanceof Error ? error.message : String(error) 
          });
          
          return {
            content: [
              {
                type: 'text' as const,
                text: `Error getting alerts: ${error instanceof Error ? error.message : 'Unknown error'}`
              }
            ],
            isError: true
          };
        }
      }
    );

    // Register get-forecast tool
    this.server.tool(
      'get-forecast',
      'Get weather forecast for a location',
      {
        latitude: z.number().min(-90).max(90).describe('Latitude of the location'),
        longitude: z.number().min(-180).max(180).describe('Longitude of the location')
      },
      async ({ latitude, longitude }, _extra) => {
        this.logger.debug('Processing get-forecast request', { latitude, longitude });
        
        try {
          const forecast = await this.weatherService.getForecast(latitude, longitude);
          const formattedResponse = this.formatter.formatForecast(forecast);
          
          return {
            content: [
              {
                type: 'text' as const,
                text: formattedResponse
              }
            ]
          };
        } catch (error) {
          this.logger.error('Error getting forecast', { 
            latitude, 
            longitude, 
            error: error instanceof Error ? error.message : String(error) 
          });
          
          return {
            content: [
              {
                type: 'text' as const,
                text: `Error getting forecast: ${error instanceof Error ? error.message : 'Unknown error'}`
              }
            ],
            isError: true
          };
        }
      }
    );
  }

  async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    this.logger.info('Weather MCP Server running on stdio');
  }
}
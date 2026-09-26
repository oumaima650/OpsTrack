import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class GatewayService {
  private readonly logger = new Logger(GatewayService.name);
  private readonly incidentServiceUrl: string;
  private readonly notificationServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.incidentServiceUrl =
      this.configService.get<string>('INCIDENT_SERVICE_URL') || 'http://localhost:3001';
    this.notificationServiceUrl =
      this.configService.get<string>('NOTIFICATION_SERVICE_URL') || 'http://localhost:3002';
  }

  async forwardToIncidentService(method: string, path: string, body?: any, params?: any) {
    const url = `${this.incidentServiceUrl}${path}`;
    return this.request(method, url, body, params);
  }

  async forwardToNotificationService(method: string, path: string, body?: any, params?: any) {
    const url = `${this.notificationServiceUrl}${path}`;
    return this.request(method, url, body, params);
  }

  private async request(method: string, url: string, data?: any, params?: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.request({
          method,
          url,
          data,
          params,
        }),
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new HttpException(
          error.response.data || 'Downstream service error',
          error.response.status || HttpStatus.BAD_GATEWAY,
        );
      }
      this.logger.error(`Gateway proxy error contacting ${url}: ${error.message}`);
      throw new HttpException(
        `Service unavailable: ${url}`,
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}

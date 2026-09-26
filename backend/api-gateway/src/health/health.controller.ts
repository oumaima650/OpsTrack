import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { HealthCheckService, HealthCheck, HttpHealthIndicator } from '@nestjs/terminus';
import { ConfigService } from '@nestjs/config';

@ApiTags('Health')
@Controller('api/health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private configService: ConfigService,
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'API Gateway & Downstream Microservices Health Check' })
  check() {
    const incidentUrl =
      this.configService.get<string>('INCIDENT_SERVICE_URL') || 'http://localhost:3001';
    const notificationUrl =
      this.configService.get<string>('NOTIFICATION_SERVICE_URL') || 'http://localhost:3002';

    return this.health.check([
      () => ({ api_gateway: { status: 'up' } }),
      () => this.http.pingCheck('incident_service', `${incidentUrl}/health`),
      () => this.http.pingCheck('notification_service', `${notificationUrl}/health`),
    ]);
  }
}

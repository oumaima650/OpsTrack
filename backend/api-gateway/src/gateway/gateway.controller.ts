import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { GatewayService } from './gateway.service';

@ApiTags('API Gateway - Incidents & Notifications')
@Controller('api')
export class GatewayController {
  constructor(private readonly gatewayService: GatewayService) {}

  // INCIDENTS PROXY
  @Post('incidents')
  @ApiOperation({ summary: 'Proxy: Create incident' })
  createIncident(@Body() body: any) {
    return this.gatewayService.forwardToIncidentService('POST', '/incidents', body);
  }

  @Get('incidents')
  @ApiOperation({ summary: 'Proxy: List incidents' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'severity', required: false })
  @ApiQuery({ name: 'search', required: false })
  findAllIncidents(@Query() query: any) {
    return this.gatewayService.forwardToIncidentService('GET', '/incidents', null, query);
  }

  @Get('incidents/:id')
  @ApiOperation({ summary: 'Proxy: Get incident details' })
  findOneIncident(@Param('id') id: string) {
    return this.gatewayService.forwardToIncidentService('GET', `/incidents/${id}`);
  }

  @Patch('incidents/:id')
  @ApiOperation({ summary: 'Proxy: Update incident status or details' })
  updateIncident(@Param('id') id: string, @Body() body: any) {
    return this.gatewayService.forwardToIncidentService('PATCH', `/incidents/${id}`, body);
  }

  @Delete('incidents/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Proxy: Delete incident' })
  removeIncident(@Param('id') id: string) {
    return this.gatewayService.forwardToIncidentService('DELETE', `/incidents/${id}`);
  }

  // NOTIFICATIONS PROXY
  @Post('notifications')
  @ApiOperation({ summary: 'Proxy: Send notification' })
  sendNotification(@Body() body: any) {
    return this.gatewayService.forwardToNotificationService('POST', '/notifications', body);
  }

  @Get('notifications/history')
  @ApiOperation({ summary: 'Proxy: Get notification history' })
  getNotificationHistory() {
    return this.gatewayService.forwardToNotificationService('GET', '/notifications/history');
  }
}

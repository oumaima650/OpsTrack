import { Controller, Post, Get, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @ApiOperation({ summary: 'Log a notification for an incident event' })
  @ApiResponse({ status: 201, description: 'Notification logged successfully' })
  @ApiResponse({ status: 400, description: 'Invalid payload' })
  sendNotification(@Body() dto: CreateNotificationDto) {
    return this.notificationsService.sendNotification(dto);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get notification log history' })
  @ApiResponse({ status: 200, description: 'List of logged notifications' })
  getHistory() {
    return this.notificationsService.getHistory();
  }
}

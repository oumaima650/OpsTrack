import { Injectable, Logger } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private readonly notificationsHistory: Array<CreateNotificationDto & { timestamp: Date }> = [];

  sendNotification(dto: CreateNotificationDto) {
    const entry = {
      ...dto,
      timestamp: new Date(),
    };
    this.notificationsHistory.push(entry);

    this.logger.log(
      `[NOTIFICATION LOG] Event: ${dto.type} | Incident ID: ${dto.incidentId} | Message: ${dto.message} | Recipient: ${dto.recipient || 'ALL'}`,
    );

    return {
      status: 'LOGGED',
      message: 'Notification logged successfully',
      data: entry,
    };
  }

  getHistory() {
    return this.notificationsHistory;
  }
}

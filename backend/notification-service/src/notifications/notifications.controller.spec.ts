import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';

describe('NotificationsController', () => {
  let controller: NotificationsController;
  let service: NotificationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationsController],
      providers: [NotificationsService],
    }).compile();

    controller = module.get<NotificationsController>(NotificationsController);
    service = module.get<NotificationsService>(NotificationsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should send notification', () => {
    const dto = {
      incidentId: 'inc-102',
      type: 'STATUS_CHANGED',
      message: 'Status updated to RESOLVED',
    };

    const res = controller.sendNotification(dto);
    expect(res.status).toBe('LOGGED');
    expect(res.data.incidentId).toBe('inc-102');
  });

  it('should return history', () => {
    controller.sendNotification({
      incidentId: 'inc-103',
      type: 'TEST',
      message: 'Test message',
    });

    const history = controller.getHistory();
    expect(history.length).toBeGreaterThan(0);
  });
});

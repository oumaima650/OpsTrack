import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';

describe('NotificationsService', () => {
  let service: NotificationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificationsService],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should log notification and save entry in history', () => {
    const dto = {
      incidentId: 'inc-101',
      type: 'INCIDENT_CREATED',
      message: 'Database connection failed',
      recipient: 'ops-team',
    };

    const result = service.sendNotification(dto);
    expect(result.status).toBe('LOGGED');
    expect(result.data.incidentId).toBe('inc-101');

    const history = service.getHistory();
    expect(history.length).toBe(1);
    expect(history[0].message).toBe('Database connection failed');
  });
});

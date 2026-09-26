import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of } from 'rxjs';
import { GatewayService } from './gateway.service';

describe('GatewayService', () => {
  let service: GatewayService;
  let mockHttpService: any;
  let mockConfigService: any;

  beforeEach(async () => {
    mockHttpService = {
      request: jest.fn().mockReturnValue(of({ data: [{ id: 'inc-1', title: 'Test Incident' }] })),
    };

    mockConfigService = {
      get: jest.fn().mockImplementation((key: string) => {
        if (key === 'INCIDENT_SERVICE_URL') return 'http://localhost:3001';
        if (key === 'NOTIFICATION_SERVICE_URL') return 'http://localhost:3002';
        return null;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GatewayService,
        { provide: HttpService, useValue: mockHttpService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<GatewayService>(GatewayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should forward request to incident service', async () => {
    const result = await service.forwardToIncidentService('GET', '/incidents');
    expect(result).toEqual([{ id: 'inc-1', title: 'Test Incident' }]);
    expect(mockHttpService.request).toHaveBeenCalledWith({
      method: 'GET',
      url: 'http://localhost:3001/incidents',
      data: undefined,
      params: undefined,
    });
  });

  it('should forward request to notification service', async () => {
    await service.forwardToNotificationService('POST', '/notifications', { message: 'hi' });
    expect(mockHttpService.request).toHaveBeenCalledWith({
      method: 'POST',
      url: 'http://localhost:3002/notifications',
      data: { message: 'hi' },
      params: undefined,
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';

describe('GatewayController', () => {
  let controller: GatewayController;
  let service: GatewayService;

  beforeEach(async () => {
    const mockService = {
      forwardToIncidentService: jest.fn().mockResolvedValue([{ id: '1', title: 'Gateway Incident' }]),
      forwardToNotificationService: jest.fn().mockResolvedValue({ status: 'LOGGED' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [GatewayController],
      providers: [
        { provide: GatewayService, useValue: mockService },
      ],
    }).compile();

    controller = module.get<GatewayController>(GatewayController);
    service = module.get<GatewayService>(GatewayService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should proxy list incidents', async () => {
    const res = await controller.findAllIncidents({});
    expect(res).toEqual([{ id: '1', title: 'Gateway Incident' }]);
  });

  it('should proxy send notification', async () => {
    const res = await controller.sendNotification({ incidentId: '1', type: 'TEST', message: 'hello' });
    expect(res).toEqual({ status: 'LOGGED' });
  });
});

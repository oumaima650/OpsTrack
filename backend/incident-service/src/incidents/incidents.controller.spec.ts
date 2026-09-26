import { Test, TestingModule } from '@nestjs/testing';
import { IncidentsController } from './incidents.controller';
import { IncidentsService } from './incidents.service';
import { IncidentStatus } from './enums/incident-status.enum';
import { IncidentSeverity } from './enums/incident-severity.enum';

describe('IncidentsController', () => {
  let controller: IncidentsController;
  let service: IncidentsService;

  const mockIncident = {
    id: 'inc-999',
    title: 'API Gateway Latency',
    description: 'P99 response time exceeded 2s',
    status: IncidentStatus.OPEN,
    severity: IncidentSeverity.HIGH,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockService = {
      create: jest.fn().mockResolvedValue(mockIncident),
      findAll: jest.fn().mockResolvedValue([mockIncident]),
      findOne: jest.fn().mockResolvedValue(mockIncident),
      update: jest.fn().mockResolvedValue({ ...mockIncident, status: IncidentStatus.RESOLVED }),
      remove: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [IncidentsController],
      providers: [
        {
          provide: IncidentsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<IncidentsController>(IncidentsController);
    service = module.get<IncidentsService>(IncidentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create an incident', async () => {
    const res = await controller.create({
      title: 'API Gateway Latency',
      description: 'P99 response time exceeded 2s',
      severity: IncidentSeverity.HIGH,
    });
    expect(res).toEqual(mockIncident);
  });

  it('should return all incidents', async () => {
    const res = await controller.findAll({});
    expect(res).toEqual([mockIncident]);
  });

  it('should return one incident', async () => {
    const res = await controller.findOne('inc-999');
    expect(res).toEqual(mockIncident);
  });

  it('should update an incident', async () => {
    const res = await controller.update('inc-999', { status: IncidentStatus.RESOLVED });
    expect(res.status).toBe(IncidentStatus.RESOLVED);
  });
});

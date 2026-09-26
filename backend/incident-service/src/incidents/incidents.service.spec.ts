import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of } from 'rxjs';
import { IncidentsService } from './incidents.service';
import { Incident } from './entities/incident.entity';
import { IncidentStatus } from './enums/incident-status.enum';
import { IncidentSeverity } from './enums/incident-severity.enum';

describe('IncidentsService', () => {
  let service: IncidentsService;
  let mockRepository: any;
  let mockHttpService: any;
  let mockConfigService: any;

  const mockIncident: Incident = {
    id: 'test-uuid-123',
    title: 'High CPU Load',
    description: 'Server CPU load reached 99%',
    status: IncidentStatus.OPEN,
    severity: IncidentSeverity.CRITICAL,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn().mockImplementation((dto) => dto),
      save: jest.fn().mockImplementation((incident) =>
        Promise.resolve({ id: 'test-uuid-123', ...incident }),
      ),
      find: jest.fn().mockResolvedValue([mockIncident]),
      findOne: jest.fn().mockResolvedValue(mockIncident),
      remove: jest.fn().mockResolvedValue(undefined),
    };

    mockHttpService = {
      post: jest.fn().mockReturnValue(of({ data: { status: 'LOGGED' } })),
    };

    mockConfigService = {
      get: jest.fn().mockReturnValue('http://localhost:3002/notifications'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IncidentsService,
        {
          provide: getRepositoryToken(Incident),
          useValue: mockRepository,
        },
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<IncidentsService>(IncidentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an incident and trigger notification', async () => {
    const dto = {
      title: 'Memory Leak',
      description: 'Node process heap memory expanding',
      severity: IncidentSeverity.HIGH,
    };

    const result = await service.create(dto);

    expect(mockRepository.create).toHaveBeenCalledWith(dto);
    expect(mockRepository.save).toHaveBeenCalled();
    expect(mockHttpService.post).toHaveBeenCalled();
    expect(result.id).toBe('test-uuid-123');
  });

  it('should find all incidents', async () => {
    const incidents = await service.findAll();
    expect(incidents).toEqual([mockIncident]);
    expect(mockRepository.find).toHaveBeenCalled();
  });

  it('should find one incident by id', async () => {
    const incident = await service.findOne('test-uuid-123');
    expect(incident).toEqual(mockIncident);
  });

  it('should update incident status and trigger notification on status change', async () => {
    const updateDto = { status: IncidentStatus.RESOLVED };
    const updated = await service.update('test-uuid-123', updateDto);

    expect(updated.status).toBe(IncidentStatus.RESOLVED);
    expect(mockHttpService.post).toHaveBeenCalled();
  });
});

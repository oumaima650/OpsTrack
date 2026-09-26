import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import * as request from 'supertest';
import { IncidentsModule } from '../src/incidents/incidents.module';
import { HealthModule } from '../src/health/health.module';
import { Incident } from '../src/incidents/entities/incident.entity';
import { IncidentSeverity } from '../src/incidents/enums/incident-severity.enum';

describe('IncidentService (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Incident],
          synchronize: true,
        }),
        IncidentsModule,
        HealthModule,
      ],
    })
      .overrideProvider(HttpService)
      .useValue({
        post: jest.fn().mockReturnValue(of({ data: { status: 'LOGGED' } })),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200);
  });

  let createdIncidentId: string;

  it('/incidents (POST) - create incident', () => {
    return request(app.getHttpServer())
      .post('/incidents')
      .send({
        title: 'Redis Cluster Offline',
        description: 'Primary node lost quorum in availability zone 1',
        severity: IncidentSeverity.CRITICAL,
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.id).toBeDefined();
        expect(res.body.title).toBe('Redis Cluster Offline');
        expect(res.body.status).toBe('OPEN');
        createdIncidentId = res.body.id;
      });
  });

  it('/incidents (GET) - list all incidents', () => {
    return request(app.getHttpServer())
      .get('/incidents')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
      });
  });

  it('/incidents/:id (GET) - get single incident', () => {
    return request(app.getHttpServer())
      .get(`/incidents/${createdIncidentId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.id).toBe(createdIncidentId);
      });
  });

  it('/incidents/:id (PATCH) - update incident status', () => {
    return request(app.getHttpServer())
      .patch(`/incidents/${createdIncidentId}`)
      .send({
        status: 'IN_PROGRESS',
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.status).toBe('IN_PROGRESS');
      });
  });
});

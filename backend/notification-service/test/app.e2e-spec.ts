import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('NotificationService (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

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

  it('/notifications (POST) - success', () => {
    return request(app.getHttpServer())
      .post('/notifications')
      .send({
        incidentId: 'inc-e2e-1',
        type: 'INCIDENT_CREATED',
        message: 'High latency observed on gateway',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.status).toBe('LOGGED');
        expect(res.body.data.incidentId).toBe('inc-e2e-1');
      });
  });

  it('/notifications (POST) - validation failure', () => {
    return request(app.getHttpServer())
      .post('/notifications')
      .send({
        // missing required fields
        message: 'Invalid notification',
      })
      .expect(400);
  });
});

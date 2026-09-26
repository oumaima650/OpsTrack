import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('APIGateway (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(HttpService)
      .useValue({
        request: jest.fn().mockImplementation((opts) => {
          if (opts.url.includes('/health')) {
            return of({ data: { status: 'ok' } });
          }
          if (opts.url.includes('/incidents')) {
            return of({ data: [{ id: 'inc-gw-1', title: 'Gateway Incident' }] });
          }
          if (opts.url.includes('/notifications')) {
            return of({ data: { status: 'LOGGED' } });
          }
          return of({ data: {} });
        }),
        get: jest.fn().mockReturnValue(of({ data: { status: 'ok' } })),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/incidents (GET) - proxy list incidents', () => {
    return request(app.getHttpServer())
      .get('/api/incidents')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body[0].title).toBe('Gateway Incident');
      });
  });

  it('/api/notifications (POST) - proxy send notification', () => {
    return request(app.getHttpServer())
      .post('/api/notifications')
      .send({
        incidentId: 'inc-gw-1',
        type: 'TEST',
        message: 'Gateway test',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.status).toBe('LOGGED');
      });
  });
});

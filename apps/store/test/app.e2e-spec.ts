import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { StoreModule } from '../src/store.module';
import { ConfigModule } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

describe('StoreController (e2e)', () => {
  let app: INestApplication;
  let cacheManager: Cache;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        StoreModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    cacheManager = app.get<Cache>(CACHE_MANAGER);
  });

  afterAll(async () => {
    await cacheManager.reset();
    await app.close();
  });

  beforeEach(async () => {
    // await cacheManager.reset();
  });

  describe('GET /', () => {
    it('should return status equal to ok', async () => {
      const response = await request(app.getHttpServer()).get('/');

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toEqual({
        status: 'ok',
      });
    });
  });
});

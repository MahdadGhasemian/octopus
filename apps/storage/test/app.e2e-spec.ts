import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { StorageModule } from '../src/storage.module';
import { ConfigModule } from '@nestjs/config';

describe('StorageResolver (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        StorageModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /', () => {
    it('should return a valid health check response', async () => {
      const response = await request(app.getHttpServer()).get('/');

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toMatchObject({
        status: expect.any(String),
        rabbitmq: expect.any(String),
        rabbitResponseTime: expect.any(String),
        database: expect.any(String),
        dbResponseTime: expect.any(String),
        redis: expect.any(String),
        redisResponseTime: expect.any(String),
      });
    });
  });

  describe('POST /public-files', () => {
    it('should upload a file and return success message', async () => {
      // A buffer to simulate file content
      const file = Buffer.from('dummy file content');
      const fileSize = file.length;

      // Attach file to the request
      const response = await request(app.getHttpServer())
        .post('/public-files')
        .attach('file', file, 'dummy-file.txt');

      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body).toEqual({
        bucket_name: 'public-documents',
        object_name: expect.any(String),
        size: fileSize,
        url: expect.any(String),
      });
    });
  });
});

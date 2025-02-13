import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { StorageModule } from '../src/storage.module';
import { ConfigModule } from '@nestjs/config';

describe('StorageController (e2e)', () => {
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
    it('should return status equal to ok', async () => {
      const response = await request(app.getHttpServer()).get('/');

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toEqual({
        status: 'ok',
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

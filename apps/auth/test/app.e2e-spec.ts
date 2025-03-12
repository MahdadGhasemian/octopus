import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AuthModule } from './../src/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { userStub } from './stubs/user.stub';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

describe('AuthResolver (e2e)', () => {
  let app: INestApplication;
  let configService: ConfigService;
  let cacheManager: Cache;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        AuthModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    configService = app.get<ConfigService>(ConfigService);
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

  describe('Post /otp', () => {
    it('should return OTP and store it in Redis', async () => {
      const body = { email: userStub().email };

      const response = await request(app.getHttpServer())
        .post('/auth/otp')
        .send(body);

      const cache_prefix = await configService.get<string>(
        'REDIS_CACHE_KEY_PREFIX_AUTH',
      );
      const hashed_code = await cacheManager.get<string>(
        `${cache_prefix}:${body.email}`,
      );

      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body).toMatchObject({
        hashed_code: expect.any(String),
      });
      expect(response.body.hashed_code).toEqual(hashed_code);
    });
  });

  describe('Post /otp/confirm', () => {
    it('should confirm OTP and create user', async () => {
      const email = userStub().email;
      const full_name = userStub().full_name;

      const otpResponse = await request(app.getHttpServer())
        .post('/auth/otp')
        .send({ email });

      const cache_prefix = await configService.get<string>(
        'REDIS_CACHE_KEY_PREFIX_AUTH',
      );
      const confirmation_code = await cacheManager.get<string>(
        `${cache_prefix}:otp:${email}`,
      );

      const hashed_code = otpResponse.body.hashed_code;
      const password = 'TestPass$1000';
      const body = {
        email,
        full_name,
        password,
        confirmation_code,
        hashed_code,
      };

      const response = await request(app.getHttpServer())
        .post('/auth/otp/confirm')
        .send(body);

      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body).toMatchObject({
        email: userStub().email,
        full_name: userStub().full_name,
        accesses: expect.any(Array),
      });
    });
  });
});

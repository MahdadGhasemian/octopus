import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, firstValueFrom, map, of, timeout } from 'rxjs';
import { HealthRepository } from './health.repository';
import { Health } from '../entities';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { randomBytes } from 'crypto';

@Injectable()
export class HealthService {
  constructor(
    @Inject('health') private readonly healthClient: ClientProxy,
    private readonly healthRepository: HealthRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async checkRabbitMQ(): Promise<{ status: boolean; responseTime: number }> {
    const startTime = Date.now();

    try {
      const rabbitStatus = await firstValueFrom(
        this.healthClient.send('rabbitmq.ping', '').pipe(
          timeout(3000),
          map(() => true),
          catchError(() => of(false)),
        ),
      );

      const responseTime = Date.now() - startTime;
      return { status: rabbitStatus, responseTime };
    } catch {
      const responseTime = Date.now() - startTime;
      return { status: false, responseTime };
    }
  }

  async checkDatabase(): Promise<{ status: boolean; responseTime: number }> {
    const startTime = Date.now();

    try {
      let healthEntry = await this.healthRepository.findOneNoCheck({});

      if (!healthEntry) {
        const result = await this.healthRepository.create(
          new Health({
            last_date_checking: new Date(),
          }),
        );
        healthEntry = await this.healthRepository.findOne({ id: result.id });
      } else {
        healthEntry.last_date_checking = new Date();
      }

      await this.healthRepository.save(healthEntry);

      const responseTime = Date.now() - startTime;
      return { status: true, responseTime };
    } catch {
      const responseTime = Date.now() - startTime;
      return { status: false, responseTime };
    }
  }

  async checkRedis(): Promise<{ status: boolean; responseTime: number }> {
    const startTime = Date.now();

    try {
      const testKey = `health-check-${randomBytes(10).toString('hex')}`;
      await this.cacheManager.set(testKey, 'ok', 100);
      const value = await this.cacheManager.get(testKey);

      const responseTime = Date.now() - startTime;
      return { status: value === 'ok', responseTime };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      return { status: false, responseTime };
    }
  }

  async checkAll() {
    const [rabbitmqResult, databaseResult, redisResult] = await Promise.all([
      this.checkRabbitMQ(),
      this.checkDatabase(),
      this.checkRedis(),
    ]);

    const { status: rabbitStatus, responseTime: rabbitResponseTime } =
      rabbitmqResult;

    const { status: dbStatus, responseTime: dbResponseTime } = databaseResult;

    const { status: redisStatus, responseTime: redisResponseTime } =
      redisResult;

    return {
      status: rabbitStatus && dbStatus && redisStatus ? 'ok' : 'degraded',
      rabbitmq: rabbitStatus ? 'connected' : 'disconnected',
      rabbitResponseTime: `${rabbitResponseTime}ms`,
      database: dbStatus ? 'connected' : 'disconnected',
      dbResponseTime: `${dbResponseTime}ms`,
      redis: redisStatus ? 'connected' : 'disconnected',
      redisResponseTime: `${redisResponseTime}ms`,
    };
  }
}

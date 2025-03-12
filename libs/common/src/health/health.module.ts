import { Module, DynamicModule } from '@nestjs/common';
import { HealthService } from './health.service';
import { RabbitmqModule } from '../modules';
import { HealthRepository } from './health.repository';
import { Health } from '../entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthController } from './health.controller';
import { createHealthResolver } from './health.resolver.factory';

@Module({})
export class HealthModule {
  static forRoot(queueNameConfigKey: string, queryName: string): DynamicModule {
    const HealthResolver = createHealthResolver(queryName);

    return {
      module: HealthModule,
      imports: [
        RabbitmqModule.forRoot('health', queueNameConfigKey),
        TypeOrmModule.forFeature([Health]),
      ],
      controllers: [HealthController],
      providers: [
        HealthResolver,
        HealthService,
        HealthRepository,
        {
          provide: 'QUEUE_NAME_CONFIG_KEY',
          useValue: queueNameConfigKey,
        },
        {
          provide: 'HEALTH_QUERY_NAME',
          useValue: queryName,
        },
      ],
    };
  }
}

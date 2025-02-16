import { Module, DynamicModule } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { RabbitmqModule } from '../modules';
import { HealthRepository } from './health.repository';
import { Health } from '../entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({})
export class HealthModule {
  static forRoot(queueNameConfigKey: string): DynamicModule {
    return {
      module: HealthModule,
      imports: [
        RabbitmqModule.forRoot('health', queueNameConfigKey),
        TypeOrmModule.forFeature([Health]),
      ],
      controllers: [HealthController],
      providers: [
        HealthService,
        HealthRepository,
        {
          provide: 'QUEUE_NAME_CONFIG_KEY',
          useValue: queueNameConfigKey,
        },
      ],
    };
  }
}

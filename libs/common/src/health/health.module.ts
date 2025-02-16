import { Module, DynamicModule } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { RabbitmqModule } from '../modules';

@Module({})
export class HealthModule {
  static forRoot(queueNameConfigKey: string): DynamicModule {
    return {
      module: HealthModule,
      imports: [RabbitmqModule.forRoot('health', queueNameConfigKey)],
      controllers: [HealthController],
      providers: [
        HealthService,
        {
          provide: 'QUEUE_NAME_CONFIG_KEY',
          useValue: queueNameConfigKey,
        },
      ],
    };
  }
}

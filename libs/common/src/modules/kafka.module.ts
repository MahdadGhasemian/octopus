import { Module, DynamicModule } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Module({})
export class KafkaModule {
  static register(options: {
    name: string;
    brokerUri: string;
    groupId: string;
  }): DynamicModule {
    return {
      module: KafkaModule,
      imports: [
        ClientsModule.registerAsync([
          {
            name: options.name,
            useFactory: (configService: ConfigService) => ({
              transport: Transport.KAFKA,
              options: {
                client: {
                  brokers: [options.brokerUri],
                },
                consumer: {
                  groupId: options.groupId,
                },
              },
            }),
            inject: [ConfigService],
          },
        ]),
      ],
      exports: [ClientsModule],
    };
  }
}

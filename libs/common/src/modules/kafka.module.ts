import { Module, DynamicModule, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Global()
@Module({})
export class KafkaModule {
  static forRoot(
    name: string,
    clientId: string,
    groupId: string,
  ): DynamicModule {
    return {
      module: KafkaModule,
      imports: [
        ConfigModule,
        ClientsModule.registerAsync([
          {
            name,
            useFactory: (configService: ConfigService) => ({
              transport: Transport.KAFKA,
              options: {
                client: {
                  clientId,
                  brokers: [
                    configService.getOrThrow<string>('KAFKA_BROKER_URI'),
                  ],
                },
                consumer: {
                  groupId,
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

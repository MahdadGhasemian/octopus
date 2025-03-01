import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PinoLoggerModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        pinoHttp: {
          level: configService.get<string>('LOG_LEVEL', 'info'),
          redact: [
            'req.headers.cookie',
            'req.Authentication',
            'req.headers.authorization',
          ],
          transport: {
            target: 'pino-pretty',
            options: {
              singleLine: true,
              colorize: true,
            },
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class LoggerModule {}

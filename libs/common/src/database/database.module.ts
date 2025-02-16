import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';

@Module({})
export class DatabaseModule {
  static forRootAsync(options: {
    useFactory: (configService: ConfigService) => Promise<{ database: string }>;
    inject: any[];
  }): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        TypeOrmModule.forRootAsync({
          useFactory: async (configService: ConfigService) => {
            const { database } = await options.useFactory(configService);
            return {
              type: 'postgres',
              host: configService.getOrThrow('POSTGRES_HOST'),
              port: configService.getOrThrow('POSTGRES_PORT'),
              database: database,
              username: configService.getOrThrow('POSTGRES_USERNAME'),
              password: configService.getOrThrow('POSTGRES_PASSWORD'),
              synchronize:
                configService.getOrThrow('POSTGRES_SYNCHRONIZE') === 'true',
              autoLoadEntities: configService.getOrThrow(
                'POSTGRES_AUTO_LOAD_ENTITIES',
                true,
              ),
            };
          },
          inject: options.inject,
        }),
      ],
    };
  }

  static forFeature(entities?: EntityClassOrSchema[]): DatabaseModule {
    return TypeOrmModule.forFeature(entities);
  }
}

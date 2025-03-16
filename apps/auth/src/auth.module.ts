import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  DatabaseModule,
  HealthModule,
  HttpCacheInterceptor,
  LoggerModule,
  RabbitmqModule,
  REDIS_CACHE_KEY_PREFIX_AUTH,
  STORE_SERVICE,
} from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import * as Joi from 'joi';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt-strategy';
import { AccessesModule } from './accesses/accesses.module';
import { CACHE_MANAGER, CacheModule } from '@nestjs/cache-manager';
import { RedisClientOptions } from 'redis';
import { redisStore } from 'cache-manager-redis-yet';
import { APP_INTERCEPTOR, Reflector } from '@nestjs/core';
import { GqlModuleOptions, GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AuthResolver } from './auth.resolver';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        HTTP_PORT_AUTH: Joi.number().required(),
        JWT_PRIVATE_KEY: Joi.string().required(),
        JWT_PUBLIC_KEY: Joi.string().required(),
        OTP_EMAIL_EXPIRATION: Joi.number().required(),
        DEFAULT_ACCESS_ID: Joi.number().required(),
        REDIS_CACHE_KEY_PREFIX_AUTH: Joi.string().required(),
        POSTGRES_DATABASE_AUTH: Joi.string().required(),
        GRAPHQL_SCHEMA_FILE_AUTH: Joi.string().optional(),
      }),
    }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        signOptions: {
          algorithm: 'RS256',
          expiresIn: `${configService.get('JWT_EXPIRATION')}s`,
        },
        privateKey: configService
          .get<string>('JWT_PRIVATE_KEY')
          .replace(/\\n/g, '\n'),
        publicKey: configService
          .get<string>('JWT_PUBLIC_KEY')
          .replace(/\\n/g, '\n'),
      }),
      inject: [ConfigService],
    }),
    RabbitmqModule.forRoot(STORE_SERVICE, 'RABBITMQ_STORE_QUEUE_NAME'),
    CacheModule.registerAsync<RedisClientOptions>({
      imports: [ConfigModule],
      isGlobal: true,
      useFactory: async (configService: ConfigService) => ({
        store: await redisStore({
          ttl: configService.get<number>('REDIS_CACHE_TTL_GLOBAL') || 60000,
          socket: {
            host: configService.get<string>('REDIS_HOST'),
            port: configService.get<number>('REDIS_PORT'),
          },
        }),
      }),
      inject: [ConfigService],
    }),
    DatabaseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        database: configService.get('POSTGRES_DATABASE_AUTH'),
      }),
      inject: [ConfigService],
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: async (configService: ConfigService) => {
        return {
          autoSchemaFile: configService.get<string>(
            'GRAPHQL_SCHEMA_FILE_AUTH',
            'schema.gql',
          ),
          sortSchema: true,
          context: ({ req, res }) => ({ req, res }),
          cors: {
            origin: true,
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
            credentials: true,
          },
        } as GqlModuleOptions;
      },
      inject: [ConfigService],
    }),
    HealthModule.forRoot('RABBITMQ_AUTH_QUEUE_NAME', 'healthAuth'),
    UsersModule,
    AccessesModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthResolver,
    AuthService,
    LocalStrategy,
    JwtStrategy,
    {
      provide: APP_INTERCEPTOR,
      useFactory: (cacheManager: any, reflector: Reflector) => {
        return new HttpCacheInterceptor(
          REDIS_CACHE_KEY_PREFIX_AUTH,
          cacheManager,
          reflector,
        );
      },
      inject: [CACHE_MANAGER, Reflector],
    },
  ],
})
export class AuthModule {}

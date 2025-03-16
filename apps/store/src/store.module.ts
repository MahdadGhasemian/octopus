import { Module } from '@nestjs/common';
import {
  AUTH_SERVICE,
  DatabaseModule,
  HealthModule,
  HttpCacheInterceptor,
  LoggerModule,
  RabbitmqModule,
  REDIS_CACHE_KEY_PREFIX_STORE,
  STORE_SERVICE,
} from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { CategoriesModule } from './categories/categories.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentsModule } from './payments/payments.module';
import { ProductsModule } from './products/products.module';
import { CACHE_MANAGER, CacheModule } from '@nestjs/cache-manager';
import { RedisClientOptions } from 'redis';
import { redisStore } from 'cache-manager-redis-yet';
import { APP_INTERCEPTOR, Reflector } from '@nestjs/core';
import { UsersModule } from './users/users.module';
import { GqlModuleOptions, GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        HTTP_PORT_STORE: Joi.number().required(),
        REDIS_CACHE_KEY_PREFIX_STORE: Joi.string().required(),
        GRAPHQL_SCHEMA_FILE_STORE: Joi.string().optional(),
      }),
    }),
    RabbitmqModule.forRoot(AUTH_SERVICE, 'RABBITMQ_AUTH_QUEUE_NAME'),
    RabbitmqModule.forRoot(STORE_SERVICE, 'RABBITMQ_STORE_QUEUE_NAME'),
    CacheModule.registerAsync<RedisClientOptions>({
      imports: [ConfigModule],
      isGlobal: true,
      useFactory: async (configService: ConfigService) => ({
        store: await redisStore({
          ttl: configService.get<number>('REDIS_CACHE_TTL_GLOBAL') || 60000,
          socket: {
            host: configService.getOrThrow<string>('REDIS_HOST'),
            port: configService.getOrThrow<number>('REDIS_PORT'),
          },
        }),
      }),
      inject: [ConfigService],
    }),
    DatabaseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        database: configService.getOrThrow('POSTGRES_DATABASE_STORE'),
      }),
      inject: [ConfigService],
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: async (configService: ConfigService) => {
        return {
          autoSchemaFile: configService.get<string>(
            'GRAPHQL_SCHEMA_FILE_STORE',
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
    HealthModule.forRoot('RABBITMQ_STORE_QUEUE_NAME', 'healthStore'),
    UsersModule,
    CategoriesModule,
    ProductsModule,
    OrdersModule,
    PaymentsModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useFactory: (cacheManager: any, reflector: Reflector) => {
        return new HttpCacheInterceptor(
          REDIS_CACHE_KEY_PREFIX_STORE,
          cacheManager,
          reflector,
        );
      },
      inject: [CACHE_MANAGER, Reflector],
    },
  ],
})
export class StoreModule {}

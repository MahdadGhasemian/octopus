import { Module } from '@nestjs/common';
import {
  AUTH_SERVICE,
  HealthModule,
  HttpCacheInterceptor,
  KAFKA_STORE_NAME,
  KafkaModule,
  LoggerModule,
  REDIS_CACHE_KEY_PREFIX_STORE,
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

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        HTTP_PORT_STORE: Joi.number().required(),
      }),
    }),
    KafkaModule.forRoot(
      AUTH_SERVICE,
      `${KAFKA_STORE_NAME}`,
      `${KAFKA_STORE_NAME}-consumer`,
    ),
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
    HealthModule,
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

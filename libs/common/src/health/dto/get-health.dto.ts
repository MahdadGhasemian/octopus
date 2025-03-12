import {
  Directive,
  Field,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { Expose } from 'class-transformer';
import { IsEnum, IsString } from 'class-validator';

enum HealthStatus {
  OK = 'ok',
  DEGRADED = 'degraded',
}

enum ConnectionStatus {
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
}

registerEnumType(HealthStatus, {
  name: 'OrderStatus',
});
registerEnumType(ConnectionStatus, {
  name: 'OrderStatus',
});

@ObjectType()
@Directive('@shareable')
export class GetHealthDto {
  @IsEnum(HealthStatus)
  @Expose()
  @Field()
  status: HealthStatus;

  @IsEnum(ConnectionStatus)
  @Expose()
  @Field()
  rabbitmq: ConnectionStatus;

  @IsString()
  @Expose()
  @Field()
  rabbitResponseTime: string;

  @IsEnum(ConnectionStatus)
  @Expose()
  @Field()
  database: ConnectionStatus;

  @IsString()
  @Expose()
  @Field()
  dbResponseTime: string;

  @IsEnum(ConnectionStatus)
  @Expose()
  @Field()
  redis: ConnectionStatus;

  @IsString()
  @Expose()
  @Field()
  redisResponseTime: string;
}

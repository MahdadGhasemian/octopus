import { ApiProperty } from '@nestjs/swagger';
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

export class GetHealthDto {
  @ApiProperty({
    example: HealthStatus.OK,
    enum: HealthStatus,
  })
  @IsEnum(HealthStatus)
  @Expose()
  status: HealthStatus;

  @ApiProperty({
    example: ConnectionStatus.CONNECTED,
    enum: ConnectionStatus,
  })
  @IsEnum(ConnectionStatus)
  @Expose()
  rabbitmq: ConnectionStatus;

  @ApiProperty({
    example: '20ms',
    type: String,
  })
  @IsString()
  @Expose()
  rabbitResponseTime: string;

  @ApiProperty({
    example: ConnectionStatus.CONNECTED,
    enum: ConnectionStatus,
  })
  @IsEnum(ConnectionStatus)
  @Expose()
  database: ConnectionStatus;

  @ApiProperty({
    example: '10ms',
    type: String,
  })
  @IsString()
  @Expose()
  dbResponseTime: string;

  @ApiProperty({
    example: ConnectionStatus.CONNECTED,
    enum: ConnectionStatus,
  })
  @IsEnum(ConnectionStatus)
  @Expose()
  redis: ConnectionStatus;

  @ApiProperty({
    example: '1ms',
    type: String,
  })
  @IsString()
  @Expose()
  redisResponseTime: string;
}

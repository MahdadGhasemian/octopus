import { Module } from '@nestjs/common';
import { PrivateFilesService } from './private-files.service';
import { PrivateFilesController } from './private-files.controller';
import { DatabaseModule, PrivateFile } from '@app/common';
import { PrivateFilesRepository } from './private-files.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        database: configService.getOrThrow('POSTGRES_DATABASE_STORAGE'),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([PrivateFile]),
  ],
  controllers: [PrivateFilesController],
  providers: [PrivateFilesService, PrivateFilesRepository],
})
export class PrivateFilesModule {}

import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesRepository } from './categories.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Category } from '../libs';
import { CategoriesResolver } from './categories.resolver';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Category])],
  providers: [CategoriesService, CategoriesRepository, CategoriesResolver],
  exports: [CategoriesService, CategoriesRepository],
})
export class CategoriesModule {}

import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { Category, DatabaseModule } from '@app/common';
import { CategoriesRepository } from './categories.repository';

@Module({
  imports: [DatabaseModule, DatabaseModule.forFeature([Category])],
  controllers: [CategoriesController],
  providers: [CategoriesService, CategoriesRepository],
  exports: [CategoriesService],
})
export class CategoriesModule {}

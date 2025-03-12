import { Resolver, Query } from '@nestjs/graphql';
import { HealthService } from './health.service';
import { GetHealthDto } from './dto/get-health.dto';

export function createHealthResolver(queryName: string): {
  new (healthService: HealthService): any;
} {
  @Resolver()
  class HealthResolver {
    constructor(public readonly healthService: HealthService) {}

    @Query(() => GetHealthDto, { name: queryName })
    async health() {
      return this.healthService.checkAll();
    }
  }

  return HealthResolver;
}

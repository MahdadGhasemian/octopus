import { NoCache } from '@app/common';
import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Endpoint } from '../libs';
import { EndpointsService } from './endpoints.service';

@Resolver(() => Endpoint)
@NoCache()
export class EndpointsResolver {
  constructor(private readonly endpointsService: EndpointsService) {}

  @ResolveField(() => [Endpoint])
  async endpoints(@Parent() access: Endpoint) {
    console.log('EndpointsResolver ---------------------------');
    return this.endpointsService.readEndpoints(access.id);
  }
}

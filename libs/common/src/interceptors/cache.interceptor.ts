import { CacheInterceptor } from '@nestjs/cache-manager';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GENERAL_CACHE_KEY, NO_CACHE_KEY } from '../decorators';

const getReflectorKeyByContext = (
  context: ExecutionContext,
  reflector: Reflector,
  key: string,
) => {
  return (
    reflector.get<boolean>(key, context.getHandler()) ||
    reflector.get<boolean>(key, context.getClass())
  );
};

@Injectable()
export class HttpCacheInterceptor extends CacheInterceptor {
  constructor(
    private readonly prefix: string,
    cacheManager: any,
    reflector: Reflector,
  ) {
    super(cacheManager, reflector);
  }

  trackBy(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const jwt =
      request?.cookies?.Authentication || request?.headers?.authentication;

    // Skip cahcing for non-GET requests
    if (method !== 'GET') {
      return undefined;
    }

    // Check for the NoCache decorator
    const noCache = getReflectorKeyByContext(
      context,
      this.reflector,
      NO_CACHE_KEY,
    );

    if (noCache) {
      return undefined; // Skip caching
    }

    const isGeneralCache = getReflectorKeyByContext(
      context,
      this.reflector,
      GENERAL_CACHE_KEY,
    );

    return isGeneralCache
      ? `${this.prefix}:${url}`
      : `${this.prefix}:${jwt}:${url}`;
  }
}

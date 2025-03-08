import { CacheInterceptor } from '@nestjs/cache-manager';
import { CallHandler, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  FORCE_TO_CLEAR_CACHE_KEY,
  GENERAL_CACHE_KEY,
  NO_CACHE_KEY,
} from '../decorators';
import { Observable, tap } from 'rxjs';

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
    const type = context.getType();

    // Skip cahcing for graphql requests
    if (type !== 'http' && type !== 'rpc') {
      return undefined;
    }

    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const jwt =
      request?.cookies?.Authentication || request?.headers?.authentication;
    const cache_part = jwt?.split('.')[1];

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

    // Skip cahcing for undefined cache_part
    if (!isGeneralCache && !cache_part) {
      return undefined;
    }

    return isGeneralCache
      ? `${this.prefix}:${url}`
      : `${this.prefix}:${cache_part}:${url}`;
  }

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const type = context.getType();

    // Skip for graphql requests
    if (type !== 'http' && type !== 'rpc') {
      return super.intercept(context, next);
    }

    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const jwt =
      request?.cookies?.Authentication || request?.headers?.authentication;
    const cache_part = jwt?.split('.')[1];

    if (method !== 'GET') {
      return Promise.resolve(
        next.handle().pipe(
          tap(async () => {
            // Check for the NoCache decorator
            const noCache = getReflectorKeyByContext(
              context,
              this.reflector,
              NO_CACHE_KEY,
            );

            const forceToClearCacheKey = getReflectorKeyByContext(
              context,
              this.reflector,
              FORCE_TO_CLEAR_CACHE_KEY,
            );

            if (noCache && !forceToClearCacheKey) {
              return undefined; // Skip caching
            }

            const isGeneralCache = getReflectorKeyByContext(
              context,
              this.reflector,
              GENERAL_CACHE_KEY,
            );

            if (!forceToClearCacheKey && !isGeneralCache && !cache_part) {
              return undefined; // Skip caching
            }

            // Clear the cache for the modified entities
            const urlPattern = this.getFirstPath(url);
            const cacheKeyPattern = forceToClearCacheKey
              ? `${this.prefix}:${forceToClearCacheKey}`
              : isGeneralCache
                ? `${this.prefix}:${urlPattern}`
                : `${this.prefix}:${cache_part}:${urlPattern}`;

            await this.deleteKeysByPattern(cacheKeyPattern);
          }),
        ),
      );
    }

    return super.intercept(context, next);
  }

  async deleteKeysByPattern(pattern: string) {
    const keys = await this.cacheManager.store.keys(`${pattern}*`);
    if (keys.length > 0) {
      await Promise.all(keys.map((key) => this.cacheManager.del(key)));
    }
  }

  getFirstPath(url: string): string {
    const match = url.match(/^\/[^\/?]*/);
    return match ? match[0] : '/';
  }
}

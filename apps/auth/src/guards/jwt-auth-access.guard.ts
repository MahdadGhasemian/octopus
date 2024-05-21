import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthAccessGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthAccessGuard.name);

  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const path = `${request.originalUrl}`;
    const method = request.method;
    const jwt =
      context.switchToHttp().getRequest().cookies?.Authentication ||
      context.switchToHttp().getRequest().headers?.authentication;

    if (!jwt) {
      return false;
    }

    const user = request?.user;
    const accesses = user?.accesses;
    const hasFullAccess = !!accesses?.find(
      (item: { hasFullAccess?: boolean }) => item.hasFullAccess,
    );

    if (!hasFullAccess) {
      const accessList = accesses?.flatMap(
        (item: { endpoints?: any[] }) => item.endpoints,
      );
      if (!this.hasAccess(method, path, accessList)) {
        throw new ForbiddenException('Access denied!');
      }
    }

    return true;
  }

  hasAccess(method: string, path: string, accessList?: any[]) {
    if (!accessList?.length) return false;

    const exactMatch = accessList.find(
      (item) => item.path === path && item.method === method,
    );
    if (exactMatch) {
      return true;
    }

    const urlObject = new URL(path, 'http://localhost');
    const pathname = urlObject.pathname;

    for (const route of accessList) {
      if (pathname && route?.method) {
        const pattern = new RegExp(
          '^' + route.path?.replace(/{[^}]+}/g, '[^/]+') + '$',
        );

        if (pattern.test(pathname) && route.method === method) {
          return true;
        }
      }
    }

    return false;
  }
}

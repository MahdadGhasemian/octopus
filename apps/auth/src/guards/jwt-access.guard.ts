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
export class JwtAccessGuard implements CanActivate {
  private readonly logger = new Logger(JwtAccessGuard.name);

  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    let path: string;
    let method: string;
    let user: any;

    if (context.getType() === 'http') {
      // Extract data from HTTP request
      const request = context.switchToHttp().getRequest();
      path = request.originalUrl;
      method = request.method;
      user = request?.user;
    } else if (context.getType() === 'rpc') {
      // Extract data from RabbitMQ message
      const data = context.switchToRpc().getData();
      path = data?.path;
      method = data?.method;
      user = data?.user;
    } else {
      return false;
    }

    const accesses = user?.accesses;
    const has_full_access = !!accesses?.find(
      (item: { has_full_access?: boolean }) => item.has_full_access,
    );

    if (!has_full_access) {
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

import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { AUTH_SERVICE, EVENT_NAME_AUTHENTICATE } from '../constants';
import { AuthRequestEvent } from '../events';

@Injectable()
export class JwtAuthAccessGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthAccessGuard.name);

  constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const path = `${request.originalUrl}`;
    const method = request.method;
    const jwt =
      request.cookies?.Authentication || request.headers?.authentication;

    if (!jwt) {
      return false;
    }

    return this.authClient
      .send(EVENT_NAME_AUTHENTICATE, new AuthRequestEvent(jwt))
      .pipe(
        tap((user) => {
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

          context.switchToHttp().getRequest().user = user;
        }),
        map(() => true),
        catchError(() => of(false)),
      );
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

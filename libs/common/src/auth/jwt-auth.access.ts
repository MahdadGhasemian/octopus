import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { ClientKafka } from '@nestjs/microservices';
import { AUTH_SERVICE } from '../constants';

@Injectable()
export class JwtAuthAccessGuard implements CanActivate, OnModuleInit {
  private readonly logger = new Logger(JwtAuthAccessGuard.name);

  constructor(@Inject(AUTH_SERVICE) private readonly client: ClientKafka) {}

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

    return this.client
      .send(
        'authenticate',
        JSON.stringify({
          Authentication: jwt,
        }),
      )
      .pipe(
        tap((user) => {
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

  onModuleInit() {
    this.client.subscribeToResponseOf('authenticate');
  }
}

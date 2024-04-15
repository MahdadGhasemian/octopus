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
import { Reflector } from '@nestjs/core';
import { ClientKafka } from '@nestjs/microservices';
import { GENERAL_SERVICE } from '../constants';

@Injectable()
export class JwtAuthRoleGuard implements CanActivate, OnModuleInit {
  private readonly logger = new Logger(JwtAuthRoleGuard.name);

  constructor(
    @Inject(GENERAL_SERVICE) private readonly client: ClientKafka,
    private readonly reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const jwt =
      context.switchToHttp().getRequest().cookies?.Authentication ||
      context.switchToHttp().getRequest().headers?.authentication;

    if (!jwt) {
      return false;
    }

    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    return this.client
      .send(
        'authenticate',
        JSON.stringify({
          Authentication: jwt,
        }),
      )
      .pipe(
        tap((user) => {
          if (roles) {
            for (const role of roles) {
              if (!user.roles?.map((role) => role.name).includes(role)) {
                this.logger.error('The user does not have valid roles.');
                throw new ForbiddenException();
              }
            }
          }
          context.switchToHttp().getRequest().user = user;
        }),
        map(() => true),
        catchError(() => of(false)),
      );
  }

  onModuleInit() {
    this.client.subscribeToResponseOf('authenticate');
  }
}

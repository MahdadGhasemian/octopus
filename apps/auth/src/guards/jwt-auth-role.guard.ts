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
export class JwtAuthRoleGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthRoleGuard.name);

  constructor(private readonly reflector: Reflector) {}

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

    const request = context.switchToHttp().getRequest();
    const user = request?.user;

    const userRoles = user?.roles;

    if (roles) {
      for (const role of roles) {
        if (!userRoles?.map((role) => role.name).includes(role)) {
          this.logger.error('The user does not have valid roles.');
          throw new ForbiddenException();
        }
      }
    }

    return true;
  }
}

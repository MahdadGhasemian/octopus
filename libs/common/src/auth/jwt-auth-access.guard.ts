import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import {
  AUTH_SERVICE,
  EVENT_NAME_AUTHENTICATE_AND_CHECK_ACCESS,
} from '../constants';
import { AuthAndCheckAccessRequestEvent } from '../events';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthAccessGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthAccessGuard.name);
  private readonly publicKey: string;

  constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy) {
    this.publicKey = (process.env.JWT_PUBLIC_KEY || '').replace(/\\n/g, '\n');
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const path = `${request.originalUrl}`;
    const method = request.method;
    const jwtToken =
      request.cookies?.Authentication || request.headers?.authentication;

    if (!jwtToken) {
      return false;
    }

    jwt.verify(jwtToken, this.publicKey, {
      algorithms: ['RS256'],
    });

    return this.authClient
      .send(
        EVENT_NAME_AUTHENTICATE_AND_CHECK_ACCESS,
        new AuthAndCheckAccessRequestEvent(jwtToken, path, method),
      )
      .pipe(
        tap((user) => {
          context.switchToHttp().getRequest().user = user;
        }),
        map(() => true),
        catchError(() => of(false)),
      );
  }
}

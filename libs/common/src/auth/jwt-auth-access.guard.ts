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
import { GqlExecutionContext } from '@nestjs/graphql';

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
    const type = context.getType<string>();
    let gqlContext;

    let jwtToken: string | undefined;
    let path: string;
    let method: string;
    // let pathKey: string;

    if (type === 'http') {
      // Handle HTTP request
      const request = context.switchToHttp().getRequest();
      path = request.originalUrl;
      method = request.method;
      jwtToken =
        request.cookies?.Authentication || request.headers?.authentication;
    } else if (type === 'graphql') {
      // Handle GraphQL request
      const ctx = GqlExecutionContext.create(context);
      gqlContext = ctx.getContext();
      const gqlInfo = ctx.getInfo();

      // pathKey = gqlInfo.path.key;
      path = gqlContext.req?.url || 'graphql';
      method = 'POST';
      jwtToken =
        gqlContext.req?.cookies?.Authentication ||
        gqlContext.req?.headers?.authentication;
    } else {
      return false;
    }

    if (!jwtToken) {
      return false;
    }

    try {
      jwt.verify(jwtToken, this.publicKey, { algorithms: ['RS256'] });
    } catch (error) {
      this.logger.warn('JWT verification failed');
      return false;
    }

    return this.authClient
      .send(
        EVENT_NAME_AUTHENTICATE_AND_CHECK_ACCESS,
        new AuthAndCheckAccessRequestEvent(jwtToken, path, method),
      )
      .pipe(
        tap((user) => {
          if (type === 'http') {
            context.switchToHttp().getRequest().user = user;
          } else if (type === 'graphql') {
            gqlContext.req.user = user;
          }
        }),
        map(() => true),
        catchError(() => of(false)),
      );
  }
}

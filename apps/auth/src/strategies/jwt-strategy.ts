import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import { TokenPayload } from '../interfaces/token-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) => {
          return (
            request?.cookies?.Authentication ||
            request?.Authentication ||
            request?.headers?.authentication
          );
        },
      ]),
      secretOrKey: configService
        .get<string>('JWT_PUBLIC_KEY')
        .replace(/\\n/g, '\n'),
      algorithms: ['RS256'],
    });
  }

  async validate({ userId }: TokenPayload) {
    return this.usersService.getUser({ id: userId });
  }
}

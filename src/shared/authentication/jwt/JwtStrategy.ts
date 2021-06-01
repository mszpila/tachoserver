import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtUserDto } from './JwtUserDto';
// import { AuthenticationService } from './AuthenticationService';
import { TokenPayload } from './ITokenPayload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET_KEY'),
      signOptions: {
        expiresIn: configService.get<string | number>('JWT_EXPIRATION_TIME'),
      },
    });
  }

  async validate(payload: TokenPayload): Promise<JwtUserDto> {
    return { id: payload.sub, roles: payload.roles };
  }
}

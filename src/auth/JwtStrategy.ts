import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserDto } from 'src/user/domain/dto/UserDto';
import { AuthService } from './AuthService';
import { JwtPayload } from './IJwtPayload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET_KEY,
    });
  }

  //   async validate(payload: JwtPayload): Promise<UserDto> {
  //     const user = await this.authService.validateUser(payload);
  //     if (!user)
  //       throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
  //     return user;
  //   }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}

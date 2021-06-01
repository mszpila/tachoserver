import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  public async getAccessToken(
    userId: string,
    userRoles: string[],
  ): Promise<any> {
    return {
      access_token: await this.jwtService.signAsync({
        sub: userId,
        roles: userRoles,
      }),
    };
  }
}

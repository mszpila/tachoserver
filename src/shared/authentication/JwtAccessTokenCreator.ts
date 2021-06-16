import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAccessTokenCreator {
  constructor(private readonly jwtService: JwtService) {}

  public async create(userId: string, userRoles: string[]): Promise<any> {
    return {
      access_token: await this.jwtService.signAsync({
        sub: userId,
        roles: userRoles,
      }),
    };
  }
}

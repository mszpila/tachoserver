import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserFacade } from '../user/domain/UserFacade';

@Injectable()
export class AuthService {
  constructor(private userFacade: UserFacade, private jwtService: JwtService) {}

  async validateUser(email: string, password: string): Promise<any> {
    return this.userFacade.login({ email, password });
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

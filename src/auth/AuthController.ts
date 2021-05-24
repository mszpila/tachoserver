import { Controller, Request, Post, UseGuards } from '@nestjs/common';
// import { JwtAuthGuard } from './auth/jwt-auth.guard';
// import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './AuthService';
import { LocalAuthGuard } from './LocalAuthGuards';

@Controller('auth')
export class AppController {
  constructor(private authService: AuthService) {}

  // @Post('register')
  // async register(@Request() req) {
  //   return this.authService.register(req.user);
  // }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  //   @UseGuards(JwtAuthGuard)
  //   @Get('profile')
  //   getProfile(@Request() req) {
  //     return req.user;
  //   }
}

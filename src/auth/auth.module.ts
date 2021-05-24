import { Global, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserFacade } from 'src/user/domain/UserFacade';
import { AuthService } from './AuthService';
import { LocalStrategy } from './LocalStrategy';

@Global()
@Module({
  imports: [
    UserFacade,
    PassportModule,
    JwtModule.register({
      secret: process.env.SECRET_KEY,
      signOptions: {
        expiresIn: process.env.EXPIRES_IN_SECONDS,
      },
    }),
  ],
  controllers: [],
  providers: [AuthService, LocalStrategy, JwtModule],
  exports: [AuthService],
})
export class AuthModule {}

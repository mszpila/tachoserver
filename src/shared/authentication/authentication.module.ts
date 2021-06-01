import { Global, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthenticationService } from './domain/AuthenticationService';
import { JwtStrategy } from './jwt/JwtStrategy';
import { GoogleStrategy } from './oauth/google/GoogleStrategy';

@Global()
@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET_KEY'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION_TIME'),
        },
      }),
    }),
  ],
  providers: [AuthenticationService, JwtStrategy, GoogleStrategy],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}

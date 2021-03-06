import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { UserModule } from './user/user.module';
import { MongoModule } from 'nest-mongodb';
import { AuthenticationModule } from './shared/authentication/authentication.module';
import { validationSchema } from '../config/validationSchema';
import { envFilePath } from '../config/envFilePath';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath,
      validationSchema,
    }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ttl: config.get<number>('THROTTLE_TTL'),
        limit: config.get<number>('THROTTLE_LIMIT'),
      }),
    }),
    EventEmitterModule.forRoot({ global: true }),
    MongoModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('DB_URI'),
        dbName: config.get<string>('DB_NAME'),
        clientOptions: {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        },
      }),
    }),
    AuthenticationModule,
    UserModule,
    EmailModule,
  ],
})
export class AppModule {}

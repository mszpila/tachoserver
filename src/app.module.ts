import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { UserModule } from './user/user.module';
import { MongoModule } from 'nest-mongodb';
import { AuthenticationModule } from './shared/authentication/authentication.module';
import { validationSchema } from './shared/config/validationSchema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', './src/shared/authentication/.env'],
      validationSchema,
    }),
    EventEmitterModule.forRoot({ global: true }),
    MongoModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('DB_URI'),
        dbName: config.get<string>('DB_NAME'),
        clientOptions: {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        },
      }),
      inject: [ConfigService],
    }),
    AuthenticationModule,
    UserModule,
  ],
})
export class AppModule {}

import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { Test } from '@nestjs/testing';
import { MongoModule } from 'nest-mongodb';
import { EmailModule } from '../../../src/email/email.module';
import { envFilePath } from '../../../config/envFilePath';
import { validationSchema } from '../../../config/validationSchema';
import { AuthenticationModule } from '../../../src/shared/authentication/authentication.module';
import { UserModule } from '../../../src/user/user.module';

const moduleInitialization = async () => {
  return await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        envFilePath,
        validationSchema,
      }),
      EventEmitterModule.forRoot({ global: true }),
      MongoModule.forRootAsync({
        useFactory: (config: ConfigService) => ({
          uri: config.get<string>('DB_URI_TEST'),
          dbName: config.get<string>('DB_NAME_TEST'),
          clientOptions: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          },
        }),
        inject: [ConfigService],
      }),
      AuthenticationModule,
      UserModule,
      EmailModule,
    ],
  }).compile();
};

export { moduleInitialization };

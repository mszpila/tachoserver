import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { Test } from '@nestjs/testing';
import { MongoModule } from 'nest-mongodb';
import { UserModule } from '../../../../src/user/user.module';

const moduleInitialization = async () => {
  return await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({ isGlobal: true }),
      EventEmitterModule.forRoot({ global: true }),
      MongoModule.forRoot('mongodb://localhost', 'tachotest', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
      UserModule,
    ],
  }).compile();
};

export { moduleInitialization };

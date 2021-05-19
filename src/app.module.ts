import { Module } from '@nestjs/common';
// import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { UserModule } from './user/user.module';
import { MongoModule } from 'nest-mongodb';

// const dbConfig = {
//   provide: 'CONFIG',
//   useFactory: () => {
//     return process.env.NODE_ENV === 'development' ? 'devConfig' : 'prodConfig';
//   },
// };

@Module({
  imports: [
    // ConfigModule.forRoot({ isGlobal: true }),
    EventEmitterModule.forRoot({ global: true }),
    MongoModule.forRoot('mongodb://localhost', 'tachodev', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
    UserModule,
  ],
  // providers: [dbConfig],
})
export class AppModule {}

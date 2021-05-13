import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/domain/User';
import { UserModule } from './user/user.module';

const dbConfig = {
  provide: 'CONFIG',
  useFactory: () => {
    return process.env.NODE_ENV === 'development' ? 'devConfig' : 'prodConfig';
  },
};

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    EventEmitterModule.forRoot({ global: true }),
    // MongooseModule.forRoot('mongodb://localhost/nest'),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      port: parseInt(process.env.DB_PORT),
      url: process.env.DB_URL,
      username: process.env.USERNAME,
      password: process.env.PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
    }),
    UserModule,
  ],
  providers: [dbConfig],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/domain/User';
import { UserModule } from './user/user.module';
import { MongoModule } from 'nest-mongodb';

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
    MongoModule.forRoot('mongodb://localhost', 'tachotest', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
    // TypeOrmModule.forRoot({
    //   type: 'mongodb',
    //   host: 'localhost',
    //   port: 27017,
    //   database: 'tachotest',
    //   // name: 'default',

    //   // type: 'mongodb',
    //   // port: parseInt(process.env.DB_PORT),
    //   // url: process.env.DB_URL,
    //   // username: process.env.USERNAME,
    //   // password: process.env.PASSWORD,
    //   // database: process.env.DB_NAME,
    //   autoLoadEntities: true,
    //   // entities: [User],
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    // }),
    UserModule,
  ],
  providers: [dbConfig],
})
export class AppModule {}

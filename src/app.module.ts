import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';

const dbConfig = {
  provide: 'CONFIG',
  useFactory: () => {
    return process.env.NODE_ENV === 'development' ? 'devConfig' : 'prodConfig';
  },
};

@Module({
  imports: [UserModule],
  providers: [dbConfig],
})
export class AppModule {}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import * as helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.setGlobalPrefix('/api/v1');
  const configService = app.get(ConfigService);
  app.enableCors({
    origin: configService.get<string>('CORS_WHITELIST').split(','),
  });
  app.use(cookieParser());
  app.use(helmet());
  await app.listen(configService.get<number>('PORT'));
}
bootstrap();

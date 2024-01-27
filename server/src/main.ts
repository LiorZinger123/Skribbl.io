import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors({
    origin: true,
    credentials: true,
  })
  app.use(cookieParser())
  app.use(helmet())
  const configService = app.get(ConfigService)
  const port = configService.get<number>('port')
  await app.listen(port);
}
bootstrap();

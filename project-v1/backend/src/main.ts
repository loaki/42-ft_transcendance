import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  console.log(process.env.POSTGRES_HOST);

  // Protecting endpoints from receiving incorrect data
  app.useGlobalPipes(new ValidationPipe());

  // Use Cookie
  app.use(cookieParser());
  await app.listen(3000);

  console.log('JWT working 2');
  // Display application
  console.log(`Application: "Ft_transcendence" is running on: ${await app.getUrl()}`);
}
bootstrap();

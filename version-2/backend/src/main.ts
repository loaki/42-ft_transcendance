import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as cookieParser from 'cookie-parser';

// import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  // app.enableCors();
  console.log(process.env.POSTGRES_HOST);

  // Protecting endpoints from receiving incorrect data
  app.useGlobalPipes(new ValidationPipe());

  // Use Cookie
  app.use(cookieParser());

  // app.enableCors();
  // CORS
  app.enableCors({
    origin: true,
    // origin: [
    //   `http://localhost/`,
    //   `http://localhost/80/`,
    //   `http://localhost/8080/`,
    // ],
    credentials: true,

  });

  await app.listen(3000);


  console.log('backend is running');
  // console.log('JWT working 2');
  // Display application
  console.log(`Application: "Ft_transcendence" is running on: ${await app.getUrl()}`);
}
bootstrap();

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// For Database
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';


  // Import User's database
import { User } from './user/user.entity'
import { UsersModule } from './user/user.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthentificationService } from './authentification/authentification.service';
import { AuthentificationModule } from './authentification/authentification.module';
import * as Joi from 'joi';

import { GamesModule } from './games/games.module'



@Module({
  imports: [
    ServeStaticModule.forRoot({       // pour SPA
      rootPath: join(__dirname, '..', 'client'),
    }),
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.string().required(),
      }),
      isGlobal: true, 
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({    // Allow to wait until the connection to the database is ready before accepting request
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: +configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        entities: [User],
        synchronize: true, // For production should be false
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthentificationModule,
    GamesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

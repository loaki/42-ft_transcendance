import { Module } from '@nestjs/common';
import { UsersModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { AuthentificationService } from './authentification.service';
import { AuthentificationController } from './authentification.controller';
import { LocalStrategy } from './local.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({
    imports: [UsersModule, PassportModule, ConfigModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get('JWT_SECRET'),
                signOptions: {
                    expiresIn: `${configService.get('JWT_EXPIRATION_TIME')}s`,
                },
            }),
        })],
    providers: [AuthentificationService, LocalStrategy, JwtStrategy],
    controllers: [AuthentificationController],
    exports: [AuthentificationService]
})
export class AuthentificationModule {}

import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { UserService } from 'src/user/user.service';
import TokenPayload2Auth from './tokenPayload2Auth.interface';

// 2 auth
@Injectable()
export class JwtTwoFactorStrategy extends PassportStrategy(
    Strategy,
    'jwt-two-factor'
) {
    constructor(
        private readonly configService: ConfigService,
        private readonly userService: UserService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
                return request?.cookies?.Authentification;
            }]),
            secretOrKey: configService.get('JWT_ACCESS_TOKEN_SECRET') // a rajouter
        });
    }

    async validate(payload: TokenPayload2Auth) {
        const user = await this.userService.getById(payload.userId);
        if (!user.isTwoFactorAuthentificationEnabled) {
            return user;
        }
        if (payload.isSecondFactor) {
            return user;
        }
    }
}
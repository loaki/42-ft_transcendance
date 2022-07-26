import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';


import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.entity';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { toFileStream }  from 'qrcode';


@Injectable()
export class TwoFactorAuthentificationService {

    constructor (
        private readonly userService: UserService,
        private readonly configService: ConfigService,
    ) {}
   
    public async generateTwoFactorAuthentification(user: User) {

        const secret = "lol";
        const otpauthUrl = "lol";
        // const secret = authenticator.generateSecret();
        // const otpauthUrl = authenticator.keyuri(user.firstName, this.configService.get('TWO_FACTOR_AUTHENTICATION_APP_NAME'), secret);
        console.log('avant await');
        await this.userService.setTwoFactorAuthenticationSecret(secret, user.id);
        return {
            secret,
            otpauthUrl
        }
    }

    // return qrcode to png
    public async pipeQrCodeStream(stream: Response, otpauthUrl: string) {
        return toFileStream(stream, otpauthUrl);
    }


    public isTwoFactorCodeValid(twoFactorCode: string, user: User) {
        console.log('twofactor = ', twoFactorCode);
        console.log('user = ', user);

        try {
            const isValid = authenticator.verify({
                token: twoFactorCode,
                secret: user.twoFactorAuthenticationSecret
            });
            return isValid;
        } catch (err) {
            console.log(err);
        }
        
    }


}
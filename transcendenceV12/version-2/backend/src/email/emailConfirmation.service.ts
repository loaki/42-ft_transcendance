import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import VerificationTokenPayload  from 'src/email/verificationTokenPayload.interface'

export class EmailConfirmationService {

    constructor (

        private readonly configService: ConfigService,
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {}

    public sendVerificationLink(email: string) {
        
        const payload: VerificationTokenPayload = { email }
        const token = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
            expiresIn: `${this.configService.get('JWT_VERIFICATION_TOKEN_EXPIRATION_TIME')}s`
        });

        const url = `${this.configService.get('EMAIL_CONFIRMATION_URL')}?token=${token}`;

        const text = `Welcolme to Ft_transcendence app. To confirm your email address, click here: ${url}`;

        // return this.emailService.sendMail({
        //     to: email,
        //     subject: 'Email confirmation, Ft_transcendence',
        //     text,
        // })
    }
}
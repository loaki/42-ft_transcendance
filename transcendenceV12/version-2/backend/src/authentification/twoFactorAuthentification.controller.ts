import { UnauthorizedException, Get, ClassSerializerInterceptor, Controller, Header, Post, UseInterceptors, Res,  UseGuards, Req, HttpCode, Body, ValidationPipe, } from '@nestjs/common';
import { TwoFactorAuthentificationService } from './twoFactorAuthentification.service';
import { Response } from 'express';
import JwtAuthenticationGuard from './jwt-authentification.guard'
import RequestWithUser from './requestWithUser.interface';

import { TwoFaAuthDto } from './two-factor.dto';
import { UserService } from 'src/user/user.service';
import { AuthentificationService } from './authentification.service';

@Controller('2fa')
@UseInterceptors(ClassSerializerInterceptor)
export class TwoFactorAuthenticationController {

    constructor(
        private readonly twoFactorAuthenticationService: TwoFactorAuthentificationService,
        private readonly userService: UserService,
        private readonly authentificateService: AuthentificationService,
    ) {}

    @Get('lol')
    async lol() {
        return 'lol';
    }

    @Post('generate')
    @UseGuards(JwtAuthenticationGuard)
    async register(@Res() response: Response, @Req() request: RequestWithUser) {

        console.log('ici = ', request.user);
        const { otpauthUrl } = await this.twoFactorAuthenticationService.generateTwoFactorAuthentification(request.user);
        response.setHeader("content-type","image/png");
        return this.twoFactorAuthenticationService.pipeQrCodeStream(response, otpauthUrl);
        // return "lol";
    }


    @Post('turn-on')
    @HttpCode(200)
    @UseGuards(JwtAuthenticationGuard)
    async turnTwoFactor(@Req() request: RequestWithUser, @Body(ValidationPipe) {code}: TwoFaAuthDto) {

        console.log('code = ', code);
        const isCodeValid = this.twoFactorAuthenticationService.isTwoFactorCodeValid(code, request.user);
        console.log('isvalid = ', isCodeValid);
        if (!isCodeValid)
            throw new UnauthorizedException('Wrong authentication code');
        await this.userService.turnOnTwoFactor(request.user.id);

        console.log("GOOOOOD");
        
    }

    @Post('authenticate')
    @HttpCode(200)
    @UseGuards(JwtAuthenticationGuard)
    async authenticate( @Req() request: RequestWithUser, @Body(ValidationPipe) {code}: TwoFaAuthDto) {
    
        const isCodeValid = this.twoFactorAuthenticationService.isTwoFactorCodeValid(code, request.user);
        if (!isCodeValid)
            throw new UnauthorizedException('Wrong authentication code');

        //get new cookie
        const accessTokenCookie = this.authentificateService.getCookieWithJwtTokenRefresh(request.user.id, true);

        request.res.setHeader('Set-Cookie', [accessTokenCookie]);

        return request.user;
    }
}
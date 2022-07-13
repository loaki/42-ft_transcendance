import { Body, Req, Controller, HttpCode, Post, UseGuards, Res, UseInterceptors, Headers } from '@nestjs/common';
import { AuthentificationService } from './authentification.service';
import RegisterDto from './create-register.dto';
import { LocalAuthenticationGuard } from './localAuthentification.guard';
import RequestWithUser  from './requestWithUser.interface'

import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';


import { IsString, IsNotEmpty, IsEmail, IsOptional, IsEnum } from "class-validator";
export class testDTO {
    // @IsString()
    // @IsNotEmpty()
    firstName: string;

    // @IsString()
    // @IsNotEmpty()
    lastName: string;


    // @IsString()
    // @IsNotEmpty()
    password: string;
  }
  
  export default testDTO;


@Controller('authentification')
export class AuthentificationController {
    constructor(
        private readonly authentificationService: AuthentificationService
    ) {}

    @Post('test')
    @UseInterceptors(FileInterceptor('file'))
    test(@Body() body: testDTO, @Headers() headers) {

        console.log('ici');
        console.log('gilr = ' + body.password);
        console.log('header = ' + headers + "\n");
    }

    @Post('register')
    @UseInterceptors(FileInterceptor('files'))
    async RegisterDto(@Body() registrationData: RegisterDto, files: Array<Express.Multer.File>) {
        console.log('test' + files);
        console.log('data recieve = ' + registrationData);
        console.log('ici');
        return this.authentificationService.register(registrationData);
    }

    @HttpCode(200)
    @UseGuards(LocalAuthenticationGuard)
    @Post('log-in')
    async login(@Req() request: RequestWithUser, @Res() response: Response) {
        
        console.log('la');
        const {user} = request;
        const cookie = this.authentificationService.getCookieWithJwtToken(user.id);
        response.setHeader('Set-Cookie', cookie);
        // response.set('Set-Cookie', cookie);
        user.password = undefined;
        // fonction ppour mettre l'utilisateur a connecte
        user.isConnected = true;
        return response.send(user);
    }
}

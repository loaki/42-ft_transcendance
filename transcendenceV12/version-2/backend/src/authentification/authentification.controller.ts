import { BadGatewayException, Injectable, Get, Body, Req, Controller, HttpCode, Post, UseGuards, Res, UseInterceptors, ExecutionContext, Query, Redirect, BadRequestException, Logger, Param } from '@nestjs/common';
import { AuthentificationService } from './authentification.service';

import { LocalAuthenticationGuard } from './localAuthentification.guard';
import RequestWithUser  from './requestWithUser.interface'

import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

import JwtAuthenticationGuard from 'src/authentification/jwt-authentification.guard';
import { Status } from 'src/global/global.enum';

import {RegisterAsGuestDTO, RegisterDto} from './create-register.dto';
import { UserService } from 'src/user/user.service';






@Controller('authentification')
export class AuthentificationController {
    constructor(
        private readonly authentificationService: AuthentificationService,
        private readonly userService: UserService
    ) {}


    @Get('test')
    @Redirect()
    async connection42(@Query() query: {code: string; state: string}) {
  
        if (query.state != "01234567899876543210") {
            throw new BadRequestException('Error code state.');
        }
        const user42 = await this.authentificationService.register42(query.code, query.state).catch((e) => {
            new Logger('AuthCallBack').debug(e);
        });
        if (!user42) {
            throw new BadGatewayException('Cannot connect a user with 42 API');
        }
        return { url: 'http://localhost:8080/profile' };
        
    }


    // register guest
    @Post('registerguest')
    @UseInterceptors(FileInterceptor('files'))
    async registerAsGuest(@Body() reg: RegisterAsGuestDTO, files: Array<Express.Multer.File>) {
        console.log('creaation guest');
        return this.authentificationService.registerAsGuest(reg);
    }


    // login guest
    @HttpCode(200)
    // @UseGuards(LocalAuthenticationGuard)
    @Post('login')
    async loginguest(@Body() jordy, @Res() response: Response) {

        console.log('ids = ', jordy);
        console.log('jordy = ', jordy.id);

        const cookie = this.authentificationService.getCookieWithJwtToken(jordy.id);
        console.log(cookie);
        response.setHeader('Set-Cookie', cookie);
        // Get all data
        const user = await this.userService.getLogin42(jordy.login42);
        user.status = Status.ONLINE;
        return response.send({ user })
    }

    // Allow a use to register (without 42)
    // It needs firstName, lastName, password
    @Post('register')
    @UseInterceptors(FileInterceptor('files'))
    async RegisterDto(@Body() registrationData: RegisterDto, files: Array<Express.Multer.File>) {
        
        // return this.authentificationService.register(registrationData);
    }

    // Allow a registered user to login
    // It needs firstName, lastName, password.
    // then it returns a cookie.
    @HttpCode(200)
    @UseGuards(LocalAuthenticationGuard)
    @Post('log-in')
    async login(@Req() request: RequestWithUser, @Res() response: Response) {
        
        console.log('la');
        const {user} = request;
        const cookie = this.authentificationService.getCookieWithJwtToken(user.id);
        response.setHeader('Set-Cookie', cookie);
        // user.password = undefined; // a changer
        user.status = Status.ONLINE;
        return response.send(user);
    }


    // Logout
    @UseGuards(JwtAuthenticationGuard)
    @Post('logout')
    async logout(@Res() response: Response) {

       
        console.log('ESSAIE DE LOGOUT');
        response.setHeader('Set-Cookie', this.authentificationService.getCookieForLogOut());
        return response.sendStatus(200);
    }

    // check cookie
    @UseGuards(JwtAuthenticationGuard)
    @Get()
    authenticate(@Req() request: RequestWithUser) {
      const user = request.user;
    //   user.password = undefined;
      return user;
    }
}

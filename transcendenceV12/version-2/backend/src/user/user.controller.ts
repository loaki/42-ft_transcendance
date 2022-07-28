import { Controller, Get, Post, Delete, Param, Body, Inject, ValidationPipe, ParseUUIDPipe, UseInterceptors, UploadedFile, HttpException, HttpStatus, BadRequestException, Req, UseGuards, Put } from '@nestjs/common';
// import ( FileInterceptor ) from '@nestjs/platform-express';
import { Express } from 'express'
import { BioDTO, EmailDTO, PseudoDTO } from './create-user.dto';
import { UserService } from './user.service';
import { User } from './user.entity'

import { FileInterceptor, MulterModule } from '@nestjs/platform-express';
import 'multer';

import { multerOptions } from './multer.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { createBrotliCompress } from 'zlib';
import LocalFilesInterceptor from './localFiles/localFiles.interceptor';
import JwtAuthenticationGuard from 'src/authentification/jwt-authentification.guard';

import  JwtTwoFactorGuard  from 'src/authentification/jwt-two-factor.guard';

// Need to create UserDTO to have a schema to duplicate
// https://docs.nestjs.com/controllers
@Controller('user')
export class UserController {

    @Inject(UserService)
    public readonly userService: UserService;

    /*
    **  GET
    */

        ////////////////////////////////////////
    // Find all users
    @Get('/')
    @UseGuards(JwtAuthenticationGuard)
    findAllUser(): Promise<User[]> {
        console.log('bingo');
        // console.log(process.env.MAX_FILE_SIZE);
        return this.userService.findAllUser();
    }


    

    // Find all informations from an uuid if the user exist     
    @Get(':id')
    @UseGuards(JwtAuthenticationGuard)
    findUserById(@Param('id', ParseUUIDPipe) id: string): Promise<User> {
        return this.userService.findUserById(id);
    }


    @Get('login/:name')
    getUserByLogin(@Param('name', ValidationPipe) name: string): Promise<User> {
        
        return this.userService.findUserByLogin(name);
    }

    //////////////////////////////////////
    //  Get single information from a user
    // @Get('/:uuid/firstname')
    // @UseGuards(JwtAuthenticationGuard)
    // getFirstName(@Param('uuid', ParseUUIDPipe) uuid: string) {
    //     return this.userService.getFirstName(uuid);
    // }

    // @Get('/:uuid/lastname')
    // @UseGuards(JwtAuthenticationGuard)
    // getLastName(@Param('uuid', ParseUUIDPipe) uuid: string) {
    //     return this.userService.getLastName(uuid);
    // }

    // @Get('/:uuid/biography')
    // @UseGuards(JwtAuthenticationGuard)
    // getBiography(@Param('uuid', ParseUUIDPipe) uuid: string) {
    //     return this.userService.getBiography(uuid);
    // }

    // @Get('/:uuid/pseudo')
    // @UseGuards(JwtAuthenticationGuard)
    // getPseudo(@Param('uuid', ParseUUIDPipe) uuid: string) {
    //     return this.userService.getPseudo(uuid);
    // }


    // // test need 2auth to change
    // @Get('/:uuid/email')
    // // @UseGuards(JwtAuthenticationGuard)
    // @UseGuards(JwtTwoFactorGuard)
    // getEmail(@Param('uuid', ParseUUIDPipe) uuid: string) {
    //     return this.userService.getEmail(uuid);
    // }



































    // @Get('/search/firstname/:name')
    // @UseGuards(JwtAuthenticationGuard)
    // async findUserByfirstName(@Param('name', ValidationPipe) name: string): Promise<User> {
    //     return this.userService.findUserByfirstName(name);
    // }

    // @Get('/search/lastname/:name')
    // @UseGuards(JwtAuthenticationGuard)
    // async findUserBylastName(@Param('name', ValidationPipe) name: string): Promise<User> {
    //     return this.userService.findUserBylastName(name);
    // }

    // // test authentification
    // @Get('/search/:all')
    // @UseGuards(JwtAuthenticationGuard)
    // async findUser(@Param('all', ValidationPipe) all: string): Promise<User[]> {
    //     console.log('goodd');
    //     return this.userService.findUser(all);
    // }

    /*
    **  POST
    */
    @Post('/upload/:id')
    @UseGuards(JwtAuthenticationGuard)
    @UseInterceptors(LocalFilesInterceptor({
        fieldName: 'file',
        path: '/avatars',
        fileFilter: (req: any, file: any, cb: any) => {
            if (file.mimetype.includes('image'))
                cb(null, true);
            else
                cb( new HttpException(`Unsupported file type Ahahah ${extname(file.originalname)}`, HttpStatus.BAD_REQUEST), false);
        },
        limits: {
            fileSize: Math.pow(1024, 2) // 1MB
        }
    }))
    async uploadFile(@Param('id', ParseUUIDPipe) id: string, @UploadedFile() file) {
        
        if (id) // need to be chang with authentification
        {
            console.log("ici");
            if (file)
            {
                console.log('On recoit un fichier ');
                console.log(file.name);
                console.log(file.mimetype);
                console.log(file.originalname);
                return this.userService.addAvatar(id, {
                    path: file.path,
                    filename: file.originalname,
                    mimetype: file.mimetype
                });
            }
        }
    }


    // test add friend A TERMINER
    @Post('/friend/:id/:name')
    addFriend(@Param('id', ParseUUIDPipe) id: string, @Param('name') name: string) {
        console.log('Post add friend: ', name, " et id = " , id);
        this.userService.addFriend(id, name);
    }



    // @Put('/online')
    // @UseGuards(JwtAuthenticationGuard)
    // async putOnline(@Body() login42: string) {
    //     return this.userService.putOnline(login42);
    // }



    // //////////////////////// PUT /////////////////////////
    // @Put('/:uuid/pseudo')
    // @UseGuards(JwtAuthenticationGuard)
    // async putPseudo(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() newPseudo: PseudoDTO) {
    //     return this.userService.updatePseudo(uuid, newPseudo);
    // }

    // @Put('/:uuid/biography')
    // @UseGuards(JwtAuthenticationGuard)
    // async putBiography(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() newBio: BioDTO) {
    //     return this.userService.updateBiography(uuid, newBio);
    // }

    // @Put('/:uuid/email')
    // @UseGuards(JwtAuthenticationGuard)
    // async putEmail(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() newEmail: EmailDTO) {
    //     return this.userService.updateEmail(uuid, newEmail);
    // }






















    //////////////////////// DELETE /////////////////////////
    @Delete(':id')
    removeUser(@Param('id', ParseUUIDPipe) id: string) {
        console.log('User: ' + id + ' deleted!');
        return this.userService.removeUser(id);
    }

}



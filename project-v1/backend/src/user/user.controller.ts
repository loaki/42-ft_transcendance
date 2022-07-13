import { Controller, Get, Post, Delete, Param, Body, Inject, ValidationPipe, ParseUUIDPipe, UseInterceptors, UploadedFile, HttpException, HttpStatus, BadRequestException, Req, UseGuards } from '@nestjs/common';
// import ( FileInterceptor ) from '@nestjs/platform-express';
import { Express } from 'express'
import { CreateUserDto } from './create-user.dto';
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



// Need to create UserDTO to have a schema to duplicate
// https://docs.nestjs.com/controllers
@Controller('user')
export class UserController {

    @Inject(UserService)
    public readonly userService: UserService;

    // Find all users
    @Get('/')
    findAllUser(): Promise<User[]> {
        console.log(process.env.MAX_FILE_SIZE);
        return this.userService.findAllUser();
    }

    // Find all informations from an uuid if the user exist     
    @Get(':id')
    findUserById(@Param('id', ParseUUIDPipe) id: string): Promise<User> {
        return this.userService.findUserById(id);
    }

    // test saaasn aauthentification
    @Get('/search/firstname/:name')
    async findUserByfirstName(@Param('name', ValidationPipe) name: string): Promise<User> {
        return this.userService.findUserByfirstName(name);
    }

    @Get('/search/lastname/:name')
    async findUserBylastName(@Param('name', ValidationPipe) name: string): Promise<User> {
        return this.userService.findUserBylastName(name);
    }

    @Get('/search/:all')
    @UseGuards(JwtAuthenticationGuard)
    async findUser(@Param('all', ValidationPipe) all: string): Promise<User[]> {
        console.log('goodd');
        return this.userService.findUser(all);
    }

    //////////////////////// POST/////////////////////
    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        console.log("data from post : " + createUserDto);
        this.userService.create(createUserDto);
        return 'Test adding new user';
    }
    
  
    
    ///////////////////////////////// test uploading file ///////////////////////////////
    // better with postman
    // curl http://localhost:3000/user/upload -F  'file=@./apple_logo.png' -F 'name=test'
    // curl http://localhost:3000/user/upload -F  'file=@/home/pierre/Pictures/apple_logo.png' -F 'name=test'
   
    @Post('/upload/:id')
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


    //////////////////////// DELETE /////////////////////////
    @Delete(':id')
    removeUser(@Param('id', ParseUUIDPipe) id: string) {
        console.log('User: ' + id + ' deleted!');
        return this.userService.removeUser(id);
    }

}



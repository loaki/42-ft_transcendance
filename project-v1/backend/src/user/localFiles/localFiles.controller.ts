import {
    Controller,
    Get,
    Param,
    UseInterceptors,
    ClassSerializerInterceptor,
    StreamableFile,
    Res,
    ParseIntPipe,
    ParseUUIDPipe,
  } from '@nestjs/common';
  import LocalFilesService from './localFiles.service';
  import { Response } from 'express';
  import { createReadStream } from 'fs';
  import { join } from 'path';
  import { UserController } from '../user.controller';
  
  @Controller('localFiles')
  @UseInterceptors(ClassSerializerInterceptor)
  export default class LocalFilesController {
    constructor(
      private readonly localFilesService: LocalFilesService
    ) {}
  
    // @Get('/:id_user/:id')
    // async getDatabaseFileById(@Param('id', ParseIntPipe) id: number, @Res({ passthrough: true }) response: Response) {
    
    @Get('/:id')
    async getDatabaseFileById(@Param('id', ParseIntPipe) id: string, @Res({ passthrough: true }) response: Response) {
      
      const file = await this.localFilesService.getFileById(id);
      console.log("file = " + file + "\n");
  
      const stream = createReadStream(join(process.cwd(), file.path));
      console.log("stream: " + stream + "\n");

      console.log('good');
      response.set({
        'Content-Disposition': `inline; filename="${file.filename}"`,
        'Content-Type': file.mimetype
      })
      console.log("test name = " + file.filename);
      console.log('good2');
      return new StreamableFile(stream);
    }
  }
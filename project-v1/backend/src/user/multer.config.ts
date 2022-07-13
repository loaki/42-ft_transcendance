import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

import { env } from 'process'
// Multer's options needed to upload file, aka avatar
export let multerOptions = {

    // size limits
    limits: {
        // fileSize: 2000,                      // works, payload to large
        // fileSize: Infinity,                  // works
        fileSize: +process.env.MAX_FILE_SIZE,   // doesn't work... why ?
    },
    //  Checks mimetypes

}
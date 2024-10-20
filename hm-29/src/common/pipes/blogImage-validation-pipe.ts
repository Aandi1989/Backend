import { Injectable, BadRequestException, PipeTransform } from '@nestjs/common';
import * as sharp from 'sharp';
import { Express } from 'express';

@Injectable()
export class BlogImageValidationPipe implements PipeTransform {
    async transform(file: Express.Multer.File) {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!allowedMimeTypes.includes(file.mimetype)) {
            throw new BadRequestException('File type must be png, jpg, or jpeg');
        }

        if (file.size > 100 * 1024) { // 100 KB in bytes
            throw new BadRequestException('File size exceeds 100 KB');
        }

        let metadata;
        try {
            metadata = await sharp(file.buffer).metadata();
        } catch (error) {
            throw new BadRequestException('Invalid image file');
        }


        const { width, height } = metadata;

        if (width! != 156 || height! != 156) {
            throw new BadRequestException(`Image must be 156x156px for blog image.`);
        }

        return file;
    }
}


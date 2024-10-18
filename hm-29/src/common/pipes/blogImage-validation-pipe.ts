import { Injectable, BadRequestException, PipeTransform } from '@nestjs/common';
import * as sharp from 'sharp';
import { Express } from 'express';

@Injectable()
export class BlogImageValidationPipe implements PipeTransform {
    async transform(file: Express.Multer.File) {
        if (file.size > 100 * 1024) { // 100 KB in bytes
            throw new BadRequestException('File size exceeds 100 KB');
        }

        const metadata = await sharp(file.buffer).metadata();
        const format = metadata.format;

        const allowedFormats = ['jpeg', 'png', 'jpg'];
        
        if (typeof format !== 'string' || !allowedFormats.includes(format)) {
            throw new BadRequestException('File type must be png, jpg, or jpeg');
        }

        const { width, height } = metadata;

        if (width! > 156 || height! > 156) {
            throw new BadRequestException(`Image must be 156x156px for blog image.`);
        }

        return file;
    }
}


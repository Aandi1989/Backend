import { ICommand } from "@nestjs/cqrs";
import { Express } from 'express';
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BadRequestException } from "@nestjs/common";
import { PutObjectCommand, PutObjectCommandOutput, S3Client } from "@aws-sdk/client-s3";
import { S3Service } from "../../../../common/services/s3-service";
import * as sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import { BlogsQueryRepo } from "../../repo/blogs.query.repository";
import { BlogsRepository } from "../../repo/blogs.repository";
import { ResultCode } from "../../../../common/types/types";
import { ImageType } from "../../types/types";


export class UploadBlogImageCommand implements ICommand {
    constructor(
        public readonly file: Express.Multer.File, 
        public readonly blogId: string,
        public readonly userId: string
    ) {}
}


@CommandHandler(UploadBlogImageCommand)
export class UploadBlogImageUseCase implements ICommandHandler<UploadBlogImageCommand> {
    constructor(protected s3Service: S3Service,
                protected blogsQueryRepo: BlogsQueryRepo,
                protected blogsRepository: BlogsRepository,
    ){}

    async execute(command: UploadBlogImageCommand){
        const { file, blogId, userId } = command;

        if (!file) throw new BadRequestException('No file uploaded');

        const blog = await this.blogsQueryRepo.findBlogById(blogId);
        if(!blog) return { code: ResultCode.Failed };
        if(blog && blog.ownerId !== userId) return { code: ResultCode.Forbidden };

        // image original size 
        const keyOriginal = `content/blogs/${blogId}/images/original.png`;
        const metadataOriginal = await sharp(file.buffer).metadata();      
        const uploadOriginalResult: PutObjectCommandOutput = await this.uploadToS3(keyOriginal, file.buffer, 'image/png');
        if(uploadOriginalResult.$metadata.httpStatusCode != 200) return { code: ResultCode.Failed };
        
        const url = `https://incubatorproject.storage.yandexcloud.net/${keyOriginal}`;
        const image = this.createImage(blogId, url, metadataOriginal.width!, 
            metadataOriginal.height!, file.size, 'original');
        const insertedImageDb = await this.blogsRepository.upsertBlogImage(image);
        if(!insertedImageDb) return { code: ResultCode.Failed };

        // image middle size
        const keyMiddle = `content/blogs/${blogId}/images/middle.png`;
        const imageBufferMiddle = await sharp(file.buffer).resize(100, 100).toBuffer();
        const imageSizeMiddle = Buffer.byteLength(imageBufferMiddle);
        const uploadMiddleResult: PutObjectCommandOutput = await this.uploadToS3(keyMiddle, imageBufferMiddle, 'image/png');
        if(uploadMiddleResult.$metadata.httpStatusCode != 200) return { code: ResultCode.Failed };
        
        const urlMiddle = `https://incubatorproject.storage.yandexcloud.net/${keyMiddle}`;
        const imageMiddle = this.createImage(blogId, urlMiddle, 100, 100, imageSizeMiddle, 'middle');
        const insertedMiddleImageDb = await this.blogsRepository.upsertBlogImage(imageMiddle);
        if(!insertedMiddleImageDb) return { code: ResultCode.Failed };

        // image small size
        const keySmall = `content/blogs/${blogId}/images/small.png`;
        const imageBufferSmall = await sharp(file.buffer).resize(50, 50).toBuffer();
        const imageSizeSmall = Buffer.byteLength(imageBufferSmall);
        const uploadSmallResult: PutObjectCommandOutput = await this.uploadToS3(keySmall, imageBufferSmall, 'image/png');
        if(uploadSmallResult.$metadata.httpStatusCode != 200) return { code: ResultCode.Failed };

        const urlSmall = `https://incubatorproject.storage.yandexcloud.net/${keySmall}`;
        const imageSmall = this.createImage(blogId, urlSmall, 50, 50, imageSizeSmall, 'small');
        const insertedSmallImageDb = await this.blogsRepository.upsertBlogImage(imageSmall);
        if(!insertedSmallImageDb) return { code: ResultCode.Failed };

        const wallpaperImage = await this.blogsQueryRepo.getBlogWallpaperImage(blogId);

        const resultObject = {
            "wallpaper": wallpaperImage,
            "main": [
                {url, width: metadataOriginal.width!, height: metadataOriginal.height!, fileSize: file.size},
                {url: urlMiddle, width: 100, height: 100, fileSize: imageSizeMiddle},
                {url: urlSmall, width: 50, height: 50, fileSize: imageSizeSmall}
            ]
        };

        return { code: ResultCode.Success, data: resultObject };

        // const mediumImageBuffer = await sharp(file.buffer)
        //     .resize(20,80)
        //     .toBuffer();

        // const mediumImageSize = Buffer.byteLength(mediumImageBuffer);

        // const uploadResult: PutObjectCommandOutput = await this.uploadToS3(key, mediumImageBuffer, 'image/png');
        // return { 
        //             url: `https://incubatorproject.storage.yandexcloud.net/${key}`, 
        //             fileId: uploadResult.ETag,
        //             filiSize: file.size,
        //             fileSizeAfterResizing: mediumImageSize,
        //         };
        
    }

    private createImage(blogId: string, url: string, width: number, 
        height: number, fileSize: number, imageType: string ):ImageType{
        return {
            id: uuidv4(),
            blogId,
            url,
            width,
            height,
            fileSize,
            imageType
        }
    }

    private async uploadToS3(key: string, buffer: Buffer, contentType: string): Promise<PutObjectCommandOutput> {
        const bucketParams = {
            Bucket: "incubatorproject",
            Key: key,
            Body: buffer,
            ContentType: contentType
        };
        const s3command = new PutObjectCommand(bucketParams);
        try {
            return await this.s3Service.getClient().send(s3command);
        } catch (error) {
            console.log('Error trying to upload image:', error);
            throw new BadRequestException('Error uploading image');
        }
    }
}
/*
by this url we can get our image
https://incubatorproject.storage.yandexcloud.net/content/blogs/07e2259c-d776-4b08-a2e5-d6bc08af8fb9/images/07e2259c-d776-4b08-a2e5-d6bc08af8fb9_image.png

where:
    incubatorproject - name of bucket
    https://storage.yandexcloud.net - value that we set as endpoint creating new S3Client
    /content/blogs/07e2259c-d776-4b08-a2e5-d6bc08af8fb9/images/07e2259c-d776-4b08-a2e5-d6bc08af8fb9_image.png
     -- value of key in bucketParams
*/

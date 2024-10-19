import { ICommand } from "@nestjs/cqrs";
import { Express } from 'express';
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BadRequestException } from "@nestjs/common";
import { PutObjectCommand, PutObjectCommandOutput, S3Client } from "@aws-sdk/client-s3";
import { S3Service } from "../../../../common/services/s3-service";
import * as sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import { BlogsQueryRepo } from "../../repo/blogs.query.repository";
import { Result, ResultCode } from "../../../../common/types/types";
import { ImageType } from "../../types/types";
import { BlogsRepository } from "../../repo/blogs.repository";


export class UploadBlogWallpaperCommand implements ICommand {
    constructor(
        public readonly file: Express.Multer.File, 
        public readonly blogId: string,
        public readonly userId: string
    ) {}
}


@CommandHandler(UploadBlogWallpaperCommand)
export class UploadBlogWallpaperUseCase implements ICommandHandler<UploadBlogWallpaperCommand> {
    constructor(protected s3Service: S3Service,
                protected blogsQueryRepo: BlogsQueryRepo,
                protected blogsRepository: BlogsRepository,
    ){}

    async execute(command: UploadBlogWallpaperCommand): Promise<Result>{
        const { file, blogId, userId } = command;

        if (!file) throw new BadRequestException('No file uploaded');

        const blog = await this.blogsQueryRepo.findBlogById(blogId);
        if(!blog) return { code: ResultCode.Failed };
        if(blog && blog.ownerId !== userId) return { code: ResultCode.Forbidden };

        const key = `content/blogs/${blogId}/images/wallpaper.png`;
        const metadata = await sharp(file.buffer).metadata();      
        const uploadResult: PutObjectCommandOutput = await this.uploadToS3(key, file.buffer, 'image/png');
        if(uploadResult.$metadata.httpStatusCode != 200) return { code: ResultCode.Failed };
        
        const url = `https://incubatorproject.storage.yandexcloud.net/${key}`;
        const image = this.createImage(blogId, url, metadata.width!, metadata.height!, file.size);
        const insertedImageDb = await this.blogsRepository.upsertBlogImage(image);
        if(!insertedImageDb) return { code: ResultCode.Failed };

        const mainImages = await this.blogsQueryRepo.getBlogMainImages(blogId);

        const resultObject = {
            "wallpaper":{
                url,
                width: metadata.width!,
                height: metadata.height!,
                fileSize: file.size 
            },
            "main": mainImages
        };

        return {code: ResultCode.Success, data: resultObject};
    }

    private createImage(blogId: string, url: string, width: number, 
        height: number, fileSize: number ):ImageType{
        return {
            id: uuidv4(),
            blogId,
            url,
            width,
            height,
            fileSize,
            imageType: 'wallpaper'
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

import { ICommand } from "@nestjs/cqrs";
import { Express } from 'express';
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BadRequestException } from "@nestjs/common";
import { PutObjectCommand, PutObjectCommandOutput, S3Client } from "@aws-sdk/client-s3";
import { S3Service } from "../../../../common/services/s3-service";
import * as sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import { ResultCode } from "../../../../common/types/types";
import { ImageType } from "../../types/types";
import { PostsRepository } from "../../../posts/repo/posts.repository";
import { PostsQueryRepo } from "../../../posts/repo/posts.query.repository";


export class UploadPostImageCommand implements ICommand {
    constructor(
        public readonly file: Express.Multer.File, 
        public readonly blogId: string,
        public readonly postId: string,
        public readonly userId: string
    ) {}
}


@CommandHandler(UploadPostImageCommand)
export class UploadPostImageUseCase implements ICommandHandler<UploadPostImageCommand> {
    constructor(protected s3Service: S3Service,
                protected postsRepository: PostsRepository,
                protected postsQueryRepo: PostsQueryRepo
    ){}

    async execute(command: UploadPostImageCommand){
        const { file, blogId, postId, userId } = command;

        if (!file) throw new BadRequestException('No file uploaded');

        const post = await this.postsQueryRepo.getPostForChange(blogId, postId);
        if(!post) return { code: ResultCode.Failed };
        if(post && post.ownerId !== userId) return { code: ResultCode.Forbidden };

        //Image types and their dimensions
        const imageConfigs = [
            { sizeName: 'original', width: null, height: null }, // original size
            { sizeName: 'middle', width: 300, height: 180 },
            { sizeName: 'small', width: 149, height: 96 },
        ];

        const uploadResults = await Promise.all(imageConfigs.map(config => 
            this.processAndUploadImage(file, postId, config.sizeName, config.width, config.height)
        ));

        if (uploadResults.some(result => result.uploadFailed)) {
            return { code: ResultCode.Failed };
        };

        // Insert into DB
        for (const result of uploadResults) {
            const { url, width, height, fileSize, sizeName } = result;
            const image = this.createImage(postId, url!, width!, height!, fileSize!, sizeName!);
            const insertedImageDb = await this.postsRepository.upsertPostImage(image);
            if (!insertedImageDb) return { code: ResultCode.Failed };
        }

        // Fetch and return result
        const resultObject = {
            "main": uploadResults.map(result => ({
                url: result.url,
                width: result.width,
                height: result.height,
                fileSize: result.fileSize
            }))
        };

        return { code: ResultCode.Success, data: resultObject };      
    }

    private async processAndUploadImage(file: Express.Multer.File, postId: string, sizeName: string, width: number | null, height: number | null) {
        const imageKey = `content/posts/${postId}/images/${sizeName}.png`;

        let imageBuffer = file.buffer;
        let fileSize = file.size;

        if (width && height) {
            imageBuffer = await sharp(file.buffer).resize(width, height).toBuffer();
            fileSize = Buffer.byteLength(imageBuffer);
        }

        const uploadResult: PutObjectCommandOutput = await this.uploadToS3(imageKey, imageBuffer, 'image/png');
        if (uploadResult.$metadata.httpStatusCode !== 200) {
            return { uploadFailed: true };
        }

        const metadata = await sharp(imageBuffer).metadata();

        return {
            url: `https://incubatorproject.storage.yandexcloud.net/${imageKey}`,
            width: metadata.width || width,
            height: metadata.height || height,
            fileSize,
            sizeName,
            uploadFailed: false
        };
    }

    private createImage(postId: string, url: string, width: number, 
        height: number, fileSize: number, imageType: string ):ImageType{
        return {
            id: uuidv4(),
            postId,
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

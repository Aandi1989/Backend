import { ICommand } from "@nestjs/cqrs";
import { Express } from 'express';
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BadRequestException } from "@nestjs/common";
import { PutObjectCommand, PutObjectCommandOutput, S3Client } from "@aws-sdk/client-s3";
import config from '../../../../common/settings/configuration'


export class UploadImageCommand implements ICommand {
    constructor(
        public readonly file: Express.Multer.File, 
        public readonly blogId: string
    ) {}
}


@CommandHandler(UploadImageCommand)
export class UploadImageUseCase implements ICommandHandler<UploadImageCommand> {
    s3Client: S3Client;
    constructor(){
        const REGION = 'us-east-1';
        // Create an Amazon S3 service client object.
        this.s3Client = new S3Client ({
            region: REGION,
            endpoint: 'https://storage.yandexcloud.net',
            credentials: {
                secretAccessKey: config().yandexCloud.YANDEX_SECRET_ACCESS_KEY,
                accessKeyId: config().yandexCloud.YANDEX_ACCESS_KEY_ID
            }
        })
    }

    async execute(command: UploadImageCommand){
        const { file, blogId } = command;

        // Check if file was uploaded
        if (!file) throw new BadRequestException('No file uploaded');

        const key = `content/blogs/${blogId}/images/${blogId}_image.png`;
        const bucketParams = {
            Bucket: "incubatorproject",
            Key: key,
            Body: file.buffer,
            ContentType: 'image/png'
        }
        const s3command = new PutObjectCommand(bucketParams);
        try{
            const uploadResult: PutObjectCommandOutput = await this.s3Client.send(s3command);
            return { 
                url: `https://incubatorproject.storage.yandexcloud.net/${key}`, 
                fileId: uploadResult.ETag 
            };
        }catch(error){
            console.log('Error trying to upload image:', error)
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

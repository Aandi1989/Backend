import { ICommand } from "@nestjs/cqrs";
import { Express } from 'express';
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { S3Service } from "../../../../common/services/s3-service";


export class DeleteImageCommand implements ICommand {
    constructor(
        public readonly key: string
    ) {}
}


@CommandHandler(DeleteImageCommand)
export class DeleteImageUseCase implements ICommandHandler<DeleteImageCommand> {
    constructor(protected s3Service: S3Service){}

    async execute(command: DeleteImageCommand){
        const bucketParams = {
            Bucket: "incubatorproject",
            /*below must be key from command.key*/
            Key: "content/blogs/07e2259c-d776-4b08-a2e5-d6bc08af8fb9/images/07e2259c-d776-4b08-a2e5-d6bc08af8fb9_image.png"
        }
        const s3command = new DeleteObjectCommand(bucketParams);
        try{
            const data = await this.s3Service.getClient().send(s3command);
            return data;
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

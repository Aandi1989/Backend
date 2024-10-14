import { ICommand } from "@nestjs/cqrs";
import { Express } from 'express';
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BadRequestException } from "@nestjs/common";
import * as fs from 'fs';
import * as path from 'path';

export class UploadImageCommand implements ICommand {
    constructor(
        public readonly file: Express.Multer.File, 
        public readonly blogId: string
    ) {}
}


@CommandHandler(UploadImageCommand)
export class UploadImageUseCase implements ICommandHandler<UploadImageCommand> {
    async execute(command: UploadImageCommand): Promise<{url: string, id: string}> {
        const { file, blogId } = command;

        // Check if file was uploaded
        if (!file) throw new BadRequestException('No file uploaded');

        // Define the directory where you want to save the image
        const uploadDir = path.join(__dirname, '..', 'uploads', 'blogs', blogId);

        // Create the directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

        // Define the path to save the upload file
        const filePath = path.join(uploadDir, file.originalname);

        // Write the file to the filesystem
        fs.writeFileSync(filePath, file.buffer);

        return {
            url: filePath,
            id: new Date().toString()
        };
    }
}

// src/common/services/s3.service.ts
import { Injectable } from '@nestjs/common';
import { S3Client } from '@aws-sdk/client-s3';
import config from '../settings/configuration';

@Injectable()
export class S3Service {
    private s3Client: S3Client;

    constructor() {
        const REGION = 'us-east-1';
        this.s3Client = new S3Client({
            region: REGION,
            endpoint: 'https://storage.yandexcloud.net',
            credentials: {
                secretAccessKey: config().yandexCloud.YANDEX_SECRET_ACCESS_KEY,
                accessKeyId: config().yandexCloud.YANDEX_ACCESS_KEY_ID,
            },
        });
    }

    getClient(): S3Client {
        return this.s3Client;
    }
}

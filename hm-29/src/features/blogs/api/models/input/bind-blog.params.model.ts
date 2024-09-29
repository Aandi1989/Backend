import { IsUUID } from 'class-validator';

export class BindBlogParams {
    @IsUUID()
    id: string;

    @IsUUID()
    userId: string;
}

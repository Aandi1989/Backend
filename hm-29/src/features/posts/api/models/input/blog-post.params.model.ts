import { IsUUID } from 'class-validator';

export class BlogPostParams {
    @IsUUID()
    blogId: string;

    @IsUUID()
    postId: string;
}
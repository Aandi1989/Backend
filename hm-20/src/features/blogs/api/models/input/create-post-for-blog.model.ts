import { Length, IsString, IsNotEmpty, IsOptional } from "class-validator"
import { Trim } from "src/common/pipes/trim-pipe"

export class CreatePostForBlogModel  {
    @Trim()
    @Length(3,30)
    @IsString()
    title: string

    @Trim()
    @Length(5,100)
    @IsString()
    shortDescription: string

    @Trim()
    @Length(5,1000)
    @IsString()
    content: string

    @IsOptional()
    @IsString()
    blogName?: string
}
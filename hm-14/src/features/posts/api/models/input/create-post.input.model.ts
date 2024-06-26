import { Length, IsString, IsNotEmpty, IsOptional } from "class-validator"
import { Trim } from "src/common/pipes/trim-pipe"

export class CreatePostModel  {
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

    @IsString()
    @IsNotEmpty()
    @Length(6,30)
    blogId: string

    @IsOptional()
    @IsString()
    blogName?: string
}
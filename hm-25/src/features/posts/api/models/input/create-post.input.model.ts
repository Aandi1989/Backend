import { Length, IsString, IsNotEmpty, IsOptional } from "class-validator"
import { Trim } from "../../../../../common/pipes/trim-pipe"


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
    @Length(6,40) // in swager max lenth 30, we use 40 as uuid() dosn't pass validation
    blogId: string

    @IsOptional()
    @IsString()
    blogName?: string
}
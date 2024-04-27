import { Length, IsString, IsNotEmpty, IsOptional } from "class-validator"
import { Trim } from "../../../../../common/pipes/trim-pipe"


export class UpdatePostForBlogModel  {
    @Trim()
    @Length(0,30)
    @IsString()
    title: string

    @Trim()
    @Length(0,100)
    @IsString()
    shortDescription: string

    @Trim()
    @Length(0,1000)
    @IsString()
    content: string
}
import { IsString, Length, Matches } from "class-validator"
import { Trim } from "src/common/pipes/trim-pipe"

export class CreateBlogModel  {
    @Trim()
    @IsString()
    @Length(2,15)
    name: string

    @Trim()
    @IsString()
    @Length(4,500)
    description: string

    @Trim()
    @IsString()
    @Length(4,100)
    @Matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/)
    websiteUrl: string
}
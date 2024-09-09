import { IsString, Length, Matches } from "class-validator"
import { Trim } from "../../../../../common/pipes/trim-pipe"

export class CreateBlogModel  {
    @IsString()
    @Trim()
    @Length(2,15)
    name: string

    @IsString()
    @Trim()
    @Length(4,500)
    description: string

    @IsString()
    @Trim()
    @Length(4,100)
    @Matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/)
    websiteUrl: string
}
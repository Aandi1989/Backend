import { IsBoolean, IsString, IsUUID, MinLength } from "class-validator"
import { Trim } from "../../../../../common/pipes/trim-pipe"

export class BanBlogForUserModel {
    @IsBoolean()
    isBanned: boolean

    @Trim()
    @MinLength(20)
    @IsString()
    banReason: string

    @IsUUID()
    blogId: string;
  }
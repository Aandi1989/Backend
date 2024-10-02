import { IsBoolean, IsString, MinLength } from "class-validator"
import { Trim } from "../../../../../common/pipes/trim-pipe"

export class BanUserModel {
    @IsBoolean()
    isBanned: boolean

    @Trim()
    @MinLength(20)
    @IsString()
    banReason: string
  }
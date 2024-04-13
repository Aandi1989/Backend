import { IsString } from "class-validator"
import { Trim } from "src/common/pipes/trim-pipe"

export class AuthBodyModel {
    @Trim()
    @IsString()
    loginOrEmail: string

    @Trim()
    @IsString()
    password: string
}
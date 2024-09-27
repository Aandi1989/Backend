import { IsString } from "class-validator"
import { Trim } from "../../../../../common/pipes/trim-pipe"

export class AuthBodyModel {
    @Trim()
    @IsString()
    loginOrEmail: string

    @Trim()
    @IsString()
    password: string
}
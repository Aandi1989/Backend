import { IsString, Length } from "class-validator"
import { Trim } from "../../../../../common/pipes/trim-pipe"

export class ChangePasswordModel {
    @Trim()
    @Length(6,20)
    @IsString()
    newPassword: string

    @IsString()
    recoveryCode: string
}
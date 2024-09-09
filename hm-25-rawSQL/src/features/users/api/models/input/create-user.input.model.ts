import { IsEmail, IsString, Length, Matches } from "class-validator"
import { Trim } from "../../../../../common/pipes/trim-pipe"

export class CreateUserModel {
    @Trim()
    @Length(3,10)
    @IsString()
    @Matches(/^[a-zA-Z0-9_-]*$/)
    login: string

    @Trim()
    @Length(6,20)
    @IsString()
    password: string

    @Trim()
    @IsEmail()
    @IsString()
    email: string
  }
import { IsEmail, IsString, Length, Matches } from "class-validator"

export class CreateUserModel {
    @Length(3,10)
    @IsString()
    @Matches(/^[a-zA-Z0-9_-]*$/)
    login: string

    @Length(6,20)
    @IsString()
    password: string

    @IsEmail()
    @IsString()
    email: string
  }
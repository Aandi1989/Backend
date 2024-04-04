import { IsEmail, IsString } from "class-validator";
import { Trim } from "src/common/pipes/trim-pipe";

export class ResendEmailModel  {
    @Trim()
    @IsEmail()
    @IsString()
    email: string
}
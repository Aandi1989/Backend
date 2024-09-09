import { IsEmail, IsString } from "class-validator";
import { Trim } from "../../../../../common/pipes/trim-pipe";

export class ResendEmailModel  {
    @Trim()
    @IsEmail()
    @IsString()
    email: string
}
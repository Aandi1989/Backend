import { IsString, Length, Matches } from "class-validator"
import { Trim } from "../../../../../common/pipes/trim-pipe"


export class ConfirmCodeModel  {
    @IsString()
    @Trim()
    @Matches(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
    code: string
} 

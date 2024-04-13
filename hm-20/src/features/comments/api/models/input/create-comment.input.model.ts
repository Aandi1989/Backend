import { IsString, Length } from "class-validator";
import { Trim } from "src/common/pipes/trim-pipe";

export class CreateCommentModel {
    @Trim()
    @IsString()
    @Length(20,300)
    content: string
}
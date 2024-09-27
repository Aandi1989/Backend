import { ArrayNotEmpty, IsArray, IsString, Length, ValidateIf } from "class-validator";
import { Trim } from "../../../../../common/pipes/trim-pipe";

export class CreateQuestionDto {
    @IsString()
    @Trim()
    @Length(10,500)
    body: string

    @IsArray()
    @ArrayNotEmpty()
    @ValidateIf((o, value) => value.every(item => typeof item === 'string' || typeof item === 'number'))
    correctAnswers: (string | number)[];
}
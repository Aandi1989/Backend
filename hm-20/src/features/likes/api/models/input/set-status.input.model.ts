import { IsEnum } from "class-validator";
import { myStatus } from "../../../../comments/types/types";

export class SetStatusModel {
    @IsEnum(myStatus, {
        message: `likeStatus must be a valid enum value: ${Object.values(myStatus).join(', ')}`,
    })
    likeStatus: myStatus;
} 
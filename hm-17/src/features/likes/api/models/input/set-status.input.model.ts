import { IsEnum } from "class-validator";
import { myStatus } from "src/features/posts/types/types";

export class SetStatusModel {
    @IsEnum(myStatus, {
        message: `likeStatus must be a valid enum value: ${Object.values(myStatus).join(', ')}`,
    })
    likeStatus: myStatus;
} 
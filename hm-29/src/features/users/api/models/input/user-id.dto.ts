import { IsUUID } from 'class-validator';

export class UserBanParams {
    @IsUUID()
    id: string;
}

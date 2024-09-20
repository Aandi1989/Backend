import { IsUUID } from 'class-validator';

export class GameParams {
    @IsUUID()
    id: string;
}

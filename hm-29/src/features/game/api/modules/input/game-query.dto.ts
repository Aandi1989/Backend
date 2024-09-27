import { IsOptional, IsIn, IsInt, Min, Max, IsString } from 'class-validator';
import { Type } from 'class-transformer';

const gameSortByOptions = ["id", "firstUserId", "secondUserId", "status", "pairCreatedDate", "startGameDate", "finishGameDate"] as const;
const sortDirectionOptions = ["asc", "desc"] as const;

export class GameQueryDTO {
    @IsOptional()
    @IsIn(gameSortByOptions)
    sortBy?: typeof gameSortByOptions[number];

    @IsOptional()
    @IsIn(sortDirectionOptions)
    sortDirection?: typeof sortDirectionOptions[number];

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    pageNumber?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    pageSize?: number;
}

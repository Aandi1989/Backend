import { Type } from 'class-transformer';
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, registerDecorator, ValidationOptions, IsInt, IsOptional, Min, ArrayNotEmpty, IsArray } from 'class-validator';


@ValidatorConstraint({ async: true })
class IsSortValidConstraint implements ValidatorConstraintInterface {
    validate(value: string | string[], args: ValidationArguments) {
        // Normalize value to always be an array
        let values = Array.isArray(value) ? value : [value];

        // Immediately return true if the array is empty or contains only an empty string
        if (values.length === 0 || (values.length === 1 && values[0].trim() === '')) {
            return true;
        }
        
        // Define the valid fields and directions
        const validFields = ['avgScores', 'sumScore', 'winsCount', 'lossesCount', 'gamesCount', 'drawsCount'];
        const validDirections = ['asc', 'desc'];

        // Validate each sort expression
        return values.every(val => {
            const [field, dir] = val.split(' ');
            return validFields.includes(field) && validDirections.includes(dir);
        });
    }

    defaultMessage(args: ValidationArguments) {
        return `Each sort directive must be a valid field followed by a direction (asc or desc). Valid fields are ${args.constraints[0].join(', ')}.`;
    }
}

// Custom decorator to use in DTOs
function IsSortValid(validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsSortValidConstraint,
        });
    };
}

export class StatisticQueryDTO {
    @IsOptional()
    // @IsArray()
    @IsSortValid({
        message: "Sort parameter must be correctly formatted. Example: 'avgScores desc&sumScore asc'"
    })
    sort?: string[];

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

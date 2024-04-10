import { IsNotEmpty, IsOptional, IsString, Length, Matches, Validate, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator'


@ValidatorConstraint({ name: 'IsDateInPast', async: false })
export class IsDateInPastConstraint implements ValidatorConstraintInterface {
    validate(date: string, args: ValidationArguments) {
        const selectedDate = new Date(date);
        const currentDate = new Date();
        return selectedDate <= currentDate;
    }

    defaultMessage(args: ValidationArguments) {
        return `${args.property} must be a date in the past`;
    }
}
export class updateuserdto {
    @IsNotEmpty({ message: "name name should not be null" })
    @IsString()
    name: string

    @IsNotEmpty({ message: "email email should not be null" })
    @IsString()
    email: string

    @IsOptional()
    @IsString()
    avatar: string

    @IsOptional()
    @IsString()
    street: string

    @IsOptional()
    @IsString()
    city: string

    @IsOptional()
    @IsString()
    state: string

    @IsOptional()
    @Matches(/^\d+$/, { message: 'zipcode zipcode must contain only digits' })
    @Length(6, 6, { message: 'zipcode zipcode number must be exactly 6 digits' })
    zipcode: string


    @IsString()
    @IsOptional()
    @Validate(IsDateInPastConstraint, { message: 'date date of birth must be in the past' })
    data_of_birth: string

    @IsOptional()
    @Matches(/^\d+$/,{ message: 'phone_number phone number must contain only digits' })
    @Length(10, 10, { message: 'phone_number phone number must be exactly 10 digits' })
    phone_number: string
}
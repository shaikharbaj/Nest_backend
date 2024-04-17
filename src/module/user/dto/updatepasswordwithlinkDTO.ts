import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Matches,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
class MatchPasswordsConstraint implements ValidatorConstraintInterface {
  validate(confirmpassword: any, args: ValidationArguments): boolean {
    const updatePasswordwithLinkDTO = args.object as updatePasswordwithLinkDTO;
    return confirmpassword === updatePasswordwithLinkDTO.password;
  }

  defaultMessage(args: ValidationArguments): string {
    return 'confirmpassword confirmed password does not match with password';
  }
}
export class updatePasswordwithLinkDTO {
  @IsNotEmpty({ message: 'password password is required' })
  @IsString()
  @Length(6, 20, {
    message: 'password password must be between 6 and 20 characters',
  })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
    {
      message:
        'password password must contain at least one lowercase letter, one uppercase letter, one number, and one special character',
    },
  )
  password: string;

  @IsNotEmpty({ message: 'confirmpassword Confirmed password is required' })
  @Validate(MatchPasswordsConstraint)
  confirmpassword: string;
}

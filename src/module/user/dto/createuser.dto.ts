import { IsEmail, IsNotEmpty, IsString, Length, Matches } from "class-validator";

export class createUserDto {
    @IsNotEmpty({ message: "name name is required" })
    @IsString()
    name: string

    @IsEmail({}, { message: "email invalid email format" })
    @IsNotEmpty({ message: "email email is required" })
    email: string

    @IsNotEmpty({ message: "password password is required" })
    @IsString()
    @Length(6, 20, { message: "password password must be between 6 and 20 characters" })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/, { message: "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character" })
    password: string;

}
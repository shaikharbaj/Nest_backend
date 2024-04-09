import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class loginuserDto {
       @IsNotEmpty({ message: "email email is required" })
       @IsEmail({}, { message: "email invalid email format" })
       email: string

       @IsNotEmpty({ message: "password password is required" })
       @IsString()
       password: string
}
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
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
    @IsString()
     zipcode: string

    @IsOptional()
    @IsString()
     data_of_birth: string

    @IsOptional()
    @IsString()
     phone_number: string
}
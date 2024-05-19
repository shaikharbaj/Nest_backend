import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator'
export class createsupplierDTO{
       
    @IsNotEmpty()
    name:string
    @IsNotEmpty()
    @IsEmail()
    email:string
    @IsNotEmpty()
    password:string
    @IsOptional()
    @IsString()
    address:string

}
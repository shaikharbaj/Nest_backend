import { IsNotEmpty, IsString } from "class-validator";

export class loginuserDto{
       @IsNotEmpty()
       @IsString()
       email:string

       @IsNotEmpty()
       @IsString()
       password:string
}
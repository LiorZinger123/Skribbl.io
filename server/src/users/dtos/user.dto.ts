import { IsEmail, IsNotEmpty, IsString } from "class-validator"

export class UserDto{

    @IsNotEmpty()
    @IsString()
    username: string

    @IsNotEmpty()
    @IsString()
    password: string
 
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string
}

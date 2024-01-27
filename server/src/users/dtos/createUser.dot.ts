import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator"

export class CreateUserDto{
    
    @IsString()
    @MinLength(8)
    username: string

    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).+$/)
    password: string

    @IsString()
    @IsEmail()
    email: string
}
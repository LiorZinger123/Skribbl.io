import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator"

export class UserDto{

    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    username: string

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    @MaxLength(20)
    password: string
}

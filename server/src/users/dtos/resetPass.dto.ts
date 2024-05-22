import { IsString,MinLength, MaxLength, Matches } from "class-validator"

export class ResetPassDto{

    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).+$/)
    password: string

    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).+$/)
    submitPassword: string
    
}
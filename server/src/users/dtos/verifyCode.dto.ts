import { IsString } from "class-validator"

export class VerifyCodeDto{
    
    @IsString()
    username: string

    @IsString()
    code: string

}
import { IsNotEmpty, IsOptional, MinLength } from "class-validator"

export class NewRoomDto{

    @IsNotEmpty()
    username: string

    @IsNotEmpty()
    @MinLength(3)
    name: string

    @IsNotEmpty()
    players: number

    @IsNotEmpty()
    seconds: number

    @IsNotEmpty()
    rounds: number

    @IsOptional()
    @MinLength(3)
    password?: string
}
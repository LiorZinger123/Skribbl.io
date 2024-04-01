import { IsNotEmpty } from "class-validator"

export class NewRoomDto{

    @IsNotEmpty()
    username: string

    @IsNotEmpty()
    name: string

    @IsNotEmpty()
    players: number

    @IsNotEmpty()
    seconds: number

    @IsNotEmpty()
    rounds: number

    @IsNotEmpty()
    password?: string
}
import { Transform } from "class-transformer"
import { IsNotEmpty } from "class-validator"

export class NewRoom{

    @IsNotEmpty()
    username: string

    @IsNotEmpty()
    name: string

    password: string

    @Transform(({value}) => parseInt(value))
    players: number

    @Transform(({value}) => parseInt(value))
    time: number

    @Transform(({value}) => parseInt(value))
    rounds: number
}
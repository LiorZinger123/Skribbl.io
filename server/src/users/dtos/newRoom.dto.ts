import { Transform } from "class-transformer"

export class NewRoom{

    name: string

    password: string

    @Transform(({value}) => parseInt(value))
    players: number

    @Transform(({value}) => parseInt(value))
    time: number

    @Transform(({value}) => parseInt(value))
    rounds: number
}
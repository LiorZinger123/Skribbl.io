import { Word } from "src/schemas/words.schema"

export type JoinWhileDrawing = {
    turnData: TurnData,
    currentDrawing: string
}

export type TurnData = {
    time: number,
    round: number,
    word: Word
}
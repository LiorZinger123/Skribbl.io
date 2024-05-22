import React from "react"

export type drawStarightLineType = {
    e: MouseEvent,
    canvasRect: DOMRect,
    ctx: CanvasRenderingContext2D,
    prevPoint: React.MutableRefObject<Point | null>,
    width: number,
    color: string
}

export type Drawings = string | undefined

export type Point = {
    x: number, 
    y: number
}

export type ChatMessage = {
    id: number,
    msg: string,
    color?: string
}

export type CorrectMsgFromServer = {
    msg: string,
    color?: string
}

export type PlayerType = {
    id: number,
    username: string,
    score: number,
    roomOwner: boolean
}

export type RoomCloseType = {
    show: boolean,
    msg: string
} 

export type LocationsType = {
    locations: number[]
}

export type CorrectAnswerData = {
    username: string
}

export type GetTurnWordsType = {
    getWords: boolean, 
    words?: Word[]
}

export type Word = {
    word: string, 
    length: string
}

export type Score = {
    username: string,
    score: number
}

export type SetConnectedPlayersType = PlayerType[] | PlayerType

export type RoomDetails = {
    time: number, 
    rounds: number,
    currentRound: number
}

export type JoinWhileScreenMsg = {
    msg: string,
    time: number
}

export type ShowScoresType = {
    scores: Score[],
    painter: string | null,
    owner: string
}

export type EndMsgInfoType = {
    winnerMsg: string,
    owner: string
}

export type JoinWhileEndMsg = {
    data: EndMsgInfoType,
    time: number
}

export type WhileDrawing = {
    time: number,
    round: number,
    word: Word
}
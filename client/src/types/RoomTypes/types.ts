import React, { JSXElementConstructor, ReactElement } from "react"
import { number } from "zod"

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
    rounds: number
}

export type ScreenCurrentMsgType = {
    show: boolean,
    msg: ReactElement | string
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

export type WhileDrawing = {
    time: number,
    round: number,
    word: Word
}
import React from "react"

export type drawStarightLineType = {
    e: MouseEvent,
    canvasRect: DOMRect,
    ctx: CanvasRenderingContext2D,
    prevPoint: React.MutableRefObject<Point | null>,
    width: number,
    color: string
}

export type Point = {
    x: number, 
    y: number
}

export type ChatMessage = {
    id: number,
    msg: string
}

export type PlayerType = {
    id: number,
    username: string,
    score: number,
    roomOwner: boolean
}

export type Msg = {
    msg: string, 
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
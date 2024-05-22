import React from "react"
import { Socket } from "socket.io-client"
import { PlayerType, Word, Drawings } from "./types"

export type RoomContextType = {
    socket: Socket,
    painter: React.MutableRefObject<string>
}

export type ScreenMsgsContextType = {
    players: PlayerType[],
    setPlayers: React.Dispatch<React.SetStateAction<PlayerType[]>>,
    round: number,
    setRound: React.Dispatch<React.SetStateAction<number>>,
    maxRounds: number,
    currentWord: Word,
    turnTime: React.MutableRefObject<number>,
    setTime: React.Dispatch<React.SetStateAction<number>>
}

export type ScreenMsgsFunctionsContextType = {
    setScreenCurrentMsg: React.Dispatch<React.SetStateAction<React.ReactElement<any, string | React.JSXElementConstructor<any>> | null>>
}

export type CanvasContextType = {
    setTime: React.Dispatch<React.SetStateAction<number>>,
    turnTime: React.MutableRefObject<number>,
    currentColor: string,
    drawLine: boolean,
    currentWidth: number,
    setCurrentWidth: React.Dispatch<React.SetStateAction<number>>,
    deleteAll: boolean,
    undo: boolean,
    setDeleteAll: React.Dispatch<React.SetStateAction<boolean>>,
    canvasParentRef: React.MutableRefObject<HTMLDivElement | null>
}

export type CanvasFunctionsContextType = {
    canvasRef: React.MutableRefObject<HTMLCanvasElement | null>,
    contextRef: React.MutableRefObject<CanvasRenderingContext2D | null>,
    previusDrawings: React.MutableRefObject<Drawings[]>,
    canDraw: React.MutableRefObject<boolean>, 
    drawing: string,
    setDrawing: React.Dispatch<React.SetStateAction<string>>
}

export type ToolBarContextType = {
    currentColor: string,
    setCurrentColor: React.Dispatch<React.SetStateAction<string>>,
    setDrawLine: React.Dispatch<React.SetStateAction<boolean>>,
    setCurrentWidth: React.Dispatch<React.SetStateAction<number>>,
    setDeleteAll: React.Dispatch<React.SetStateAction<boolean>>,
    drawLine: boolean,
    setUndo: React.Dispatch<React.SetStateAction<boolean>>
}
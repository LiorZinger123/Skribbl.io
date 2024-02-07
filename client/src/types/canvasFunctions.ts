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
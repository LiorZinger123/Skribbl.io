import React from "react"
import { Drawings } from "../../../../../types/RoomTypes/types"
import useTurnFunctions from "../CanvasHooks/TurnFunctions/useTurnFunctions"
import useDrawingFunctions from "../CanvasHooks/DrawingFunctions/useDrawingFunctions"
import useUpdateDrawing from "../CanvasHooks/UpdateDrawing/useUpdateDrawing"
import useDeleteAll from "../CanvasHooks/DeleteAll/useDeleteAll"
import useUndo from "../CanvasHooks/Undo/useUndo"

type Props = {
  setTime: React.Dispatch<React.SetStateAction<number>>,
  roundTime: React.MutableRefObject<number>,
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>,
  contextRef: React.MutableRefObject<CanvasRenderingContext2D | null>,
  previusDrawings: React.MutableRefObject<Drawings[]>,
  canDraw: React.MutableRefObject<boolean>,
  drawing: string,
  setDrawing: React.Dispatch<React.SetStateAction<string>>,
  drawLine: boolean,
  currentColor: string,
  currentWidth: number,
  deleteAll: boolean,
  setDeleteAll: React.Dispatch<React.SetStateAction<boolean>>,
  undo: boolean
}

const CanvasFunctions = (props: Props) => {

  useTurnFunctions({setTime: props.setTime, roundTime: props.roundTime, canvasRef: props.canvasRef, contextRef: props.contextRef, 
    previusDrawings: props.previusDrawings, canDraw: props.canDraw})
  useDrawingFunctions({previusDrawings: props.previusDrawings, canvasRef: props.canvasRef, setDrawing: props.setDrawing, contextRef: props.contextRef, 
    drawLine: props.drawLine, currentColor: props.currentColor, currentWidth: props.currentWidth, canDraw: props.canDraw})
  useUpdateDrawing({drawing: props.drawing, contextRef: props.contextRef})
  useDeleteAll({canvasRef: props.canvasRef, contextRef: props.contextRef, deleteAll: props.deleteAll})
  useUndo({previusDrawings: props.previusDrawings, setDrawing: props.setDrawing, undo: props.undo, setDeleteAll: props.setDeleteAll})

  return (
    <></>
  )
}

export default CanvasFunctions
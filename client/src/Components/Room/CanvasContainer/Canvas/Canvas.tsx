import { useState, useRef, useEffect } from "react"
import { Drawings, PlayerType } from "../../../../types/RoomTypes/types"
import Undo from "./CanvasFunctions/Undo"
import DeleteAll from "./CanvasFunctions/DeleteAll"
import UpdateDrawing from "./CanvasFunctions/UpdateDrawing"
import DrawingFunctions from "./CanvasFunctions/DrawingFunctions"
import TurnFunctions from "./CanvasFunctions/TurnFunctions"

type Props = {
    players: PlayerType[],
    setTime: React.Dispatch<React.SetStateAction<number>>,
    roundTime: React.MutableRefObject<number>,
    currentColor: string,
    drawLine: boolean,
    currentWidth: number,
    setCurrentWidth: React.Dispatch<React.SetStateAction<number>>,
    deleteAll: boolean,
    undo: boolean,
    setDeleteAll: React.Dispatch<React.SetStateAction<boolean>>
}

const Canvas = (props: Props) => {
    
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const contextRef = useRef<CanvasRenderingContext2D | null>(null)
    
    const [drawing, setDrawing] = useState<string>('')
    const previusDrawings = useRef<Drawings[]>([])

    return (
        <>
            <canvas className="canvas" ref={canvasRef} width={650} height={530}/> 
            <TurnFunctions setTime={props.setTime} roundTime={props.roundTime} canvasRef={canvasRef} contextRef={contextRef} previusDrawings={previusDrawings} />
            <DrawingFunctions previusDrawings={previusDrawings} canvasRef={canvasRef} setDrawing={setDrawing} contextRef={contextRef} 
                drawLine={props.drawLine} currentColor={props.currentColor} currentWidth={props.currentWidth} players={props.players} />
            <UpdateDrawing drawing={drawing} contextRef={contextRef} />
            <DeleteAll canvasRef={canvasRef} contextRef={contextRef} deleteAll={props.deleteAll} /> 
            <Undo previusDrawings={previusDrawings} setDrawing={setDrawing} undo={props.undo} setDeleteAll={props.setDeleteAll} />
        </>
    ) 
}

export default Canvas
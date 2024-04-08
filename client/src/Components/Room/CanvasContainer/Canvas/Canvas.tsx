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
    setDeleteAll: React.Dispatch<React.SetStateAction<boolean>>,
    canvasParentRef: React.MutableRefObject<HTMLDivElement | null>
}

const Canvas = (props: Props) => {
    
    // const parentRef = useRef<HTMLDivElement | null>(null)
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const contextRef = useRef<CanvasRenderingContext2D | null>(null)

    const [drawing, setDrawing] = useState<string>('')
    const previusDrawings = useRef<Drawings[]>([])
    const canDraw = useRef<boolean>(false)

    useEffect(() => {
        
        const resize = (): void => {
            if(props.canvasParentRef.current && canvasRef.current && contextRef.current){
                canvasRef.current.width = props.canvasParentRef.current.clientWidth
                canvasRef.current.height = props.canvasParentRef.current.clientHeight
                contextRef.current.fillStyle = 'white'
                contextRef.current.fillRect(0 , 0, canvasRef.current.width, canvasRef.current.height)
            }
        }

        resize()
        window.addEventListener('resize', resize)

        return (): void => {
            window.removeEventListener('resize', resize)
        }
        
    }, [])

    return (
        <div className="canvas">
            <canvas ref={canvasRef} /> 
            <TurnFunctions setTime={props.setTime} roundTime={props.roundTime} canvasRef={canvasRef} contextRef={contextRef} 
                previusDrawings={previusDrawings} canDraw={canDraw} />
            <DrawingFunctions previusDrawings={previusDrawings} canvasRef={canvasRef} setDrawing={setDrawing} contextRef={contextRef} 
                drawLine={props.drawLine} currentColor={props.currentColor} currentWidth={props.currentWidth} players={props.players} canDraw={canDraw} />
            <UpdateDrawing drawing={drawing} contextRef={contextRef} />
            <DeleteAll canvasRef={canvasRef} contextRef={contextRef} deleteAll={props.deleteAll} /> 
            <Undo previusDrawings={previusDrawings} setDrawing={setDrawing} undo={props.undo} setDeleteAll={props.setDeleteAll} />
        </div>
    ) 
}

export default Canvas
import { useState, useRef, useEffect, useContext, createContext } from "react"
import { RoomContext } from "../../Room"
import { Drawings } from "../../../../types/RoomTypes/types"
import { CanvasFunctionsContextType } from "../../../../types/RoomTypes/contextsTypes"
import CanvasFunctions from "./CanvasFunctions/CanvasFunctions"
import { useAppSelector } from "../../../../store/hooks"
import { RootState } from "../../../../store/store"
import { CanvasContext } from "../CanvasContainer"

export const CanvasFunctionsContext = createContext<CanvasFunctionsContextType>(null!)

const Canvas = () => {
    
    const socket = useContext(RoomContext).socket
    const username = useAppSelector((state: RootState) => state.username)
    const painter = useContext(RoomContext).painter
    const props = useContext(CanvasContext)

    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const contextRef = useRef<CanvasRenderingContext2D | null>(null)

    const [drawing, setDrawing] = useState<string>('')
    const previusDrawings = useRef<Drawings[]>([])
    const canDraw = useRef<boolean>(false)
    const [roomClosed, setRoomClosed] = useState<boolean>(false)

    const canvasFunctionsContextValues = {canvasRef: canvasRef, contextRef: contextRef, previusDrawings: previusDrawings, 
        canDraw: canDraw, drawing: drawing, setDrawing: setDrawing
    } 

    // console.log('w')

    useEffect(() => {
        
        const setCanvas = (): void => {
            if(props.canvasParentRef.current && canvasRef.current && contextRef.current){
                canvasRef.current.width = props.canvasParentRef.current.clientWidth
                canvasRef.current.height = props.canvasParentRef.current.clientHeight
                contextRef.current.fillStyle = 'white'
                contextRef.current.fillRect(0 , 0, canvasRef.current.width, canvasRef.current.height)
            }
        }

        // const resize = (): void => { //check
        //     const currentDrawing = painter.current === username ? canvasRef.current?.toDataURL()! : drawing
        //     const originalCanvas = createOriginalCanvas(currentDrawing)
        //     setCanvas()
        //     if(contextRef.current){
        //     const img = new Image()
        //         img.src = currentDrawing
        //         img.onload = () => {
        //             contextRef.current?.drawImage(originalCanvas, 0, 0, originalCanvas.width, originalCanvas.height, 0, 0, canvasRef.current?.width!, canvasRef.current?.height!) 
        //         }
        //         const scaleFactor = canvasRef.current?.width! / originalCanvas.width
        //         console.log(scaleFactor)
        //         contextRef.current.lineWidth *= scaleFactor
        //     }
        // }
        
        // const createOriginalCanvas = (currentDrawing: string): HTMLCanvasElement => {
        //     const originalCanvas = document.createElement('canvas')
        //     originalCanvas.width = canvasRef.current?.width!
        //     originalCanvas.height = canvasRef.current?.height!
        //     const originalCtx = originalCanvas.getContext('2d')
        //     if(originalCtx){
        //         const img = new Image()
        //         img.src = currentDrawing
        //         img.onload = () => {
        //             originalCtx.drawImage(img, 0, 0)
        //         }
        //     }
        //     return originalCanvas
        // }

        const stopCanvasFunctions = (): void => {
            setRoomClosed(true)
        }

        setCanvas()
        // window.addEventListener('resize', resize)
        socket.on('room_closed', stopCanvasFunctions)

        return (): void => {
            // window.removeEventListener('resize', resize)
            socket.off('room_closed', stopCanvasFunctions)
        }
        
    }, [drawing])

    return (
        <div className="canvas">
            <canvas ref={canvasRef} />
            {!roomClosed && 
                <CanvasFunctionsContext.Provider value={canvasFunctionsContextValues}>
                    <CanvasFunctions />
                </CanvasFunctionsContext.Provider>
            }
        </div>
    ) 
}

export default Canvas
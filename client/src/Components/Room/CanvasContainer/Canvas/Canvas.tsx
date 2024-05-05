import { useState, useRef, useEffect, useContext } from "react"
import { SocketContext } from "../../Room"
import { Drawings } from "../../../../types/RoomTypes/types"
import CanvasFunctions from "./CanvasFunctions/CanvasFunctions"

type Props = {
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
    
    const socket = useContext(SocketContext)
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const contextRef = useRef<CanvasRenderingContext2D | null>(null)

    const [drawing, setDrawing] = useState<string>('')
    const previusDrawings = useRef<Drawings[]>([])
    const canDraw = useRef<boolean>(false)
    const [roomClosed, setRoomClosed] = useState<boolean>(false)

    useEffect(() => {
        
        const resize = (): void => {
            if(props.canvasParentRef.current && canvasRef.current && contextRef.current){
                canvasRef.current.width = props.canvasParentRef.current.clientWidth
                canvasRef.current.height = props.canvasParentRef.current.clientHeight
                contextRef.current.fillStyle = 'white'
                contextRef.current.fillRect(0 , 0, canvasRef.current.width, canvasRef.current.height)
            }
        }

        const stopCanvasFunctions = (): void => {
            setRoomClosed(true)
        }

        const updateDrawing = (drawing: string): void => {
            setDrawing(drawing)
        }

        resize()
        window.addEventListener('resize', resize)
        socket.on('room_closed', stopCanvasFunctions)
        socket.on("update_drawing", updateDrawing)

        return (): void => {
            window.removeEventListener('resize', resize)
            socket.off('room_closed', stopCanvasFunctions)
            socket.off("update_drawing", updateDrawing)
        }
        
    }, [])

    return (
        <div className="canvas">
            <canvas ref={canvasRef} />
            {!roomClosed && <CanvasFunctions {...props} canvasRef={canvasRef} contextRef={contextRef} previusDrawings={previusDrawings}
                canDraw={canDraw} drawing={drawing} setDrawing={setDrawing} />}
        </div>
    ) 
}

export default Canvas
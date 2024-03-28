import { useEffect, useRef, useState, useContext } from "react"
import { SocketContext } from "../../Room"
import { useAppSelector } from "../../../../store/hooks"
import { RootState } from "../../../../store/store"
import { Point, PlayerType } from "../../../../types/RoomTypes/types"
import { drawStarightLine } from "./CanvasFunctions"

type Props = {
    players: PlayerType[],
    setTime: React.Dispatch<React.SetStateAction<number>>,
    roundTime: React.MutableRefObject<number>,
    currentColor: string,
    drawLine: boolean,
    currentWidth: number,
    setCurrentWidth: React.Dispatch<React.SetStateAction<number>>,
    deleteAll: boolean
}

const Canvas = (props: Props) => {
    const room = useAppSelector((state: RootState) => state.room)
    const socket = useContext(SocketContext)

    const intervalRef = useRef<NodeJS.Timeout>(null!)
    const timeoutRef = useRef<NodeJS.Timeout>(null!)
   
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const contextRef = useRef<CanvasRenderingContext2D | null>(null)
    const isDrawing  = useRef<boolean>(false)
    const prevPoint = useRef<Point | null>(null)
    const canDraw = useRef<boolean>(false)
    
    const [drawing, setDrawing] = useState<string>('')

    useEffect(() => {

        const startTurn = (): void => {
            intervalRef.current = setInterval(() => {
                props.setTime(time => time - 1)
                socket.emit('tick', {room: room})
            }, 1000)
            timeoutRef.current = setTimeout(() => {
                endTurn()
            }, props.roundTime.current * 1000)
        }
        
        const endTurn = (): void => {
            clearInterval(intervalRef.current)
            props.setTime(0)
            contextRef.current?.clearRect(0, 0, canvasRef.current?.width!, canvasRef.current?.height!)
            if(canDraw.current){
                canDraw.current = false
                socket.emit('end_turn', {room: room})
            }
        }

        const enableDrawing = (): void => {
            canDraw.current = true
        }

        const endTurnNow = (): void =>{
            clearTimeout(timeoutRef.current)
            endTurn()
        }

        socket.on('start_turn', startTurn)
        socket.on('start_draw', enableDrawing)
        socket.on('end_turn_now', endTurnNow)

        return (): void => {
            socket.off('start_turn', startTurn)
            socket.off('start_draw', enableDrawing)
            socket.off('end_turn_now', endTurn)
            clearInterval(intervalRef.current)
            clearTimeout(timeoutRef.current)
        }
    }, [])

    useEffect(() => { // clear canvas on load
        if(canvasRef.current){
            contextRef.current = canvasRef.current.getContext('2d')
            if(contextRef.current){
                contextRef.current.fillStyle = 'white'
                contextRef.current.fillRect(0 , 0, canvasRef.current.width, canvasRef.current.height)
            }
        }
    }, [props.deleteAll])

    useEffect(() => {

        const mouseDown = (): void => {
            isDrawing.current = true
        }
        
        const mouseUp = (): void => {
            isDrawing.current = false
            prevPoint.current = null
        }

        const handleDrawing = (drawing: string): void => {
            if(drawing.length > 0)
              setDrawing(drawing)
        }

        const draw = (e: MouseEvent): void => {
            // if(canDraw.current){
                if(contextRef.current && isDrawing.current){
                    const canvasRect = canvasRef.current?.getBoundingClientRect()
                    if(canvasRect){
                        if(props.drawLine){
                            const data = {e: e, canvasRect: canvasRect, ctx: contextRef.current,
                                prevPoint: prevPoint, width: props.currentWidth, color: props.currentColor}
                            drawStarightLine(data)
                        }
                        socket.emit('drawing', {drawing: canvasRef.current?.toDataURL(), room: room})
                    }
                }
            // }
        }
    
        const canvasFill = (): void => {
            if(!props.drawLine){
                if(contextRef.current && canvasRef.current){
                    contextRef.current.fillStyle = props.currentColor
                    contextRef.current.fillRect(0 , 0, canvasRef.current.width, canvasRef.current.height)
                }
            }
        }

        canvasRef.current?.addEventListener('mousedown', mouseDown)
        window.addEventListener('mouseup', mouseUp)
        socket.on('update_drawing', handleDrawing)
        canvasRef.current?.addEventListener('mousemove', draw)
        canvasRef.current?.addEventListener('click', canvasFill)

        return (): void => {
            canvasRef.current?.removeEventListener('mousedown', mouseDown)
            window.removeEventListener('mouseup', mouseUp)
            socket.off('update_drawing', handleDrawing)
            canvasRef.current?.removeEventListener('mousemove', draw)
            canvasRef.current?.removeEventListener('click', canvasFill)
        }

    }, [props.players, props.currentColor, props.drawLine])

    useEffect(() => {
        const img = new Image()
        img.src = drawing
        img.onload = () => {
            contextRef.current?.drawImage(img, 0, 0)
        }
    }, [drawing])

    return (
        <canvas className="canvas" ref={canvasRef} width={650} height={530}/> //fix size
    ) 
}

export default Canvas
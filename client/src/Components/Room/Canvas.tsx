import { useEffect, useRef, useState } from "react"
import { Socket } from "socket.io-client"
import { Point } from "../../types/RoomTypes/canvasFunctions"
import { drawStarightLine } from "./CanvasFunctions"
import PlayerType from "../../types/RoomTypes/playerType"

type Props = {
    socket: Socket,
    players: PlayerType[],
    username: string,
    currentPlayerNumber: React.MutableRefObject<number>,
    setTime: React.Dispatch<React.SetStateAction<number>>,
    roundTime: React.MutableRefObject<number>
}

const Canvas = (props: Props) => {

    const intervalRef = useRef<any>(null) //change
   
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const contextRef = useRef<CanvasRenderingContext2D | null>(null)
    const isDrawing  = useRef<boolean>(false)
    const prevPoint = useRef<Point | null>(null)
    const width = useRef<number>(5)
    const color = useRef<string>('black')
    const canDraw = useRef<boolean>(false)
    
    const [drawing, setDrawing] = useState<string>('')

    useEffect(() => {

        const startTurn = (): void => {
            intervalRef.current = setInterval(() => {
                props.setTime(time => time - 1)
            }, 1000)
            setTimeout(() => {
                clearInterval(intervalRef.current)
                contextRef.current?.clearRect(0, 0, 500, 500) //change
                if(canDraw.current){
                    canDraw.current = false
                    props.socket.emit('endturn')
                }
            }, props.roundTime.current * 1000)
        } 

        const enableDrawing = (): void => {
            canDraw.current = true
        }

        props.socket.on('startturn', startTurn)
        props.socket.on('startdraw', enableDrawing)

        return (): void => {
            props.socket.off('startturn', startTurn)
            props.socket.off('startdraw', enableDrawing)
            clearInterval(intervalRef.current)
        }
    }, [])

    useEffect(() => {

        if(canvasRef.current){
            contextRef.current = canvasRef.current.getContext('2d')
            if(contextRef.current){
                contextRef.current.fillStyle = 'white'
                contextRef.current.fillRect(0 , 0, canvasRef.current.width, canvasRef.current.height)
            }
        }

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
            if(canDraw.current){
                if(contextRef.current && isDrawing.current){
                    const canvasRect = canvasRef.current?.getBoundingClientRect()
                    if(canvasRect){
                        const data = {e: e, canvasRect: canvasRect, ctx: contextRef.current,
                            prevPoint: prevPoint, width: width.current , color: color.current}
                        drawStarightLine(data)
                        props.socket.emit('drawing', {drawing: canvasRef.current?.toDataURL()})
                    }
                }
            }
        }

        canvasRef.current?.addEventListener('mousedown', mouseDown)
        window.addEventListener('mouseup', mouseUp)
        canvasRef.current?.addEventListener('mousemove', draw)
        props.socket.on('updatedrawing', handleDrawing)

        return (): void => {
            canvasRef.current?.removeEventListener('mousedown', mouseDown)
            window.removeEventListener('mouseup', mouseUp)
            canvasRef.current?.removeEventListener('mousemove', draw)
            props.socket.off('updatedrawing', handleDrawing)
        }

    }, [props.players])

    useEffect(() => {
        const img = new Image()
        img.src = drawing
        img.onload = () => {
            contextRef.current?.drawImage(img, 0, 0)
        }
    }, [drawing])

    return (
        <>
            <canvas ref={canvasRef} width={500} height={500} />
        </>
    ) 
}

export default Canvas
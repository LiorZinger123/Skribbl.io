import { useEffect, useRef } from "react"
import { Socket } from "socket.io-client"
import { Point } from "../../types/canvasFunctions"
import { drawStarightLine } from "./CanvasFunctions"

type Props = {
    drawing: string,
    socket: Socket,
    room: string,
    myTurn: boolean
}

const Canvas = (props: Props) => {
  
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const contextRef = useRef<CanvasRenderingContext2D | null>(null)
    const isDrawing  = useRef<boolean>(false)
    const prevPoint = useRef<Point | null>(null)
    const width = useRef<number>(5)
    const color = useRef<string>('black')

    useEffect(() => {

        if(canvasRef.current){
            contextRef.current = canvasRef.current.getContext('2d')
            if(contextRef.current){
                contextRef.current.fillStyle = 'lightgreen'
                contextRef.current.fillRect(0 , 0, canvasRef.current.width, canvasRef.current.height)
            }
        }

        const mouseDown = (): void => {
            isDrawing.current = true
        }
        
        const mouseUp = (): void => {
            isDrawing.current = false
        }
        
        const draw = (e: MouseEvent): void => {
            if(contextRef.current && isDrawing.current){
                const canvasRect = canvasRef.current?.getBoundingClientRect()
                if(canvasRect){
                    const data = {e: e, canvasRect: canvasRect, ctx: contextRef.current,
                        prevPoint: prevPoint, width: width.current , color: color.current}
                    drawStarightLine(data)
                    props.socket.emit('drawing', {drawing: canvasRef.current?.toDataURL(), room: props.room})
                }
            }
        }

        canvasRef.current?.addEventListener('mousedown', mouseDown)
        window.addEventListener('mouseup', mouseUp)
        canvasRef.current?.addEventListener('mousemove', draw)

        return (): void => {
            canvasRef.current?.removeEventListener('mousedown', mouseDown)
            window.removeEventListener('mouseup', mouseUp)
            canvasRef.current?.removeEventListener('mousemove', draw)
        }

    }, [props.socket])

    useEffect(() => {
        const img = new Image()
        img.src = props.drawing
        img.onload = () => {
            contextRef.current?.drawImage(img, 0, 0)
        }
    }, [props.drawing])

    return (
        <canvas ref={canvasRef} width={500} height={500} />
    ) 
}

export default Canvas
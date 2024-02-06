import { useEffect, useRef } from "react"
import { Socket } from "socket.io-client"

type Props = {
    drawing: string,
    socket: Socket,
    room: string
}

const Canvas = (props: Props) => {
  
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const contextRef = useRef<CanvasRenderingContext2D | null>(null)
    const isDrawing  = useRef<boolean>(false)

    useEffect(() => {

        if(canvasRef.current){
            contextRef.current = canvasRef.current.getContext('2d')
            if(contextRef.current){
                contextRef.current.fillStyle = 'blue'
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
            if(isDrawing.current){
                const canvasRect = canvasRef.current?.getBoundingClientRect()
                if(canvasRect){
                    const mouseX = e.clientX - canvasRect.left
                    const mouseY = e.clientY - canvasRect.top
                    contextRef.current?.beginPath()
                    contextRef.current?.arc(mouseX, mouseY, 1, 1, 2 * Math.PI)
                    contextRef.current?.stroke()
                    // contextRef.current?.fill()
                    props.socket.emit('drawing', {drawing: canvasRef.current?.toDataURL(), room: props.room})
                }
            }
        }

        canvasRef.current?.addEventListener('mousedown', mouseDown)
        canvasRef.current?.addEventListener('mouseup', mouseUp)
        canvasRef.current?.addEventListener('mousemove', draw)

        return (): void => {
            canvasRef.current?.removeEventListener('mousedown', mouseDown)
            canvasRef.current?.removeEventListener('mouseup', mouseUp)
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
        <canvas ref={canvasRef} />
    ) 
}

export default Canvas
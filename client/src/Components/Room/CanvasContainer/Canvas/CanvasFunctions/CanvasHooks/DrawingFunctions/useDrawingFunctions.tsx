import { useRef, useEffect, useContext } from "react"
import { useAppSelector } from "../../../../../../../store/hooks.ts"
import { RoomContext } from "../../../../../Room.tsx"
import { CanvasContext } from "../../../../CanvasContainer.tsx"
import { CanvasFunctionsContext } from "../../../Canvas.tsx"
import { RootState } from "../../../../../../../store/store.ts"
import { Point } from "../../../../../../../types/RoomTypes/types.ts"
import DrawStarightLine from "./DrawStraightLine.ts.ts"

const useDrawingFunctions = () => {

    const room = useAppSelector((state: RootState) => state.room)
    const socket = useContext(RoomContext).socket
    const canvasProps = useContext(CanvasContext)
    const canvasFunctionsProps = useContext(CanvasFunctionsContext)
    const props = {...canvasProps, ...canvasFunctionsProps}

    const isDrawing  = useRef<boolean>(false)
    const prevPoint = useRef<Point | null>(null)

    useEffect(() => { // drawing functions

        const mouseDown = (): void => {
            isDrawing.current = true
            props.previusDrawings.current.push(props.canvasRef.current?.toDataURL()) //save last drawing
        }
        
        const mouseUp = (): void => {
            isDrawing.current = false
            prevPoint.current = null
        }
    
        const handleDrawing = (drawing: string): void => {
            if(drawing.length > 0)
              props.setDrawing(drawing)
        }
    
        const draw = (e: MouseEvent): void => {
            if(true){
                if(props.contextRef.current && isDrawing.current){
                    const canvasRect = props.canvasRef.current?.getBoundingClientRect()
                    if(canvasRect && props.drawLine){
                        const data = {e: e, canvasRect: canvasRect, ctx: props.contextRef.current,
                            prevPoint: prevPoint, width: props.currentWidth, color: props.currentColor}
                        DrawStarightLine(data)
                        socket.emit('drawing', {drawing: props.canvasRef.current?.toDataURL(), room: room})
                    }
                }
            }
        }
    
        const canvasFill = (): void => {
            if(!props.drawLine){
                if(props.contextRef.current && props.canvasRef.current){
                    props.contextRef.current.fillStyle = props.currentColor
                    props.contextRef.current.fillRect(0 , 0, props.canvasRef.current.width, props.canvasRef.current.height)
                    socket.emit('drawing', {drawing: props.canvasRef.current?.toDataURL(), room: room})
                }
            }
        }
    
        props.canvasRef.current?.addEventListener('mousedown', mouseDown)
        window.addEventListener('mouseup', mouseUp)
        socket.on('update_drawing', handleDrawing)
        props.canvasRef.current?.addEventListener('mousemove', draw)
        props.canvasRef.current?.addEventListener('click', canvasFill)
    
        return (): void => {
            props.canvasRef.current?.removeEventListener('mousedown', mouseDown)
            window.removeEventListener('mouseup', mouseUp)
            socket.off('update_drawing', handleDrawing)
            props.canvasRef.current?.removeEventListener('mousemove', draw)
            props.canvasRef.current?.removeEventListener('click', canvasFill)
        }
    
    }, [props.currentColor, props.drawLine, props.currentWidth])
    
}

export default useDrawingFunctions
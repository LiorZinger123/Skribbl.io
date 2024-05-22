import { useEffect, useContext } from "react"
import { useAppSelector } from "../../../../../../../store/hooks"
import { RoomContext } from "../../../../../Room"
import { CanvasContext } from "../../../../CanvasContainer"
import { CanvasFunctionsContext } from "../../../Canvas"
import { RootState } from "../../../../../../../store/store"

const useUndo = () => {

    const room = useAppSelector((state: RootState) => state.room)
    const socket = useContext(RoomContext).socket
    const canvasProps = useContext(CanvasContext) 
    const canvasFunctionsProps = useContext(CanvasFunctionsContext)
    const props = {...canvasProps, ...canvasFunctionsProps}

    useEffect(() => {
        const prevDrawing = props.previusDrawings.current.pop()
        if(props.previusDrawings.current.length > 0){
            if(typeof prevDrawing === 'string'){
                props.setDrawing(prevDrawing)
                socket.emit('drawing', {drawing: prevDrawing, room: room})
            }                
        }
        else
            props.setDeleteAll(del => !del)
    }, [props.undo])

}

export default useUndo
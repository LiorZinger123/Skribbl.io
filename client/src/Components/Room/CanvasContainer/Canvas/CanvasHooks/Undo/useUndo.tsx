import React, { useEffect, useContext } from "react"
import { useAppSelector } from "../../../../../../store/hooks"
import { SocketContext } from "../../../../Room"
import { RootState } from "../../../../../../store/store"
import { Drawings } from "../../../../../../types/RoomTypes/types"

type Props = {
    previusDrawings: React.MutableRefObject<Drawings[]>, 
    setDrawing: React.Dispatch<React.SetStateAction<string>>,
    undo: boolean,
    setDeleteAll: React.Dispatch<React.SetStateAction<boolean>>,
}

const useUndo = (props: Props) => {

    const room = useAppSelector((state: RootState) => state.room)
    const socket = useContext(SocketContext)

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
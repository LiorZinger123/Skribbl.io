import React, { useEffect, useContext } from "react"
import { useAppSelector } from "../../../../../store/hooks"
import { SocketContext } from "../../../Room"
import { RootState } from "../../../../../store/store"

type Props = {
    canvasRef: React.MutableRefObject<HTMLCanvasElement | null>,
    contextRef: React.MutableRefObject<CanvasRenderingContext2D | null>,
    deleteAll: boolean
}

const DeleteAll = (props: Props) => {

    const room = useAppSelector((state: RootState) => state.room)
    const socket = useContext(SocketContext)

    useEffect(() => { 
        if(props.canvasRef.current){
            props.contextRef.current = props.canvasRef.current.getContext('2d')
            if(props.contextRef.current){
                props.contextRef.current.fillStyle = 'white'
                props.contextRef.current.fillRect(0 , 0, props.canvasRef.current.width, props.canvasRef.current.height)
                socket.emit('drawing', {drawing: props.canvasRef.current?.toDataURL(), room: room})
            }
        }
    }, [props.deleteAll])

  return (
    <></>
  )
}

export default DeleteAll
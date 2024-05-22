import React, { useEffect, useContext, useRef } from "react"
import { useAppSelector } from "../../../../../../../store/hooks"
import { RoomContext } from "../../../../../Room"
import { CanvasContext } from "../../../../CanvasContainer"
import { CanvasFunctionsContext } from "../../../Canvas"
import { RootState } from "../../../../../../../store/store"

const useDeleteAll = () => {

    const room = useAppSelector((state: RootState) => state.room)
    const socket = useContext(RoomContext).socket
    const canvasProps = useContext(CanvasContext) 
    const canvasFunctionsProps = useContext(CanvasFunctionsContext)
    const props = {...canvasProps, ...canvasFunctionsProps}
    const firstRender = useRef<boolean>(true) 

    useEffect(() => { 
        if(props.canvasRef.current){
            props.contextRef.current = props.canvasRef.current.getContext('2d')
            if(props.contextRef.current && !firstRender.current){
                props.contextRef.current.fillStyle = 'white'
                props.contextRef.current.fillRect(0 , 0, props.canvasRef.current.width, props.canvasRef.current.height)
                socket.emit('drawing', {drawing: props.canvasRef.current?.toDataURL(), room: room})
            }
        }

        const join = (): void => {
            firstRender.current = false
        }

        socket.on('join', join)

        return (): void => {
            socket.off('join', join)
        }

    }, [props.deleteAll])
    
}

export default useDeleteAll
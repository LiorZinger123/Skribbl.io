import { useRef, useEffect, useContext } from "react"
import { SocketContext } from "../../../Room"
import { useAppSelector } from "../../../../../store/hooks"
import { RootState } from "../../../../../store/store"
import { Drawings } from "../../../../../types/RoomTypes/types"

type Props = {
    setTime: React.Dispatch<React.SetStateAction<number>>,
    roundTime: React.MutableRefObject<number>,
    canvasRef: React.MutableRefObject<HTMLCanvasElement | null>,
    contextRef: React.MutableRefObject<CanvasRenderingContext2D | null>,
    previusDrawings: React.MutableRefObject<Drawings[]>,
    canDraw: React.MutableRefObject<boolean>
}

const TurnFunctions = (props: Props) => {
    
    const room = useAppSelector((state: RootState) => state.room)
    const socket = useContext(SocketContext)

    const intervalRef = useRef<NodeJS.Timeout>(null!)
    const timeoutRef = useRef<NodeJS.Timeout>(null!)
    
    useEffect(() => { // turn functions

        const startTurn = (): void => {
            
            if(props.contextRef.current){ //clear canvas every new turn
                props.contextRef.current.clearRect(0, 0, props.canvasRef.current?.width!, props.canvasRef.current?.height!)
                props.contextRef.current.fillStyle = 'white'
                props.contextRef.current.fillRect(0 , 0, props.canvasRef.current?.width!, props.canvasRef.current?.height!)
            }

            intervalRef.current = setInterval(() => {
                if(props.canDraw.current){
                    props.setTime(time => time - 1)
                    socket.emit('tick', {room: room})
                }
            }, 1000)

            timeoutRef.current = setTimeout(() => {
                endTurn()
            }, props.roundTime.current * 1000)
        }
        
        const endTurn = (): void => {
            clearInterval(intervalRef.current)
            props.previusDrawings.current = []
            props.setTime(0)
            if(props.canDraw.current){
                props.canDraw.current = false
                socket.emit('end_turn', {room: room})
            }
        }

        const enableDrawing = (): void => {
            props.canDraw.current = true
        }

        const tick = (time: number): void => {
            props.setTime(time)
        }

        const endTurnNow = (): void =>{
            clearTimeout(timeoutRef.current)
            endTurn()
        }

        socket.on('start_turn', startTurn)
        socket.on('join_turn', startTurn)
        socket.on('start_draw', enableDrawing)
        socket.on('tick', tick)
        socket.on('end_turn_now', endTurnNow)

        return (): void => {
            socket.off('start_turn', startTurn)
            socket.off('join_turn', startTurn)
            socket.off('start_draw', enableDrawing)
            socket.off('tick', tick)
            socket.off('end_turn_now', endTurn)
            clearInterval(intervalRef.current)
            clearTimeout(timeoutRef.current)
        }
    }, [])
  
    return (
        <></>
    )
}

export default TurnFunctions
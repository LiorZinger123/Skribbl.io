import { useEffect, useContext, useRef, useState } from "react"
import { EndMsgInfoType, JoinWhileEndMsg } from "../../../../../types/RoomTypes/types"
import { useAppSelector } from "../../../../../store/hooks"
import { RootState } from "../../../../../store/store"
import { RoomContext, ScreenMsgsContext } from "../../../Room"
import { ScreenMsgsFunctionsContext } from "../../ScreenMsgs"
import { StableNavigateContext } from "../../../../../App"

const useEndMsg = () => {

    const nav = useContext(StableNavigateContext)   
    const room = useAppSelector((state: RootState) => state.room)
    const username = useAppSelector((state: RootState) => state.username)
    const socket = useContext(RoomContext).socket
    const props = useContext(ScreenMsgsContext)
    const setScreenCurrentMsg = useContext(ScreenMsgsFunctionsContext).setScreenCurrentMsg
    const [time, setTime] = useState<number>(16)
    const [data, setData] = useState<EndMsgInfoType>(null!)
    const intervalRef = useRef<NodeJS.Timeout>(null!)
    const timeoutRef = useRef<NodeJS.Timeout>(null!)

    useEffect(() => {   
        
        const setWinner = (data: EndMsgInfoType) => {
            setData(data)
            
            if(username === data.owner){
                intervalRef.current = setInterval(() => {
                        setTime(time => time - 1)
                        socket.emit('end_msg_tick', {room: room}) 
                }, 1000)
                    
                timeoutRef.current = setTimeout(() => {
                    socket.emit('end_room', {room: room})
                }, 16 * 1000)
            }
        }

        const tick = (): void => {
            setTime(t => t - 1)
        }

        const join = (data: JoinWhileEndMsg): void => {
            setData(data.data)
            setTime(data.time)
        }

        const restart = (owner: string): void => {
            clearInterval(intervalRef.current)
            clearTimeout(timeoutRef.current)
            setTime(16)
            props.setRound(0)
            props.setPlayers(players => players.map(player => {
                return {...player, score: 0}
            }))
            if(username === owner)
                socket.emit('start_new_game', {room: room})
        }

        const backHome = (): void => {
            nav('/home')
        }

        socket.on('end_game', setWinner)
        socket.on('end_msg_tick', tick)
        socket.on('join_while_end_msg', join)
        socket.on('restart', restart)
        socket.on('end_room', backHome)
    
        return (): void => {
            socket.off('end_game', setWinner)
            socket.off('end_msg_tick', tick)
            socket.off('join_while_end_msg', join)
            socket.off('restart', restart)
            socket.on('end_room', backHome)
            clearInterval(intervalRef.current)
            clearTimeout(timeoutRef.current)
        }
    }, [])
    
    useEffect(() => {
        const restartGame = (): void => {
            socket.emit('restart', {room: room})
        }

        const setScreenMsgs = (): void => {
            const endMsg = 
            <div className="end-msg">
                <p>{data.winnerMsg} won the game!</p>
                {data.owner === username
                    ? <p>Press to restart game <span className="restart-game" onClick={restartGame}>RESTART</span></p>   
                    : <p>{data.owner} is deciding whether reset the game or not</p>
                }
                <p>The room will be closed in {time} seconds</p> 
            </div>
            setScreenCurrentMsg(endMsg)
        }
        
        if(data){
            setScreenMsgs()
        }
    }, [time])

}

export default useEndMsg
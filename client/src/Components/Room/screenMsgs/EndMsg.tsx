import React, { useState, useEffect, useContext, useRef } from "react"
import { EndMsgInfoType } from "../../../types/RoomTypes/types"
import { useAppSelector } from "../../../store/hooks"
import { RootState } from "../../../store/store"
import { SocketContext } from "../Room"
import { StableNavigateContext } from "../../../App"
import { PlayerType } from "../../../types/RoomTypes/types"

type Props = {
    setStartMsg: React.Dispatch<React.SetStateAction<boolean>>,
    setEndMsg: React.Dispatch<React.SetStateAction<boolean>>,
    setRound: React.Dispatch<React.SetStateAction<number>>,
    setPlayers: React.Dispatch<React.SetStateAction<PlayerType[]>>,
}

const EndMsg = (props: Props) => {

    const nav = useContext(StableNavigateContext)   
    const room = useAppSelector((state: RootState) => state.room)
    const username = useAppSelector((state: RootState) => state.username)
    const socket = useContext(SocketContext)
    const [msgInfo, setMsgInfo] = useState<EndMsgInfoType>({winnerMsg: '', owner: ''})
    const [time, setTime] = useState<number>(15)
    const intervalRef = useRef<NodeJS.Timeout>(null!)
    const timeoutRef = useRef<NodeJS.Timeout>(null!)

    useEffect(() => {   
        
        const setWinner = (data: EndMsgInfoType) => {
            setMsgInfo(data)

            intervalRef.current = setInterval(() => {
                setTime(time => time - 1)
            }, 1000)

            timeoutRef.current = setTimeout(() => {
                props.setEndMsg(false)
                if(username === data.owner)
                    socket.emit('close_room', {room: room})
                nav('/home')
            }, 15 * 1000)
        }

        const restart = (owner: string): void => {
            props.setStartMsg(true)
            props.setEndMsg(false)
            props.setRound(0)
            props.setPlayers(players => players.map(player => {
                return {...player, score: 0}
            }))
            if(username === owner)
                socket.emit('start_new_game', {room: room})
        }

        socket.on('end_game', setWinner)
        socket.on('restart', restart)
    
        return (): void => {
            socket.off('end_game', setWinner)
            socket.off('restart', restart)
            clearInterval(intervalRef.current)
            clearTimeout(timeoutRef.current)
        }
    }, [])

    const restartGame = (): void => {
        socket.emit('restart', {room: room})
    }

  return (
    <div className="screen-msg">
        <p>{msgInfo.winnerMsg} won the game!</p>
        {msgInfo.owner === username
            ? <p>Press to restart game <button onClick={restartGame}>RESTART</button></p>
            : <p>{msgInfo.owner} is deciding whether reset the game or not</p>
        }
        <p>The room will be closed in {time} seconds</p>
    </div>
  )
}

export default EndMsg
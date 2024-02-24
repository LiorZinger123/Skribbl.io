import React, { useState, useEffect, useContext, useRef } from "react"
import { EndMsgInfoType } from "../../../types/RoomTypes/types"
import { useAppSelector } from "../../../store/hooks"
import { RootState } from "../../../store/store"
import { SocketContext } from "../Room"
import { StableNavigateContext } from "../../../App"

type Props = {
    setEndMsg: React.Dispatch<React.SetStateAction<boolean>>
}

const EndMsg = (props: Props) => {

    const nav = useContext(StableNavigateContext)   
    const room = useAppSelector((state: RootState) => state.room)
    const username = useAppSelector((state: RootState) => state.username)
    const socket = useContext(SocketContext)
    const [msgInfo, setMsgInfo] = useState<EndMsgInfoType>({winner: '', owner: ''})
    const [time, setTime] = useState<number>(15)
    const intervalRef = useRef<NodeJS.Timeout>(null!)
    const timeoutRef = useRef<NodeJS.Timeout>(null!)

    useEffect(() => {   
        
        const setWinner = (data: EndMsgInfoType) => {
            console.log('dmdmdmdm')
            setMsgInfo({winner: data.winner, owner: data.owner})

            intervalRef.current = setInterval(() => {
                setTime(time => time - 1)
            }, 1000)

            timeoutRef.current = setTimeout(() => {
                clearInterval(intervalRef.current)
                props.setEndMsg(false)
                if(username === data.owner)
                    socket.emit('close_room', {room: room})
                nav('/home')
            }, 15 * 1000)
        }

        socket.on('end_game', setWinner)
    
        return (): void => {
            socket.off('end_game', setWinner)
            clearInterval(intervalRef.current)
            clearTimeout(timeoutRef.current)
        }
    }, [])

    const restartGame = (): void => {
        socket.emit('restart', {room: room})
        clearInterval(intervalRef.current)
        clearTimeout(timeoutRef.current)
    }

  return (
    <div>
        <p>{msgInfo.winner} won the game!</p>
        {msgInfo.owner === username
            ? <p>Press to restart game: <button onClick={restartGame}>RESTART</button></p>
            : <p>{msgInfo.owner} is deciding whether reset the game or not</p>
        }
        <p>The room will be closed in {time} seconds</p>
    </div>
  )
}

export default EndMsg
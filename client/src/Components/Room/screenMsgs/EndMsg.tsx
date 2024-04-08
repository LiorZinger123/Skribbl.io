import React, { useEffect, useContext, useRef } from "react"
import { EndMsgInfoType, ScreenCurrentMsgType } from "../../../types/RoomTypes/types"
import { useAppSelector } from "../../../store/hooks"
import { RootState } from "../../../store/store"
import { SocketContext } from "../Room"
import { StableNavigateContext } from "../../../App"
import { PlayerType } from "../../../types/RoomTypes/types"

type Props = {
    setRound: React.Dispatch<React.SetStateAction<number>>,
    setPlayers: React.Dispatch<React.SetStateAction<PlayerType[]>>,
    setScreenCurrentMsg: React.Dispatch<React.SetStateAction<ScreenCurrentMsgType>>,
    setTime: React.Dispatch<React.SetStateAction<number>>,
}

const EndMsg = (props: Props) => {

    const nav = useContext(StableNavigateContext)   
    const room = useAppSelector((state: RootState) => state.room)
    const username = useAppSelector((state: RootState) => state.username)
    const socket = useContext(SocketContext)
    const intervalRef = useRef<NodeJS.Timeout>(null!)
    const timeoutRef = useRef<NodeJS.Timeout>(null!)

    useEffect(() => {   
        
        const setWinner = (data: EndMsgInfoType) => {

            props.setTime(15)

            props.setScreenCurrentMsg({show: true, msg:
                <>
                    <p>{data.winnerMsg} won the game!</p>
                    {data.owner === username
                        ? <p>Press to restart game <button onClick={restartGame}>RESTART</button></p>
                        : <p>{data.owner} is deciding whether reset the game or not</p>
                    }
                    <p>The room will be closed in 15 seconds</p>
                </>
            })

            intervalRef.current = setInterval(() => {
                props.setTime(time => time - 1)
            }, 1000)

            timeoutRef.current = setTimeout(() => {
                if(username === data.owner)
                    socket.emit('close_room', {room: room})
                nav('/home')
            }, 15 * 1000)
        }

        const restartGame = (): void => {
            socket.emit('restart', {room: room})
        }

        const restart = (owner: string): void => {
            clearInterval(intervalRef.current)
            clearTimeout(timeoutRef.current)
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

  return (
    <></>
  )
}

export default EndMsg
import React, { useEffect, useContext, useRef, useState } from "react"
import { EndMsgInfoType, ScreenCurrentMsgType } from "../../../types/RoomTypes/types"
import { useAppSelector } from "../../../store/hooks"
import { RootState } from "../../../store/store"
import { SocketContext } from "../Room"
import { StableNavigateContext } from "../../../App"
import { PlayerType } from "../../../types/RoomTypes/types"

type Props = {
    setRound: React.Dispatch<React.SetStateAction<number>>,
    setPlayers: React.Dispatch<React.SetStateAction<PlayerType[]>>,
    setScreenCurrentMsg: React.Dispatch<React.SetStateAction<ScreenCurrentMsgType>>
}

const EndMsg = (props: Props) => {

    const nav = useContext(StableNavigateContext)   
    const room = useAppSelector((state: RootState) => state.room)
    const username = useAppSelector((state: RootState) => state.username)
    const socket = useContext(SocketContext)
    const [time, setTime] = useState<number>(16)
    const [data, setData] = useState<EndMsgInfoType>(null!)
    const intervalRef = useRef<NodeJS.Timeout>(null!)
    const timeoutRef = useRef<NodeJS.Timeout>(null!)

    useEffect(() => {   
        
        const setWinner = (data: EndMsgInfoType) => {
            setData(data)

            intervalRef.current = setInterval(() => {
                setTime(time => time - 1)
            }, 1000)

            timeoutRef.current = setTimeout(() => {
                if(username === data.owner)
                    socket.emit('close_room', {room: room})
                nav('/home')
            }, 16 * 1000)
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

        socket.on('end_game', setWinner)
        socket.on('restart', restart)
    
        return (): void => {
            socket.off('end_game', setWinner)
            socket.off('restart', restart)
            clearInterval(intervalRef.current)
            clearTimeout(timeoutRef.current)
        }
    }, [])
    
    useEffect(() => {
        const restartGame = (): void => {
            socket.emit('restart', {room: room})
        }

        const setScreenMsgs = (): void => {
            props.setScreenCurrentMsg({show: true, msg:
                <div className="end-msg">
                    <p>{data.winnerMsg} won the game!</p>
                    {data.owner === username
                        ? <p>Press to restart game <span className="restart-game" onClick={restartGame}>RESTART</span></p>
                        : <p>{data.owner} is deciding whether reset the game or not</p>
                    }
                    <p>The room will be closed in {time} seconds</p>
                </div>
            })
        }
        
        if(data){
            setScreenMsgs()
        }
    }, [time])

  return (
    <></>
  )
}

export default EndMsg
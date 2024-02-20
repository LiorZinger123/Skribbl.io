import React, { useState } from "react"
import { Socket } from "socket.io-client"
import { useAppSelector } from "../../store/hooks"
import { RootState } from "../../store/store"
import { PlayerType, ChatMessage } from "../../types/RoomTypes/types"

type Props = {
    socket: Socket,
    players: PlayerType[],
    setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>
}

const StartButton = (props: Props) => {

    const room = useAppSelector((state: RootState) => state.room)
    const username = useAppSelector((state: RootState) => state.username)
    const isRoomOwner = props.players.find(player => player.username === username)?.roomOwner
    const [start, setStart] = useState<boolean>(true)

    const startGame = (): void => {
        if(props.players.length > 1){
            setStart(false)
            props.socket.emit('start_game', {room: room})
        }
        else
            props.setMessages(messages => [...messages, {id: messages.length + 1 ,msg: "You need at least 2 players to start the game!"}])
    }

  return (
    <>
        {start && isRoomOwner && <button onClick={startGame}>START</button>}
    </>
  )
}

export default StartButton
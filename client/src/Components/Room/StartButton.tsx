import React, { useState } from "react"
import PlayerType from "../../types/RoomTypes/playerType"
import ChatMessage from "../../types/RoomTypes/chatMessage"
import { Socket } from "socket.io-client"

type Props = {
    socket: Socket,
    players: PlayerType[],
    username: string,
    setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>
}

const StartButton = (props: Props) => {

    const isRoomOwner = props.players.find(player => player.username === props.username)?.roomOwner
    const [start, setStart] = useState<boolean>(true)

    const startGame = (): void => {
        if(props.players.length > 1){
            setStart(false)
            props.socket.emit('startgame')
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
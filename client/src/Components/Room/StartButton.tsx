import React from "react"
import PlayerType from "../../types/RoomTypes/playerType"
import ChatMessage from "../../types/RoomTypes/chatMessage"

type Props = {
    players: PlayerType[],
    username: string,
    setStart: React.Dispatch<React.SetStateAction<boolean>>,
    setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>
}

const StartButton = (props: Props) => {

    const isRoomOwner = props.players.find(player => player.username === props.username)?.roomOwner

    const startGame = (): void => {
        if(props.players.length > 1)
            props.setStart(false)
        else
            props.setMessages(messages => [...messages, {id: messages.length + 1 ,msg: "You need at least 2 players to start the game!"}])
    }

  return (
    <>
        {isRoomOwner && <button onClick={startGame}>START</button>}
    </>
  )
}

export default StartButton
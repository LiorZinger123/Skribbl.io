import React, { useContext } from "react"
import { RoomContext } from "../../Room"
import { useAppSelector } from "../../../../store/hooks"
import { RootState } from "../../../../store/store"
import { PlayerType, ChatMessage } from "../../../../types/RoomTypes/types"

type Props = {
    setShowStartButton: React.Dispatch<React.SetStateAction<boolean>>,
    players: PlayerType[],
    setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>
}

const StartButton = (props: Props) => {

    const room = useAppSelector((state: RootState) => state.room)
    const socket = useContext(RoomContext).socket

    const startGame = (): void => {
        if(props.players.length > 1){
            socket.emit('start_game', {room: room})
            props.setShowStartButton(false)
        }
        else
            props.setMessages(messages => [...messages, {id: Date.now() ,msg: "You need at least 2 players to start the game!"}])
    }

  return (
    <button className="top-room-button start-button top-room-buttons" onClick={startGame}>START</button>
  )
}

export default StartButton
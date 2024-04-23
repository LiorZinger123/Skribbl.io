import React, { useContext } from "react"
import { SocketContext } from "./Room"
import { useAppSelector } from "../../store/hooks"
import { RootState } from "../../store/store"
import { PlayerType, ChatMessage } from "../../types/RoomTypes/types"

type Props = {
    setShowStartButton: React.Dispatch<React.SetStateAction<boolean>>,
    players: PlayerType[],
    setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>
}

const StartButton = (props: Props) => {

    const room = useAppSelector((state: RootState) => state.room)
    const socket = useContext(SocketContext)

    const startGame = (): void => {
        if(props.players.length > 1){
            socket.emit('start_game', {room: room})
            props.setShowStartButton(false)
        }
        else
            props.setMessages(messages => [...messages, {id: messages.length + 1 ,msg: "You need at least 2 players to start the game!"}])
    }

  return (
    <div className="start-button-div">
        <button className="start-button" onClick={startGame}>START</button>
    </div>
  )
}

export default StartButton
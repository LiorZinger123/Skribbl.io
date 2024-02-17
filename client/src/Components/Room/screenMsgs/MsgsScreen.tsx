import React from "react"
import { Socket } from "socket.io-client"
import PlayerType from "../../../types/RoomTypes/playerType"
import StartMsg from "./StartMsg"
import StartRoundMsgs from "./StartRoundMsgs"
import ScoresScreen from "./ScoresScreen"

type Props = {
  socket: Socket,
  players: PlayerType[],
  currentPlayerNumber: React.MutableRefObject<number>,
  username: string,
  setRound: React.Dispatch<React.SetStateAction<number>>,
  setTime: React.Dispatch<React.SetStateAction<number>>,
  roundTime: React.MutableRefObject<number>
}

const MsgsScreen = (props: Props) => {

  return (
    <>
      <StartMsg socket={props.socket} />
      <ScoresScreen socket={props.socket} />
      <StartRoundMsgs socket={props.socket} players={props.players} currentPlayerNumber={props.currentPlayerNumber} username={props.username} setRound={props.setRound} setTime={props.setTime} roundTime={props.roundTime} />
    </>
  )
}

export default MsgsScreen
import React, { useState } from "react"
import { Socket } from "socket.io-client"
import { PlayerType } from "../../../types/RoomTypes/types"
import StartMsg from "./StartMsg"
import StartRoundMsgs from "./StartRoundMsgs"
import ScoresScreen from "./ScoresScreen"

type Props = {
  socket: Socket,
  players: PlayerType[],
  setPlayers: React.Dispatch<React.SetStateAction<PlayerType[]>>,
  currentPlayerNumber: React.MutableRefObject<number>,
  setRound: React.Dispatch<React.SetStateAction<number>>,
  setTime: React.Dispatch<React.SetStateAction<number>>,
  roundTime: React.MutableRefObject<number>,
  round: number,
  maxRounds: number
}

const ScreenMsgs = (props: Props) => {

  const [startMsg, setStartMsg] = useState<boolean>(true)
  const [endMsg, setEndMsg] = useState<boolean>(false)

  return (
    <>
      {startMsg && <StartMsg socket={props.socket} players={props.players} setStartMsg={setStartMsg} />}
      <ScoresScreen socket={props.socket} players={props.players} currentPlayerNumber={props.currentPlayerNumber} setPlayers={props.setPlayers} round={props.round} maxRounds={props.maxRounds} setEndMsg={setEndMsg} />
      <StartRoundMsgs socket={props.socket} players={props.players} currentPlayerNumber={props.currentPlayerNumber} setRound={props.setRound} setTime={props.setTime} roundTime={props.roundTime} />
    </>
  )
}

export default ScreenMsgs
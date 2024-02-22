import React, { useState } from "react"
import { Socket } from "socket.io-client"
import { PlayerType } from "../../../types/RoomTypes/types"
import StartMsg from "./StartMsg"
import StartRoundMsgs from "./StartRoundMsgs"
import ScoresScreen from "./ScoresScreen"

type Props = {
  players: PlayerType[],
  setPlayers: React.Dispatch<React.SetStateAction<PlayerType[]>>,
  painter: React.MutableRefObject<string>,
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
      {startMsg && <StartMsg players={props.players} setStartMsg={setStartMsg} painter={props.painter} />}
      <ScoresScreen players={props.players} painter={props.painter} setPlayers={props.setPlayers} round={props.round} maxRounds={props.maxRounds} setEndMsg={setEndMsg} />
      <StartRoundMsgs players={props.players} painter={props.painter} setRound={props.setRound} setTime={props.setTime} roundTime={props.roundTime} />
    </>
  )
}

export default ScreenMsgs
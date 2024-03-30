import React, { ReactNode, useState } from "react"
import { PlayerType, ScreenCurrentMsgType } from "../../../types/RoomTypes/types"
import StartMsg from "./StartMsg"
import StartRoundMsgs from "./StartRoundMsgs"
import ScoresScreen from "./ScoresScreen"
import EndMsg from "./EndMsg"

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

  const [screenCurrentMsg, setScreenCurrentMsg] = useState<ScreenCurrentMsgType>({show: false, msg: ''}) //change type any in types

  return (
    <div className="screen-msgs">
      {screenCurrentMsg.show && screenCurrentMsg.msg}
      <StartMsg players={props.players} painter={props.painter} setScreenCurrentMsg={setScreenCurrentMsg} />
      <StartRoundMsgs players={props.players} painter={props.painter} setRound={props.setRound} setTime={props.setTime} roundTime={props.roundTime} setScreenCurrentMsg={setScreenCurrentMsg} />
      <ScoresScreen players={props.players} painter={props.painter} setPlayers={props.setPlayers} round={props.round} maxRounds={props.maxRounds} setScreenCurrentMsg={setScreenCurrentMsg} />
      <EndMsg setRound={props.setRound} setPlayers={props.setPlayers} setScreenCurrentMsg={setScreenCurrentMsg} setTime={props.setTime} />
    </div>
  )
}

export default ScreenMsgs
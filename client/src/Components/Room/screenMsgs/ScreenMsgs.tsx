import React, { useEffect, useState, useContext } from "react"
import { SocketContext } from "../Room"
import { PlayerType, ScreenCurrentMsgType } from "../../../types/RoomTypes/types"
import StartMsg from "./StartMsg"
import StartRoundMsgs from "./StartRoundMsgs"
import ScoresScreen from "./ScoresScreen"
import EndMsg from "./EndMsg"
import { Word } from "../../../types/RoomTypes/types"

type Props = {
  players: PlayerType[],
  setPlayers: React.Dispatch<React.SetStateAction<PlayerType[]>>,
  painter: React.MutableRefObject<string>,
  setRound: React.Dispatch<React.SetStateAction<number>>,
  setTime: React.Dispatch<React.SetStateAction<number>>,
  roundTime: React.MutableRefObject<number>,
  round: number,
  maxRounds: number,
  currentWord: Word
}

const ScreenMsgs = (props: Props) => {

  const socket = useContext(SocketContext)
  const [screenCurrentMsg, setScreenCurrentMsg] = useState<ScreenCurrentMsgType>({show: false, msg: ''}) //change type any in types
  const [roomClosed, setRoomClosed] = useState<boolean>(false)

  useEffect(() => {
    const disableScreen = (): void => {
      setRoomClosed(true)
    }

    socket.on('room_closed', disableScreen)

    return (): void => {
      socket.off('room_closed', disableScreen)
    }
  }, [])

  return (
    <>
      {!roomClosed && 
        <div className={screenCurrentMsg.show ? "screen-msgs" : ""}> 
          {screenCurrentMsg.show && screenCurrentMsg.msg}
          <StartMsg players={props.players} painter={props.painter} setScreenCurrentMsg={setScreenCurrentMsg} />
          <StartRoundMsgs players={props.players} painter={props.painter} setRound={props.setRound} setTime={props.setTime} roundTime={props.roundTime} setScreenCurrentMsg={setScreenCurrentMsg} />
          <ScoresScreen players={props.players} painter={props.painter} setPlayers={props.setPlayers} round={props.round} maxRounds={props.maxRounds} setScreenCurrentMsg={setScreenCurrentMsg} currentWord={props.currentWord} />
          <EndMsg setRound={props.setRound} setPlayers={props.setPlayers} setScreenCurrentMsg={setScreenCurrentMsg} />
        </div>
      }
    </>
  )
}

export default ScreenMsgs
import React from "react"
import { PlayerType, ScreenCurrentMsgType, Word } from "../../../../types/RoomTypes/types"
import useStartMsg from "../ScreenMsgsHooks/StartMsg/useStartMsg"
import useStartRoundMsgs from "../ScreenMsgsHooks/StartRoundMsgs/useStartRoundMsgs"
import useScoresMsg from "../ScreenMsgsHooks/ScoresMsg/useScoresMsg"
import useEndMsg from "../ScreenMsgsHooks/EndMsg/useEndMsg"

type Props = {
    players: PlayerType[],
    setPlayers: React.Dispatch<React.SetStateAction<PlayerType[]>>,
    painter: React.MutableRefObject<string>,
    setScreenCurrentMsg: React.Dispatch<React.SetStateAction<ScreenCurrentMsgType>>,
    setRound: React.Dispatch<React.SetStateAction<number>>,
    setTime: React.Dispatch<React.SetStateAction<number>>,
    roundTime:  React.MutableRefObject<number>,
    round: number,
    maxRounds: number,
    currentWord: Word
}

const ScreenMsgsFunctions = (props: Props) => {
  
    useStartMsg({players: props.players, painter: props.painter, setScreenCurrentMsg: props.setScreenCurrentMsg})
    useStartRoundMsgs({players: props.players, painter: props.painter, setRound: props.setRound, setTime: props.setTime, roundTime: props.roundTime, setScreenCurrentMsg: props.setScreenCurrentMsg})
    useScoresMsg({players: props.players, painter: props.painter, setPlayers: props.setPlayers, round: props.round, maxRounds: props.maxRounds, setScreenCurrentMsg: props.setScreenCurrentMsg, currentWord: props.currentWord})
    useEndMsg({setRound: props.setRound, setPlayers: props.setPlayers, setScreenCurrentMsg: props.setScreenCurrentMsg})

    return (
    <></>
  )
}

export default ScreenMsgsFunctions
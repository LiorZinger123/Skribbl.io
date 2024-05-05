import React, { useEffect, useState, useContext, createElement } from "react"
import { SocketContext } from "../Room"
import { JoinWhileScreenMsg, PlayerType, ScreenCurrentMsgType, SerializedElement } from "../../../types/RoomTypes/types"
import ScreenMsgsFunctions from "./ScreenMsgsFunctions/ScreenMsgsFunctions"
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
  const [screenCurrentMsg, setScreenCurrentMsg] = useState<ScreenCurrentMsgType>({show: false, msg: null})
  const [roomClosed, setRoomClosed] = useState<boolean>(false)

  useEffect(() => {
    const createJSXFromSerialized = (serializedElement: string | SerializedElement): JSX.Element => {
      const {type, props} = typeof serializedElement === 'string' ? JSON.parse(serializedElement) : serializedElement
      const children = props ? props.children.map((child: string | SerializedElement) => {
        if(typeof child === 'string' || typeof child === 'number')
          return child
        else
          return createJSXFromSerialized(child)
      })
      : undefined
      return createElement(type, {...props, children})
    }
    
    const setCurrentScreenStatus = (data: JoinWhileScreenMsg): void => {
      const jsxElement = createJSXFromSerialized(data.msg)
      setScreenCurrentMsg({show: true, msg: jsxElement})
      if(data.time !== props.roundTime.current)
        props.setTime(data.time)
    }

    const disableScreen = (): void => {
      setRoomClosed(true)
    }

    socket.on('join_while_msg', setCurrentScreenStatus)
    socket.on('room_closed', disableScreen)

    return (): void => {
      socket.off('join_while_msg', setCurrentScreenStatus)  
      socket.off('room_closed', disableScreen)
    }
  }, [])

  return (
    <>
      {!roomClosed && 
        <div className={screenCurrentMsg.show ? "screen-msgs" : ""}> 
          {screenCurrentMsg.show && screenCurrentMsg.msg}
          {<ScreenMsgsFunctions {...props} setScreenCurrentMsg={setScreenCurrentMsg} />}
        </div>
      }
    </>
  )
}

export default ScreenMsgs
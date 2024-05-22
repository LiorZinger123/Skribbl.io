import React, { useEffect, useState, useContext, ReactElement, createContext } from "react"
import { RoomContext, ScreenMsgsContext } from "../Room"
import { JoinWhileScreenMsg } from "../../../types/RoomTypes/types"
import { ScreenMsgsFunctionsContextType } from "../../../types/RoomTypes/contextsTypes"
import ScreenMsgsFunctions from "./ScreenMsgsFunctions/ScreenMsgsFunctions"

export const ScreenMsgsFunctionsContext = createContext<ScreenMsgsFunctionsContextType>(null!)

const ScreenMsgs = () => {

  const socket = useContext(RoomContext).socket
  const props = useContext(ScreenMsgsContext)
  const [screenCurrentMsg, setScreenCurrentMsg] = useState<ReactElement | null>(null)
  const [roomClosed, setRoomClosed] = useState<boolean>(false)

  useEffect(() => {
    const jsxStringToElement = (jsxString: string): JSX.Element | null => {
      const container = document.createElement('div')
      container.innerHTML = jsxString
      const firstChild = container.firstChild
      if(firstChild instanceof HTMLElement){
        const reactElement = React.createElement(firstChild.tagName.toLowerCase(), {
          dangerouslySetInnerHTML: { __html: firstChild.innerHTML }
        })
        return reactElement
      }
      else
        return null
    }
    
    const setCurrentScreenStatus = (data: JoinWhileScreenMsg): void => {
      const jsxElement = jsxStringToElement(data.msg)
      setScreenCurrentMsg(jsxElement)
      if(data.time !== props.turnTime.current)
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
    <ScreenMsgsFunctionsContext.Provider value={{setScreenCurrentMsg: setScreenCurrentMsg}}>
      {!roomClosed && 
        <div className={screenCurrentMsg !== null ? "screen-msgs" : ""}> 
          {screenCurrentMsg !== null && screenCurrentMsg}
          <ScreenMsgsFunctions />
        </div>
      }
    </ScreenMsgsFunctionsContext.Provider>
  )
}

export default ScreenMsgs
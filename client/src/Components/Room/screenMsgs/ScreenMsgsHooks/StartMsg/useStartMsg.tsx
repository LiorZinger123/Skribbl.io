import { useEffect, useRef, useContext } from "react"
import { RoomContext, ScreenMsgsContext } from "../../../Room"
import { useAppSelector } from "../../../../../store/hooks"
import { RootState } from "../../../../../store/store"
import ReactDOMServer from 'react-dom/server'
import { ScreenMsgsFunctionsContext } from "../../ScreenMsgs"

const useStartMsg = () => {

  const username = useAppSelector((state: RootState) => state.username)
  const room = useAppSelector((state: RootState) => state.room)
  const socket = useContext(RoomContext).socket
  const painter = useContext(RoomContext).painter
  const players = useContext(ScreenMsgsContext).players
  const setScreenCurrentMsg = useContext(ScreenMsgsFunctionsContext).setScreenCurrentMsg
  const timeoutRef = useRef<NodeJS.Timeout>(null!)

  useEffect(() => {

    const startMsg = (): void => {
      const msg = <p>Starting Game!</p>
      painter.current = players[0].username
      setScreenCurrentMsg(msg)
      if(painter.current === username)
        socket.emit('new_screen_msg', {room: room, msg: ReactDOMServer.renderToString(msg)})
      timeoutRef.current = setTimeout(() => {
        if(painter.current === username)
          socket.emit('choose_word', {room: room})
      }, 3000)
    }

    socket.on('start_game', startMsg)

    return (): void => {
      socket.off('start_game', startMsg)
    }

  }, [players])

}

export default useStartMsg
import { useEffect, useRef, useContext } from "react"
import { SocketContext } from "../Room"
import { useAppSelector } from "../../../store/hooks"
import { RootState } from "../../../store/store"
import { PlayerType, ScreenCurrentMsgType } from "../../../types/RoomTypes/types"

type Props = {
  players: PlayerType[],
  painter: React.MutableRefObject<string>,
  setScreenCurrentMsg: React.Dispatch<React.SetStateAction<ScreenCurrentMsgType>>
}

const StartMsg = (props: Props) => {

  const room = useAppSelector((state: RootState) => state.room)
  const socket = useContext(SocketContext)
  const username = useAppSelector((state: RootState) => state.username)
  const timeoutRef = useRef<NodeJS.Timeout>(null!)

  useEffect(() => {

    const startMsg = (): void => {
      props.painter.current = props.players[0].username
      props.setScreenCurrentMsg({show: true,  msg: <p>Starting Game!</p>})
      timeoutRef.current = setTimeout(() => {
        if(props.players[0].username === username)
          socket.emit('choose_word', {room: room})
      }, 3000)
    }

    socket.on('start_game', startMsg)

    return (): void => {
      socket.off('start_game', startMsg)
    }
  }, [props.players])

  return (
    <></>
  )
}

export default StartMsg
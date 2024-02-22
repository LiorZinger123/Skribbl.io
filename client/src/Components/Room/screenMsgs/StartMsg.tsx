import { useEffect, useRef, useState, useContext } from "react"
import { SocketContext } from "../Room"
import { useAppSelector } from "../../../store/hooks"
import { RootState } from "../../../store/store"
import { PlayerType } from "../../../types/RoomTypes/types"

type Props = {
  players: PlayerType[],
  setStartMsg: React.Dispatch<React.SetStateAction<boolean>>,
  painter: React.MutableRefObject<string>
}

const StartMsg = (props: Props) => {

  const room = useAppSelector((state: RootState) => state.room)
  const socket = useContext(SocketContext)
  const username = useAppSelector((state: RootState) => state.username)
  const [screenMsg, setScreenMsg] = useState<string>('')
  const timeoutRef = useRef<NodeJS.Timeout>(null!)

  useEffect(() => {

    const startMsg = (msg: string): void => {
      props.painter.current = props.players[0].username
      setScreenMsg(msg)
      timeoutRef.current = setTimeout(() => {
        props.setStartMsg(false)
        if(props.players[0].username === username)
          socket.emit('choose_word', {room: room})
      }, 3000)
    }

    socket.on('start_game', startMsg)

    return (): void => {
      socket.off('start_game', startMsg)
      clearTimeout(timeoutRef.current)
    }
  }, [props.players])

  return (
    <div>
        <p>{screenMsg}</p>
    </div>
  )
}

export default StartMsg
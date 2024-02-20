import { useEffect, useRef, useState } from "react"
import { Socket } from "socket.io-client"
import { useAppSelector } from "../../../store/hooks"
import { RootState } from "../../../store/store"
import { PlayerType } from "../../../types/RoomTypes/types"

type Props = {
  socket: Socket,
  players: PlayerType[],
  setStartMsg: React.Dispatch<React.SetStateAction<boolean>>
}

const StartMsg = (props: Props) => {

  const room = useAppSelector((state: RootState) => state.room)
  const username = useAppSelector((state: RootState) => state.username)
  const [screenMsg, setScreenMsg] = useState<string>('')
  const timeoutRef = useRef<NodeJS.Timeout>(null!)

  useEffect(() => {

    const startMsg = (msg: string): void => {
      setScreenMsg(msg)
      timeoutRef.current = setTimeout(() => {
        props.setStartMsg(false)
        if(props.players[0].username === username)
          props.socket.emit('choose_word', {room: room})
      }, 3000)
    }

    props.socket.on('start_game', startMsg)

    return (): void => {
      props.socket.off('start_game', startMsg)
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
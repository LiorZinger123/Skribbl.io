import { useContext } from "react"
import { StableNavigateContext } from "../../App"
import { SocketContext } from "./Room"
import { useAppSelector } from "../../store/hooks"
import { RootState } from "../../store/store"

type Props = {
    painter: React.MutableRefObject<string>
}

export const LeaveRoom = (props: Props) => {

    const nav = useContext(StableNavigateContext)
    const room = useAppSelector((state: RootState) => state.room)
    const username = useAppSelector((state: RootState) => state.username)
    const socket = useContext(SocketContext)

    const leaveRoom = (): void => {
        socket.emit('leave_Room', {username: username, room: room, currentPainter: props.painter.current})
        nav('/home')
    }

  return (
      <button className="leave-room" onClick={leaveRoom}>leave</button>
  )
}

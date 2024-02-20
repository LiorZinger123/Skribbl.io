import { useContext } from "react"
import { StableNavigateContext } from "../../App"
import { Socket } from "socket.io-client"
import { useAppSelector } from "../../store/hooks"
import { RootState } from "../../store/store"

type Props = {
    socket: Socket
}

export const LeaveRoom = (props: Props) => {

    const nav = useContext(StableNavigateContext)
    const room = useAppSelector((state: RootState) => state.room)
    const username = useAppSelector((state: RootState) => state.username)

    const leaveRoom = (): void => {
        props.socket.emit('leave_Room', {username: username, room: room})
        nav('/home')
    }

  return (
      <button onClick={leaveRoom}>leave</button>
  )
}

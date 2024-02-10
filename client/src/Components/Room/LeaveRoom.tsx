import { useContext } from "react"
import { StableNavigateContext } from "../../App"
import { Socket } from "socket.io-client"

type Props = {
    socket: Socket,
    username: string
}

export const LeaveRoom = (props: Props) => {

    const nav = useContext(StableNavigateContext)

    const leaveRoom = (): void => {
        props.socket.emit('leaveRoom', {username: props.username})
        nav('/home')
    }

  return (
    <>
        <button onClick={leaveRoom}>leave</button>
    </>
  )
}

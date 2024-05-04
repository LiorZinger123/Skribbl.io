import { useEffect, useState, useContext } from "react"
import { SocketContext } from "../Room"
import RoomMsg from "../RoomMsg/RoomMsg"

type Props = {
    painter: React.MutableRefObject<string>,
    showStartButton: boolean
}

const LeaveRoom = (props: Props) => {

    const socket = useContext(SocketContext)  
    const [showMsg, setShowMsg] = useState<boolean>(false)
    const msg = 'Are you sure you want to leave the room?'
    const [roomClosed, setRoomClosed] = useState<boolean>(false)

    useEffect(() => {
      const disableClick = (): void => {
        setRoomClosed(true)
      }

      socket.on('room_closed', disableClick)

      return (): void => {
        socket.off('room_closed', disableClick)
      }
    }, [])

    const handleClick = (): void => {
      if(!roomClosed)
        setShowMsg(true)
    }

  return (
    <>
        <button className={`top-room-button leave-button ${!showMsg ? 'top-room-buttons leave-button-enabled' : 'leave-button-disabled'} 
          ${!props.showStartButton && 'leave-button-without-start'}`} onClick={handleClick} disabled={showMsg}>Leave</button>
        {showMsg && <RoomMsg msg={msg} msgType='leave' setShowMsg={setShowMsg} painter={props.painter} />}
    </>
  )
}

export default LeaveRoom
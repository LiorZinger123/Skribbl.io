import { useEffect, useState, useContext } from "react"
import { SocketContext } from "./Room"
import RoomMsg from "./RoomMsg"

type Props = {
    painter: React.MutableRefObject<string>
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

    console.log('before', showMsg)
    const handleClick = (): void => {
      console.log('out', showMsg)
      if(!showMsg && !roomClosed){
        console.log('in', showMsg)
        setShowMsg(true)    
      }
    }

  return (
    <>
        <p className={`leave-room ${!showMsg && !roomClosed && 'leave-room-button'}`} onClick={handleClick}>Leave Room</p>
        {showMsg && <RoomMsg msg={msg} msgType='leave' setShowMsg={setShowMsg} painter={props.painter} />}
    </>
  )
}

export default LeaveRoom
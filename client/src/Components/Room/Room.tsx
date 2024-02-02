import { useEffect, useRef } from "react"
import { io } from "socket.io-client"

const Room = () => {
 
  const socket = io('http://127.0.0.1:8080')
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  // const room = useContext(AppContext).room
  // const username = useContext(AppContext).username
  
  useEffect(() => {
    const handleMsg = (msg: string): void => {
      console.log(msg)
    }
    socket.emit('join', {room: room, username: username})
    socket.on('message', handleMsg)
    return (): void => {
      socket.off('message', handleMsg)
      socket.disconnect()
    }
  }, [])
  
  // useEffect(() => {

  //   const context = canvasRef.current?.getContext('2d')
  // }, [])

  return (
    <div>
      {room.current}
      <canvas ref={canvasRef}>

      </canvas>
    </div>
  )
}

export default Room
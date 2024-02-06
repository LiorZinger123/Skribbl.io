import { useEffect, useState } from "react"
import { Socket, io } from "socket.io-client"
import { useAppSelector } from "../../store/hooks"
import { RootState } from "../../store/store"
import { StableNavigateContext } from "../../App"
import { useContext } from "react"
import ChatMessage from "../../types/chatMessage"
import { fetchToApi } from "../../Api/fetch"
import Chat from "./Chat"
import Canvas from "./Canvas"

const Room = () => {
 
  const nav = useContext(StableNavigateContext)
  const room = useAppSelector((state: RootState) => state.room)
  const username = useAppSelector((state: RootState) => state.username)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [socket, setSocket] = useState<Socket>(null!)
  const [drawing, setDrawing] = useState<string>('')

  useEffect(() => {
    const handleMsg = (msg: string): void => {
      setMessages(messages => [...messages, { id: messages.length + 1, msg: msg}])
    }

    const handleDrawing = (drawing: string): void => {
      if(drawing.length > 0)
        setDrawing(drawing)
    }

    const newSocket = io('http://127.0.0.1:8080')
    setSocket(newSocket)
    newSocket.emit('join', {room: room, username: username})
    newSocket.on('updatedrawing', handleDrawing)
    newSocket.on('message', handleMsg)
    newSocket.on('leaveroom', handleMsg)

    return (): void => {
      newSocket.off('updatedrawing', handleDrawing)
      newSocket.off('message', handleMsg)
      newSocket.off('leaveroom', handleMsg)
      newSocket.disconnect()
    }
  }, [])
  
  const leaveRoom = async (): Promise<void> => {
    try{
      await fetchToApi('users/leaveroom', {id: room})
      socket.emit('leaveRoom', {username: username})
      nav('/home')
    }
    catch{
      //show error
    }
  }

  return (
    <div>
      <Canvas drawing={drawing} socket={socket} room={room} />
      <Chat socket={socket} room={room} messages={messages} />
      <button onClick={leaveRoom}>leave</button>
    </div>
  )
}

export default Room
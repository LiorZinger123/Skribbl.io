import { FormEvent, useEffect, useRef, useState } from "react"
import { Socket, io } from "socket.io-client"
import { useAppSelector } from "../../store/hooks"
import { RootState } from "../../store/store"
import { StableNavigateContext } from "../../App"
import { useContext } from "react"
import ChatMessage from "../../types/chatMessage"
import { fetchToApi } from "../../Api/fetch"

const Room = () => {
 
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const nav = useContext(StableNavigateContext)
  const room = useAppSelector((state: RootState) => state.room)
  const username = useAppSelector((state: RootState) => state.username)
  const [msg, setMsg] = useState<string>('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [socket, setSocket] = useState<Socket>(null!)

  useEffect(() => {
    const handleMsg = (msg: string): void => {
      setMessages(messages => [...messages, { id: messages.length + 1, msg: msg}])
    }

    const newSocket = io('http://127.0.0.1:8080')
    setSocket(newSocket)
    newSocket.emit('join', {room: room, username: username})
    newSocket.on('message', handleMsg)

    return (): void => {
      newSocket.off('message', handleMsg)
      newSocket.disconnect()
    }
  }, [])
  
  // useEffect(() => {

  //   const context = canvasRef.current?.getContext('2d')
  // }, [])

  const leaveRoom = async (): Promise<void> => {
    try{
      await fetchToApi('users/leaveroom', room)
      socket.emit('leaveRoom', {username: username})
      nav('/home')
    }
    catch{
      //show error
    }
  }

  const sendMsg = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    socket.send({room: room, msg: msg})
    setMsg('')
  }

  return (
    <div>
      <canvas ref={canvasRef}>

      </canvas>
      <div className="chat">
        {messages.map(msg => (
          <p key={msg.id}>{msg.msg}</p>
        ))}
        <form onSubmit={sendMsg}>
          <input type="text" value={msg} onChange={e => setMsg(e.target.value)} required />
          <button>SEND</button>
        </form>
      </div>
      <button onClick={leaveRoom}>leave</button>
    </div>
  )
}

export default Room
import { useEffect, useRef, useState } from "react"
import { Socket, io } from "socket.io-client"
import { useAppSelector } from "../../store/hooks"
import { RootState } from "../../store/store"
import { StableNavigateContext } from "../../App"
import { useContext } from "react"
import ChatMessage from "../../types/chatMessage"
import Chat from "./Chat"
import Canvas from "./Canvas"

const Room = () => {
 
  const nav = useContext(StableNavigateContext)
  const room = useAppSelector((state: RootState) => state.room)
  const username = useAppSelector((state: RootState) => state.username)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [socket, setSocket] = useState<Socket>(null!)
  const [drawing, setDrawing] = useState<string>('')
  const [start, setStart] = useState<boolean>(true)
  const myTurn = useRef<boolean>(true)

  useEffect(() => {
    const startGame = (players: number): void => {
      if(players > 1)
        setStart(false)
      else
        handleMsg("You need at least 2 players to start the game!")
    }

    const handleMsg = (msg: string): void => {
      setMessages(messages => [...messages, { id: messages.length + 1, msg: msg}])
    }

    const handleDrawing = (drawing: string): void => {
      if(!myTurn.current && drawing.length > 0)
        setDrawing(drawing)
    }

    const newSocket = io('http://127.0.0.1:8080')
    setSocket(newSocket)
    newSocket.emit('join', {room: room, username: username})
    newSocket.on('players', startGame)
    newSocket.on('updatedrawing', handleDrawing)
    newSocket.on('message', handleMsg)
    newSocket.on('leaveroom', handleMsg)

    return (): void => {
      newSocket.off('players', startGame)
      newSocket.off('updatedrawing', handleDrawing)
      newSocket.off('message', handleMsg)
      newSocket.off('leaveroom', handleMsg)
      newSocket.disconnect()
    }
  }, [])
  
  const leaveRoom = async (): Promise<void> => {
    socket.emit('leaveRoom', {username: username})
    nav('/home')
  }

  const startGame = (): void => {
    socket.emit('getplayers', {room: room})
  }

  return (
    <div>
      <Canvas drawing={drawing} socket={socket} room={room} myTurn={myTurn.current} />
      {start && <button onClick={startGame}>START</button>}  
      <Chat socket={socket} room={room} username={username} messages={messages} />
      <button onClick={leaveRoom}>leave</button>
    </div>
  )
}

export default Room
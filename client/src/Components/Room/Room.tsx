import { useEffect, useRef, useState } from "react"
import { Socket, io } from "socket.io-client"
import { useAppSelector } from "../../store/hooks"
import { RootState } from "../../store/store"
import { StableNavigateContext } from "../../App"
import { useContext } from "react"
import ChatMessage from "../../types/RoomTypes/chatMessage"
import Chat from "./Chat"
import Canvas from "./Canvas"
import Players from "./Players"
import PlayerType from "../../types/RoomTypes/playerType"
import { SetConnectedPlayersType } from "../../types/RoomTypes/setConnectedPlayersType"
import StartButton from "./StartButton"

const Room = () => {
 
  const nav = useContext(StableNavigateContext)
  const room = useAppSelector((state: RootState) => state.room)
  const username = useAppSelector((state: RootState) => state.username)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [socket, setSocket] = useState<Socket>(null!)
  const [drawing, setDrawing] = useState<string>('')
  const [start, setStart] = useState<boolean>(false)
  const myTurn = useRef<boolean>(true)
  const [players, setPlayers] = useState<PlayerType[]>([])

  useEffect(() => {

    const setConnectedPlayers = (data: SetConnectedPlayersType): void => {
      if(Array.isArray(data))
        setPlayers(currentPlayers => [...currentPlayers, ...data])
      else{
        if(typeof data !== 'string')
          setPlayers(currentPlayers => [...currentPlayers, data])
        else
          setPlayers(currentPlayers => currentPlayers.filter(player => player.username !== data))
      }
    }

    const handleMsg = (msg: string): void => {
      setMessages(messages => [...messages, { id: messages.length + 1, msg: msg}])
    }

    const handleDrawing = (drawing: string): void => {
      if(drawing.length > 0)
        setDrawing(drawing)
    }

    // const leaveOnRefresh = (e: BeforeUnloadEvent) => {
      // e.preventDefault()  
      // newSocket.emit('leaveRoom', {username: username})
      // nav('/home')
      // e.returnValue = 'dd'
    // }

    const newSocket = io('http://127.0.0.1:8080')
    setSocket(newSocket)
    newSocket.emit('join', {room: room, username: username})
    newSocket.on('players', setConnectedPlayers)
    newSocket.on('updatedrawing', handleDrawing)
    newSocket.on('message', handleMsg)
    newSocket.on('leaveroom', handleMsg)
    // window.addEventListener('beforeunload', leaveOnRefresh)

    return (): void => {
      newSocket.off('players', setConnectedPlayers)
      newSocket.off('updatedrawing', handleDrawing)
      newSocket.off('message', handleMsg)
      newSocket.off('leaveroom', handleMsg)
      // window.removeEventListener('beforeunload', leaveOnRefresh)
      newSocket.disconnect()
    }
  }, [])
  
  const leaveRoom = (): void => {
    socket.emit('leaveRoom', {username: username})
    nav('/home')
  }

  return (
    <div>
      <Players players={players} />
      <Canvas drawing={drawing} socket={socket} room={room} myTurn={myTurn.current} />
      {!start && <StartButton players={players} username={username} setStart={setStart} setMessages={setMessages} />}
      <Chat socket={socket} room={room} username={username} messages={messages} />
      <button onClick={leaveRoom}>leave</button>
    </div>
  )
}

export default Room
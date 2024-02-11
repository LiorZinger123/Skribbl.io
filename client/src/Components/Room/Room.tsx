import { useEffect, useRef, useState } from "react"
import { Socket, io } from "socket.io-client"
import { useAppSelector } from "../../store/hooks"
import { RootState } from "../../store/store"
// import { StableNavigateContext } from "../../App"
// import { useContext } from "react"
import ChatMessage from "../../types/RoomTypes/chatMessage"
import PlayerType from "../../types/RoomTypes/playerType"
import Chat from "./Chat"
import Canvas from "./Canvas"
import Players from "./Players"
import StartButton from "./StartButton"
import MsgsScreen from "./MsgsScreen"
import { LeaveRoom } from "./LeaveRoom"
import { Word } from "../../types/RoomTypes/screenMsgs"

const Room = () => {
 
  // const nav = useContext(StableNavigateContext)
  const room = useAppSelector((state: RootState) => state.room)
  const username = useAppSelector((state: RootState) => state.username)
  const [socket, setSocket] = useState<Socket>(null!)
  const [players, setPlayers] = useState<PlayerType[]>([])
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [currentWord, setCurrentWord] = useState<Word>({word: '', length: ''})
  const turnsInRound = useRef<number>(0)
  const [round, setRound] = useState<number>(1) 

  useEffect(() => {

    const handleWord = (word: Word): void => {
      setCurrentWord(word)
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
    newSocket.on('startturn', handleWord)
    // window.addEventListener('beforeunload', leaveOnRefresh)

    return (): void => {
      newSocket.off('startturn', handleWord)
      // window.removeEventListener('beforeunload', leaveOnRefresh)
      newSocket.disconnect()
    }
  }, [])
  
  return (
    <>
      {socket &&
        <div>
          <Players socket={socket} players={players} setPlayers={setPlayers} />
          <Canvas socket={socket} players={players} username={username} currentPlayerNumber={turnsInRound} />
          <MsgsScreen socket={socket} players={players} currentPlayerNumber={turnsInRound} username={username} setRound={setRound} />
          <StartButton socket={socket} players={players} username={username} setMessages={setMessages} />
          <Chat socket={socket} username={username} messages={messages} setMessages={setMessages} currentWord={currentWord} />
          <LeaveRoom socket={socket} username={username} />
        </div> 
      }
    </>
  )
}

export default Room
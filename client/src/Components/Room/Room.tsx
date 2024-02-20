import { useEffect, useRef, useState } from "react"
import { Socket, io } from "socket.io-client"
import { useAppSelector } from "../../store/hooks"
import { RootState } from "../../store/store"
// import { StableNavigateContext } from "../../App"
// import { useContext } from "react"
import { ChatMessage, PlayerType, RoomDetails, Word } from "../../types/RoomTypes/types"
import Chat from "./Chat"
import Canvas from "./Canvas/Canvas"
import Players from "./Players"
import StartButton from "./StartButton"
import ScreenMsgs from "./ScreenMsgs/ScreenMsgs"
import { LeaveRoom } from "./LeaveRoom"

const Room = () => {
 
  // const nav = useContext(StableNavigateContext)
  const room = useAppSelector((state: RootState) => state.room)
  const username = useAppSelector((state: RootState) => state.username)

  const [socket, setSocket] = useState<Socket>(null!)
  const [players, setPlayers] = useState<PlayerType[]>([])
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [currentWord, setCurrentWord] = useState<Word>({word: '', length: ''})

  const roundTime = useRef<number>(0)
  const [time, setTime] = useState<number>(0)

  const turnsInRound = useRef<number>(0)
  const [round, setRound] = useState<number>(1) 
  const maxRounds = useRef<number>(0)

  useEffect(() => {

    const handleDetails = (roomDetails: RoomDetails): void => {
      roundTime.current = roomDetails.time
      maxRounds.current = roomDetails.rounds
    }

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
    newSocket.on('room_details', handleDetails)
    newSocket.on('start_turn', handleWord)
    // window.addEventListener('beforeunload', leaveOnRefresh)

    return (): void => {
      newSocket.off('room_details', handleDetails)
      newSocket.off('start_turn', handleWord)
      // window.removeEventListener('beforeunload', leaveOnRefresh)
      newSocket.disconnect()
    }
  }, [])
  
  return (
    <>
      {socket &&
        <div>
          {time}
          <Players socket={socket} players={players} setPlayers={setPlayers} />
          <Canvas socket={socket} players={players} currentPlayerNumber={turnsInRound} setTime={setTime} roundTime={roundTime}/>
          <ScreenMsgs socket={socket} players={players} currentPlayerNumber={turnsInRound} setRound={setRound} setTime={setTime}
            round={round} maxRounds={maxRounds.current} roundTime={roundTime} setPlayers={setPlayers} />
          <StartButton socket={socket} players={players} setMessages={setMessages} />
          <Chat socket={socket} messages={messages} setMessages={setMessages} currentWord={currentWord} />
          <LeaveRoom socket={socket} />
        </div> 
      }
    </>
  )
}

export default Room
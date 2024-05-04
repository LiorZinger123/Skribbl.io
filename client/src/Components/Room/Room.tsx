import { useEffect, useRef, useState } from "react"
import { Socket, io } from "socket.io-client"
import { useAppSelector } from "../../store/hooks"
import { RootState } from "../../store/store"
import { createContext } from "react"
import { ChatMessage, PlayerType, RoomDetails, WhileDrawing, Word } from "../../types/RoomTypes/types"
import Chat from "./Chat/Chat"
import Players from "./Players/Players"
import ScreenMsgs from "./ScreenMsgs/ScreenMsgs"
import TopRoom from "./TopRoom/TopRoom"
import CanvasContainer from "./CanvasContainer/CanvasContainer"
import RoomMsg from "./RoomMsg/RoomMsg"

export const SocketContext = createContext<Socket>(null!)

const Room = () => {
 
  const room = useAppSelector((state: RootState) => state.room)
  const username = useAppSelector((state: RootState) => state.username)

  const [socket, setSocket] = useState<Socket>(null!)
  const api = import.meta.env.VITE_API
  const port = import.meta.env.VITE_API_PORT

  const [players, setPlayers] = useState<PlayerType[]>([])
  const [messages, setMessages] = useState<ChatMessage[]>([])

  const [currentWord, setCurrentWord] = useState<Word>({word: '', length: ''})
  const currentPainter = useRef<string>('')

  const roundTime = useRef<number>(0)
  const [time, setTime] = useState<number>(0)

  const [round, setRound] = useState<number>(0) 
  const maxRounds = useRef<number>(0)

  const canvasParentRef = useRef<HTMLDivElement | null>(null)

  const [socketError, setSocketError] = useState<boolean>(false)
  const socketErrorMsg = 'Lost connection to the game servers.'

  useEffect(() => {

    const handleDetails = (roomDetails: RoomDetails): void => {
      roundTime.current = roomDetails.time
      maxRounds.current = roomDetails.rounds
    }
    
    const handleWord = (word: Word): void => {
      setCurrentWord(word)
    }

    const lostConnection = (): void => {
      setSocketError(true)
    }

    const updateDetails = (data: WhileDrawing): void => {
      setTime(data.time)
      setRound(data.round)
      setCurrentWord(data.word)
    }

    // const handleClick = (): void => {
    //   window.history.pushState(null, "", window.location.href)
    // }

    const newSocket = io(`${api}:${port}`)
    setSocket(newSocket)
    newSocket.emit('join', {room: room, username: username})
    newSocket.on('room_details', handleDetails)
    newSocket.on('start_turn', handleWord)
    newSocket.on("connect_error", lostConnection)
    newSocket.on("while_drawing", updateDetails)
    // window.history.pushState(null, "", window.location.href)
    // window.addEventListener('popstate', handleClick)

    return (): void => {
      newSocket.off('room_details', handleDetails)
      newSocket.off('start_turn', handleWord)
      newSocket.off("connect_error", lostConnection)
      newSocket.off("while_drawing", updateDetails)
      newSocket.disconnect()
      // window.removeEventListener('popstate', handleClick)
    }
  }, [])

  return (
    <>
      {socket &&
        <SocketContext.Provider value={socket}>

          <div className="room">

            <div className="room-grid-container">
              <TopRoom time={time} round={round} maxRounds={maxRounds.current} painter={currentPainter} players={players} setMessages={setMessages} />
              <Players players={players} setPlayers={setPlayers} />
              <div className="center-room" ref={canvasParentRef}>
               <ScreenMsgs players={players} painter={currentPainter} setRound={setRound} setTime={setTime}
                  round={round} maxRounds={maxRounds.current} roundTime={roundTime} setPlayers={setPlayers} currentWord={currentWord} /> 
                <CanvasContainer setTime={setTime} roundTime={roundTime} currentPainter={currentPainter} canvasParentRef={canvasParentRef} />
              </div>
              <Chat messages={messages} setMessages={setMessages} currentWord={currentWord} painter={currentPainter} />
            </div>

            {socketError && <RoomMsg msg={socketErrorMsg} msgType="socket" />}

          </div>
          
        </SocketContext.Provider>
      }
    </>
  )
}

export default Room
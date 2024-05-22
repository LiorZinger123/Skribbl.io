import { useEffect, useRef, useState, createContext, useContext } from "react"
import { Socket, io } from "socket.io-client"
import { useAppSelector } from "../../store/hooks"
import { RootState } from "../../store/store"
import { StableNavigateContext } from "../../App"
import { RoomContextType, ScreenMsgsContextType } from "../../types/RoomTypes/contextsTypes"
import { ChatMessage, PlayerType, RoomDetails, WhileDrawing, Word } from "../../types/RoomTypes/types"
import Chat from "./Chat/Chat"
import Players from "./Players/Players"
import ScreenMsgs from "./ScreenMsgs/ScreenMsgs"
import TopRoom from "./TopRoom/TopRoom"
import CanvasContainer from "./CanvasContainer/CanvasContainer"
import RoomMsg from "./RoomMsg/RoomMsg"

export const RoomContext = createContext<RoomContextType>(null!)
export const ScreenMsgsContext = createContext<ScreenMsgsContextType>(null!)

const Room = () => {
 
  const room = useAppSelector((state: RootState) => state.room)
  const username = useAppSelector((state: RootState) => state.username)
  // const nav = useContext(StableNavigateContext)
  // const history = 
  // const nav = useContext(StableNavigateContext)
  // const { history } = 

  const [socket, setSocket] = useState<Socket>(null!)
  const api = import.meta.env.VITE_API
  const port = import.meta.env.VITE_API_PORT

  const [players, setPlayers] = useState<PlayerType[]>([])
  const [messages, setMessages] = useState<ChatMessage[]>([])

  const [currentWord, setCurrentWord] = useState<Word>({word: '', length: ''})
  const currentPainter = useRef<string>('')

  const turnTime = useRef<number>(0)
  const [time, setTime] = useState<number>(0)

  const [round, setRound] = useState<number>(0) 
  const maxRounds = useRef<number>(0)

  const canvasParentRef = useRef<HTMLDivElement | null>(null)

  const [socketError, setSocketError] = useState<boolean>(false)
  const socketErrorMsg = 'Lost connection to the game servers.'

  const screenMsgsContextValues = {players: players, setPlayers: setPlayers, round: round, setRound: setRound, 
    maxRounds: maxRounds.current, currentWord: currentWord, turnTime: turnTime, setTime: setTime}

  useEffect(() => {

    const handleDetails = (roomDetails: RoomDetails): void => {
      turnTime.current = roomDetails.time
      maxRounds.current = roomDetails.rounds
      setRound(roomDetails.currentRound)
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
      // console.log('s')
      // nav(1)
      // window.history.pushState(null, "", window.location.href)
    // }

    const newSocket = io(`${api}:${port}`)
    setSocket(newSocket)
    newSocket.emit('join', {room: room, username: username})
    newSocket.on('room_details', handleDetails)
    newSocket.on('start_turn', handleWord)
    newSocket.on("connect_error", lostConnection)
    newSocket.on("while_drawing", updateDetails)

    // window.history.pushState(null, "", window.location.href)
    // window.addEventListener('popstate', (e: any) => {
    //   console.log('sss')
    //   e.preventDefault()
    //   setSocketError(true)
    // })

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
    <RoomContext.Provider value={{socket: socket, painter: currentPainter}}>

      {socket &&

        <div className="room">

          <div className="room-grid-container">
            <TopRoom time={time} round={round} maxRounds={maxRounds.current} players={players} setMessages={setMessages} />
            <Players players={players} setPlayers={setPlayers} />

            <div className="center-room" ref={canvasParentRef}>
              <ScreenMsgsContext.Provider value={screenMsgsContextValues}>
                <ScreenMsgs /> 
              </ScreenMsgsContext.Provider>
              <CanvasContainer setTime={setTime} turnTime={turnTime} canvasParentRef={canvasParentRef} />
            </div>

            <Chat messages={messages} setMessages={setMessages} currentWord={currentWord} />
          </div>

          {socketError && <RoomMsg msg={socketErrorMsg} msgType="socket" />}

        </div>
      
      }
      
    </RoomContext.Provider>
  )
}

export default Room
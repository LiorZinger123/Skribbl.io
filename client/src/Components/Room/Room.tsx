import { useEffect, useRef, useState } from "react"
import { Socket, io } from "socket.io-client"
import { useAppSelector } from "../../store/hooks"
import { RootState } from "../../store/store"
import { createContext } from "react"
// import { StableNavigateContext } from "../../App"
// import { useContext } from "react"
import { fetchToApi } from "../../Api/fetch"
import { ChatMessage, PlayerType, RoomDetails, Word } from "../../types/RoomTypes/types"
import Chat from "./Chat"
// import Canvas from "./Canvas/Canvas"
import Players from "./Players/Players"
import StartButton from "./StartButton"
import ScreenMsgs from "./ScreenMsgs/ScreenMsgs"
import { LeaveRoom } from "./LeaveRoom"
import TopRoom from "./TopRoom"
import CanvasContainer from "./CanvasContainer/CanvasContainer"

export const SocketContext = createContext<Socket>(null!)

const Room = () => {
 
  // const nav = useContext(StableNavigateContext)
  const room = useAppSelector((state: RootState) => state.room)
  const username = useAppSelector((state: RootState) => state.username)

  const [startBtn, setStartBtn] = useState<boolean>(true)

  const [socket, setSocket] = useState<Socket>(null!)
  const [players, setPlayers] = useState<PlayerType[]>([])
  const [messages, setMessages] = useState<ChatMessage[]>([])

  const [currentWord, setCurrentWord] = useState<Word>({word: '', length: ''})
  const currentPainter = useRef<string>('')

  const roundTime = useRef<number>(0)
  const [time, setTime] = useState<number>(0)

  const [round, setRound] = useState<number>(0) 
  const maxRounds = useRef<number>(0)

  const canvasParentRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {

    const checkIfGameStarted = async (): Promise<void> => {
      try{
          const res = await fetchToApi('rooms/ifgamestarted', {room: room})
          const ifStarted = await res.json()
          if(ifStarted)
              setStartBtn(false)
          else
              setStartBtn(true)
      }
      catch{
        //popup error        
      }
    }

    const handleDetails = (roomDetails: RoomDetails): void => {
      roundTime.current = roomDetails.time
      maxRounds.current = roomDetails.rounds
    }

    const hideBtn = (): void => {
      setStartBtn(false)
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
    newSocket.on('hide_start_btn', hideBtn)
    newSocket.on('start_turn', handleWord)
    // window.addEventListener('beforeunload', leaveOnRefresh)
    checkIfGameStarted()

    return (): void => {
      newSocket.off('room_details', handleDetails)
      newSocket.off('hide_start_btn', hideBtn)
      newSocket.off('start_turn', handleWord)
      // window.removeEventListener('beforeunload', leaveOnRefresh)
      newSocket.disconnect()
    }
  }, [])
  
  return (
    <>
      {socket &&
        <SocketContext.Provider value={socket}>

          <div className="room">

            <div className="room-grid-container">
              <TopRoom time={time} round={round} maxRounds={maxRounds.current} painter={currentPainter} />
              <Players players={players} setPlayers={setPlayers} />
              <div className="center-room" ref={canvasParentRef}>
               <ScreenMsgs players={players} painter={currentPainter} setRound={setRound} setTime={setTime}
                  round={round} maxRounds={maxRounds.current} roundTime={roundTime} setPlayers={setPlayers} /> 
                <CanvasContainer players={players} setTime={setTime} roundTime={roundTime} currentPainter={currentPainter} canvasParentRef={canvasParentRef} />
              </div>
              <Chat messages={messages} setMessages={setMessages} currentWord={currentWord} painter={currentPainter} />
            </div>
            
            {startBtn && <StartButton players={players} setMessages={setMessages} />}
            <LeaveRoom painter={currentPainter} />
          
          </div>
          
        </SocketContext.Provider>
      }
    </>
  )
}

export default Room
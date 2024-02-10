import { useEffect, useState } from "react"
import { Socket } from "socket.io-client"
import PlayerType from "../../types/RoomTypes/playerType"
import { getFromApi } from "../../Api/fetch"
import ScreenMsgsType, { Word } from "../../types/RoomTypes/screenMsgs"

type Props = {
  socket: Socket,
  players: PlayerType[],
  currentPlayerNumber: React.MutableRefObject<number>,
  username: string
}

const MsgsScreen = (props: Props) => {

  const [screen, setScreen] = useState<ScreenMsgsType>({ show: false, msg: '' })

  useEffect(() => {

    const nextTurn = async (): Promise<void> => {
      try{
        const res = await getFromApi('rooms/words')
        props.currentPlayerNumber.current += 1
        if(res.ok){
          setTimeout(async () => {
            if(props.players[0].username === props.username){
              const newWords = await res.json()
              setScreen({ show: true, msg: {msg: 'Please choose one word', words: newWords} })
            }
            else
              setScreen({ show: true, msg: `${props.players[0].username} is choosing a word` })
          }, 3000)
        }
      }
      catch{

      }
    }

    const handleMsg = (msg: string): void => {
      setScreen({ show: true, msg: msg })
      nextTurn()
    }

    const startTurn = (): void => {
      setScreen({show: false, msg: ''})
    }

    props.socket.on('startgame', handleMsg)
    props.socket.on('startturn', startTurn)

    return (): void => {
      props.socket.off('startgame', handleMsg)
      props.socket.off('startturn', startTurn)
    }
  })

  const chooseWord = (word: Word): void => {
    props.socket.emit('turn', word)
  }

  return (
    <>
      {screen.show && 
        <div>
          {
            typeof screen.msg === 'string'
            ? <p>{screen.msg}</p>
            : <>
                <p>{screen.msg.msg}</p>
                <ul>
                  {screen.msg.words.map(word => (
                    <li key={word.word} onClick={() => chooseWord(word)}>{word.word}</li>
                  ))}
                </ul>
              </> 
          }
        </div>
      }
    </>
  )
}

export default MsgsScreen
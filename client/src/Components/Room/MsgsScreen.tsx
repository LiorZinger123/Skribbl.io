import { useEffect, useState } from "react"
import { Socket } from "socket.io-client"
import PlayerType from "../../types/RoomTypes/playerType"
import { getFromApi } from "../../Api/fetch"
import ScreenMsgsType, { Word } from "../../types/RoomTypes/screenMsgs"

type Props = {
  socket: Socket,
  players: PlayerType[],
  currentPlayerNumber: React.MutableRefObject<number>,
  username: string,
  setRound: React.Dispatch<React.SetStateAction<number>>
}

const MsgsScreen = (props: Props) => {

  const [screen, setScreen] = useState<ScreenMsgsType>({ show: false, msg: '' })

  useEffect(() => {

    const nextTurn = async (): Promise<void> => {
      try{
        const res = await getFromApi('rooms/words')
        if(res.ok){
          setTimeout(async () => {
            console.log(props.players[props.currentPlayerNumber.current])
            if(props.players[props.currentPlayerNumber.current].username === props.username){
              const newWords = await res.json()
              setScreen({ show: true, msg: {msg: 'Please choose one word', words: newWords} })
            }
            else
              setScreen({ show: true, msg: `${props.players[props.currentPlayerNumber.current].username} is choosing a word` })
            
            if(props.currentPlayerNumber.current !== props.players.length + 1)
              props.currentPlayerNumber.current += 1
            else{
              props.currentPlayerNumber.current = 0
              props.setRound(round => round + 1)
            }

          }, 3000)
        }
      }
      catch{

      }
    }

    const startMsg = (msg: string): void => {
      setScreen({ show: true, msg: msg })
      nextTurn()
    }

    const startTurn = (): void => {
      setScreen({show: false, msg: ''})
    }

    props.socket.on('startgame', startMsg)
    props.socket.on('startturn', startTurn)
    props.socket.on('endturn', nextTurn)

    return (): void => {
      props.socket.off('startgame', startMsg)
      props.socket.off('startturn', startTurn)
      props.socket.off('endturn', nextTurn)
    }
  }, [props.players])

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
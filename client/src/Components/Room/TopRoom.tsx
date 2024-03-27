import React, { useContext, useEffect, useState } from "react"
import { SocketContext } from "./Room"
import { Word } from "../../types/RoomTypes/types"
import { useAppSelector } from "../../store/hooks"
import { RootState } from "../../store/store"

type Props = {
    time: number,
    round: number,
    maxRounds: number,
    painter: React.MutableRefObject<string>
}

const TopRoom = (props: Props) => {

    const socket = useContext(SocketContext)
    const username = useAppSelector((state: RootState) => state.username)
    const [screenWord, setScreenWord] = useState<Word>({word: 'Waiting', length: '0'})

    useEffect(() => {
        const setToWaiting = (): void => {
            setScreenWord({word: 'Waiting', length: '0'})
        }

        const setWord = (currentWord: Word): void => {
            if(props.painter.current === username)
                setScreenWord({word: currentWord.word, length: currentWord.length})
            else{
                const wordArray = [...currentWord.word].map(char => {
                    if(char != ' ')
                        return '_'
                    return '-'
                })
                setScreenWord({word: wordArray.join(' '), length: currentWord.length})
            }
        }

        socket.on('choose_word', setToWaiting)
        socket.on('start_turn', setWord)
        socket.on('restart', setToWaiting)

        return (): void => {
            socket.off('choose_word', setToWaiting)
            socket.off('start_turn', setWord)
            socket.off('restart', setToWaiting)
        } 
    }, [])

  return (
    <div className="top-room">
        <div>
            {props.time}
        </div>
        <div>
            Round {props.round} of {props.maxRounds}
        </div>
        <div>
           {screenWord.word} {screenWord.length != '0' && `(${screenWord.length})`}
        </div>
    </div>
  )
}

export default TopRoom
import React, { useContext, useEffect, useState } from "react"
import { RoomContext } from "../Room"
import { Word, PlayerType, ChatMessage } from "../../../types/RoomTypes/types"
import { useAppSelector } from "../../../store/hooks"
import { RootState } from "../../../store/store"
import StartButton from "./Buttons/StartButton"
import LeaveRoom from "./Buttons/LeaveRoom"

type Props = {
    time: number,
    round: number,
    maxRounds: number,
    players: PlayerType[],
    setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>
}

const TopRoom = (props: Props) => {

    const socket = useContext(RoomContext).socket
    const painter = useContext(RoomContext).painter
    const username = useAppSelector((state: RootState) => state.username)
    const [screenWord, setScreenWord] = useState<Word>({word: 'Waiting', length: '0'})
    const [showStartButton, setShowStartButton] = useState<boolean>(false)
    
    useEffect(() => {

        const showButton = (): void => {
            setShowStartButton(true)
        }

        const ownerLeft = (newOwner: string): void => {
            if(newOwner === username)
                setShowStartButton(true)
        }

        const setToWaiting = (): void => {
            setScreenWord({word: 'Waiting', length: '0'})
        }

        const setWord = (currentWord: Word): void => {
            const chars = [' ', '-', '.', '/']
            if(painter.current === username)
                setScreenWord({word: currentWord.word, length: currentWord.length})
            else{
                const wordArray = [...currentWord.word].map(char => {
                    if(chars.includes(char))
                        return char
                    return '_'
                })
                setScreenWord({word: wordArray.join(''), length: currentWord.length})
            }
        }

        socket.on('show_start_button', showButton)
        socket.on('owner_left', ownerLeft)
        socket.on('choose_word', setToWaiting)
        socket.on('start_turn', setWord)
        socket.on('join_turn', setWord)
        socket.on('restart', setToWaiting)

        return (): void => {
            socket.off('show_start_button', showButton)
            socket.off('owner_left', ownerLeft)
            socket.off('choose_word', setToWaiting)
            socket.off('start_turn', setWord)
            socket.off('join_turn', setWord)
            socket.off('restart', setToWaiting)
        } 
    }, [])

  return (
    <div className="top-room">

        <div className="top-room-left-side">
            <div>
                {props.time}
            </div>
            <div>
                Round {props.round} of {props.maxRounds}
            </div>
        </div>

        {screenWord.word} {screenWord.length != '0' && `(${screenWord.length})`}

        <div className={showStartButton ? "top-room-right-side" : 'top-room-right-side'}>
            {showStartButton && <StartButton setShowStartButton={setShowStartButton} players={props.players} setMessages={props.setMessages} />}
            <LeaveRoom painter={painter} showStartButton={showStartButton} />
        </div>
    </div>
  )
}

export default TopRoom
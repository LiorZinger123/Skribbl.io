import React, { useState, useRef, useEffect, useContext } from "react"
import { SocketContext } from "../Room"
import { useAppSelector } from "../../../store/hooks"
import { RootState } from "../../../store/store"
import { fetchToApi, getFromApi } from "../../../Api/fetch"
import { PlayerType } from "../../../types/RoomTypes/types"
import { Word, Msg } from "../../../types/RoomTypes/types"

type Props = {
    players: PlayerType[],
    painter: React.MutableRefObject<string>,
    setRound: React.Dispatch<React.SetStateAction<number>>,
    setTime: React.Dispatch<React.SetStateAction<number>>,
    roundTime: React.MutableRefObject<number>
}

const StartRoundMsgs = (props: Props) => {

    const room = useAppSelector((state: RootState) => state.room)
    const username = useAppSelector((state: RootState) => state.username)
    const socket = useContext(SocketContext)
    const [screenMsg, setScreenMsg] = useState<Msg>({msg: ''})
    const wordsIntervalId = useRef<NodeJS.Timeout>(null!)
    const wordsTimeOutId = useRef<NodeJS.Timeout>(null!)

    useEffect(() => {

        const chooseWord = async (): Promise<void> => {
            try{
                const res = await getFromApi('rooms/words')
                if(res.ok){
                    if(props.painter.current === username){
                        const newWords = await res.json()
                        setScreenMsg({msg: 'Please choose one word', words: newWords})
                    }
                    else{
                        setScreenMsg({msg: `${props.painter.current} is choosing a word`})
                    }
                  
                    if(props.painter.current === props.players[0].username){
                        if(props.painter.current === username)
                            fetchToApi('rooms/currentround', {room: room})
                        props.setRound(round => round + 1)
                    }
                }                  
            }
            catch{
      
            }
        }

        const startTurn = (): void => {
            setScreenMsg({msg: ''})
            props.setTime(props.roundTime.current)
        }
    
        socket.on('choose_word', chooseWord)
        socket.on('start_turn', startTurn)

        return (): void => {
            socket.off('choose_word', chooseWord)
            socket.off('start_turn', startTurn)
        }
    }, [props.players])

    useEffect(() => {
        if(screenMsg.msg != ''){
            props.setTime(15)
            wordsIntervalId.current = setInterval(() => {
                props.setTime(time => time - 1)
            }, 1000)
    
            if(screenMsg.words !== undefined){
                wordsTimeOutId.current = setTimeout(() => {
                    clearInterval(wordsIntervalId.current)
                    const word = screenMsg.words![Math.floor(Math.random() * screenMsg.words!.length)]
                    socket.emit('turn', {word: word, currentPainter: props.painter.current, room: room})
                }, 15 * 1000)
            }
        }

        return (): void => {
            clearInterval(wordsIntervalId.current)
            clearTimeout(wordsTimeOutId.current)
        }
    }, [screenMsg])

    const chooseWord = (word: Word): void => {
        clearInterval(wordsIntervalId.current)
        clearTimeout(wordsTimeOutId.current)
        socket.emit('turn', {word: word, currentPainter: props.painter.current, room: room})
    }

    return (
        <>
            {screenMsg.msg.length > 0 && 
                <div className="screen-msg">
                {
                    screenMsg.words === undefined
                    ? <p>{screenMsg.msg}</p>
                    : <>
                        <p>{screenMsg.msg}</p>
                        <ul>
                        {screenMsg.words.map(word => (
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

export default StartRoundMsgs
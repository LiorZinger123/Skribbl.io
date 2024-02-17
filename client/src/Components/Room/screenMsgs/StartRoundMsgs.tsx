import React, { useState, useRef, useEffect } from "react"
import { getFromApi } from "../../../Api/fetch"
import PlayerType from "../../../types/RoomTypes/playerType"
import { Socket } from "socket.io-client"
import { Word, Msg } from "../../../types/RoomTypes/screenMsgs"

type Props = {
    socket: Socket,
    players: PlayerType[],
    currentPlayerNumber: React.MutableRefObject<number>,
    username: string,
    setRound: React.Dispatch<React.SetStateAction<number>>,
    setTime: React.Dispatch<React.SetStateAction<number>>,
    roundTime: React.MutableRefObject<number>
}

const StartRoundMsgs = (props: Props) => {

    const [screenMsg, setScreenMsg] = useState<Msg>({msg: ''})
    const wordsIntervalId = useRef<NodeJS.Timeout>(null!)
    const wordsTimeOutId = useRef<NodeJS.Timeout>(null!)

    useEffect(() => {

        const chooseWord = async (): Promise<void> => {
            try{
                const res = await getFromApi('rooms/words')
                if(res.ok){
                    if(props.players[props.currentPlayerNumber.current].username === props.username){
                        const newWords = await res.json()
                        setScreenMsg({msg: 'Please choose one word', words: newWords})
                    }
                    else
                        setScreenMsg({msg: `${props.players[props.currentPlayerNumber.current].username} is choosing a word`})
                  
                    if(props.currentPlayerNumber.current !== props.players.length - 1)
                        props.currentPlayerNumber.current += 1
                    else{
                        props.currentPlayerNumber.current = 0
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
    
        props.socket.on('chooseword', chooseWord)
        props.socket.on('startturn', startTurn)

        return (): void => {
            props.socket.off('chooseword', chooseWord)
            props.socket.off('startturn', startTurn)
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
                    props.socket.emit('turn', word)
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
        props.socket.emit('turn', word)
    }

    return (
        <>
            {screenMsg.msg.length > 0 && 
                <div>
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
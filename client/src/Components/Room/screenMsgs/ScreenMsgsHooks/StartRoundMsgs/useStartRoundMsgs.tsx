import React, { useState, useRef, useEffect, useContext } from "react"
import { SocketContext } from "../../../Room"
import { useAppSelector } from "../../../../../store/hooks"
import { RootState } from "../../../../../store/store"
import { fetchToApi, getFromApi } from "../../../../../Api/fetch"
import { GetTurnWordsType, PlayerType, ScreenCurrentMsgType, Word } from "../../../../../types/RoomTypes/types"

type Props = {
    players: PlayerType[],
    painter: React.MutableRefObject<string>,
    setRound: React.Dispatch<React.SetStateAction<number>>,
    setTime: React.Dispatch<React.SetStateAction<number>>,
    roundTime: React.MutableRefObject<number>,
    setScreenCurrentMsg: React.Dispatch<React.SetStateAction<ScreenCurrentMsgType>>
}

const useStartRoundMsgs = (props: Props) => {

    const room = useAppSelector((state: RootState) => state.room)
    const username = useAppSelector((state: RootState) => state.username)
    const socket = useContext(SocketContext)
    const [getTurnWords, setGetTurnWords] = useState<GetTurnWordsType>({ getWords: false })
    const wordsIntervalId = useRef<NodeJS.Timeout>(null!)
    const wordsTimeOutId = useRef<NodeJS.Timeout>(null!)

    useEffect(() => {

        const getWords = async (): Promise<void> => { //get 3 random words from server
            try{
                const res = await getFromApi('rooms/words')
                if(res.ok){
                    const notPainterMsg = <p>{props.painter.current} is choosing a word</p>
                    if(props.painter.current === username){
                        const newWords: Word[] = await res.json()
                        setGetTurnWords({ getWords: true, words: newWords })
                        props.setScreenCurrentMsg({show: true , msg: 
                            <div className="random-words">
                                <p>Please choose one word</p>
                                <ul>
                                    {newWords.map(word => (
                                        <li key={word.word} className="random-word" onClick={() => chooseWord(word)}>{word.word}</li>
                                    ))}
                                </ul>
                            </div> 
                        })
                        socket.emit('new_screen_msg', {room: room, msg: JSON.stringify(notPainterMsg)})
                    }
                    else{
                        props.setScreenCurrentMsg({show: true, msg: notPainterMsg})
                        setGetTurnWords({ getWords: true })
                    }
                    
                    if(props.painter.current === props.players[0].username){
                        props.setRound(round => round + 1)
                        if(props.painter.current === username)
                            fetchToApi('rooms/currentround', {room: room})
                    }
                }                  
            }
            catch(e){
                throw e
            }
        }

        const chooseWord = (word: Word): void => { //after choosing a word
            socket.emit('start_turn', {word: word, currentPainter: props.painter.current, room: room})
        }

        const startTurn = (): void => { //start play
            clearInterval(wordsIntervalId.current)
            clearTimeout(wordsTimeOutId.current)
            props.setScreenCurrentMsg({show: false, msg: null})
            props.setTime(props.roundTime.current)
        }
    
        socket.on('choose_word', getWords)
        socket.on('start_turn', startTurn)

        return (): void => {
            socket.off('choose_word', getWords)
            socket.off('start_turn', startTurn)
        }
    }, [props.players])

    useEffect(() => {
        if(getTurnWords.getWords && getTurnWords.words !== undefined){
            props.setTime(15)
            socket.emit('screen_msgs_set_time', {room: room})
            
            wordsIntervalId.current = setInterval(() => {
                props.setTime(time => time - 1)
                socket.emit('screen_msgs_tick', {room: room})
            }, 1000)
            
            wordsTimeOutId.current = setTimeout(() => {
                clearInterval(wordsIntervalId.current)
                const word = getTurnWords.words![Math.floor(Math.random() * getTurnWords.words!.length)]
                socket.emit('start_turn', {word: word, currentPainter: props.painter.current, room: room})
            }, 15 * 1000)
        }

        const setScreenTime = (time: number): void => {
            props.setTime(time)
        }

        const tick = (): void => {
            props.setTime(time => time - 1)
        }

        socket.on('screen_msgs_set_time', setScreenTime)
        socket.on('screen_msgs_tick', tick)

        return (): void => {
            socket.off('screen_msgs_set_time', setScreenTime)
            socket.off('screen_msgs_tick', tick)
            clearInterval(wordsIntervalId.current)
            clearTimeout(wordsTimeOutId.current)
        }
    }, [getTurnWords])

}

export default useStartRoundMsgs
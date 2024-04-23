import React, { useEffect, useContext } from "react"
import { SocketContext } from "../Room"
import { useAppSelector } from "../../../store/hooks"
import { RootState } from "../../../store/store"
import { PlayerType, ScreenCurrentMsgType, ShowScoresType, Word } from "../../../types/RoomTypes/types"

type Props = {
    players: PlayerType[],
    setPlayers: React.Dispatch<React.SetStateAction<PlayerType[]>>,
    painter: React.MutableRefObject<string>,
    round: number,
    maxRounds: number,
    setScreenCurrentMsg: React.Dispatch<React.SetStateAction<ScreenCurrentMsgType>>,
    currentWord: Word
}

const ScoresScreen = (props: Props) => {
  
    const room = useAppSelector((state: RootState) => state.room)
    const socket = useContext(SocketContext)
    const username = useAppSelector((state: RootState) => state.username)

    useEffect(() => {
        
        const showScores = (data: ShowScoresType): void => {
            props.setScreenCurrentMsg({show: true, msg:
                <>
                    <p>The word was: {props.currentWord.word}</p>
                    <ul className="screen-msg">       
                        {data.scores.map(playerScore => (
                            <li key={playerScore.username} className={playerScore.score > 0 ? 'got-score' : 'zero-score'}>
                                {playerScore.username}: {playerScore.score > 0 && '+'}{playerScore.score}</li>
                        ))}
                    </ul>
                </>
            })

            props.setPlayers(players => {
                return players.map(player => {
                    const currentScore = data.scores.find(score => score.username === player.username)?.score
                    if(currentScore)
                        return {...player, score: player.score + currentScore}
                    return player
                })
            })

            setTimeout(() => {
                if(data.painter !== null){
                    props.painter.current = data.painter
                    console.log("new painter", props.painter.current)
                    if(username === data.painter)
                        socket.emit('choose_word', {room:room})
                }
                else{
                    if(username === data.owner){
                        socket.emit('end_game', {room: room})
                    }
                }
            }, 3000)
        }   

        socket.on('end_turn', showScores)

        return (): void => {
            socket.off('end_turn', showScores)
        }
    }, [props.currentWord])

    return (
    <></>
  )
}

export default ScoresScreen
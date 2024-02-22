import React, { useEffect, useState, useContext } from "react"
import { SocketContext } from "../Room"
import { Socket } from "socket.io-client"
import { useAppSelector } from "../../../store/hooks"
import { RootState } from "../../../store/store"
import { PlayerType, Score, ShowScoresType } from "../../../types/RoomTypes/types"

type Props = {
    players: PlayerType[],
    setPlayers: React.Dispatch<React.SetStateAction<PlayerType[]>>,
    painter: React.MutableRefObject<string>,
    round: number,
    maxRounds: number,
    setEndMsg: React.Dispatch<React.SetStateAction<boolean>>
}

const ScoresScreen = (props: Props) => {
  
    const room = useAppSelector((state: RootState) => state.room)
    const socket = useContext(SocketContext)
    const username = useAppSelector((state: RootState) => state.username)
    const [turnScores, setTurnScores] = useState<Score[]>([])

    useEffect(() => {
        
        const showScores = (data: ShowScoresType): void => {
            if(data.painter)
                props.painter.current = data.painter
            
            setTurnScores(data.scores)
            props.setPlayers(players => {
                return players.map(player => {
                    const currentScore = data.scores.find(score => score.username === player.username)?.score
                    if(currentScore)
                        return {...player, score: player.score + currentScore}
                    return player
                })
            })

            setTimeout(() => {
                setTurnScores([])
                if(props.round === props.maxRounds + 1)
                    props.setEndMsg(true)
                else if(props.painter.current === username)
                    socket.emit('choose_word', {room:room})
            }, 3000)
        }   

        socket.on('end_turn', showScores)

        return (): void => {
            socket.off('end_turn', showScores)
        }
    })

    return (
    <ul>       
        {turnScores.map(playerScore => (
            <li key={playerScore.username}>{playerScore.username}: {playerScore.score}</li>
        ))}
    </ul>
  )
}

export default ScoresScreen
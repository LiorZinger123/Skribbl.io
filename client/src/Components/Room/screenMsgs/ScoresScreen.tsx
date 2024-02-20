import React, { useEffect, useState } from "react"
import { Socket } from "socket.io-client"
import { useAppSelector } from "../../../store/hooks"
import { RootState } from "../../../store/store"
import { PlayerType, Score } from "../../../types/RoomTypes/types"

type Props = {
    socket: Socket,
    players: PlayerType[],
    setPlayers: React.Dispatch<React.SetStateAction<PlayerType[]>>,
    currentPlayerNumber: React.MutableRefObject<number>,
    round: number,
    maxRounds: number,
    setEndMsg: React.Dispatch<React.SetStateAction<boolean>>
}

const ScoresScreen = (props: Props) => {
  
    const room = useAppSelector((state: RootState) => state.room)
    const username = useAppSelector((state: RootState) => state.username)
    const [turnScores, setTurnScores] = useState<Score[]>([])

    useEffect(() => {
        
        const showScores = (scores: Score[]): void => {
            setTurnScores(scores)
            props.setPlayers(players => {
                return players.map(player => {
                    const currentScore = scores.find(score => score.username === player.username)?.score
                    if(currentScore)
                        return {...player, score: player.score + currentScore}
                    return player
                })
            })
            setTimeout(() => {
                setTurnScores([])
                console.log(props.round, props.maxRounds)
                if(props.round === props.maxRounds + 1)
                    props.setEndMsg(true)
                else{
                    if(props.players[props.currentPlayerNumber.current].username === username)
                        props.socket.emit('choose_word', {room:room})
                }
            }, 3000)
        }   

        props.socket.on('end_turn', showScores)

        return (): void => {
            props.socket.off('end_turn', showScores)
        }
    })

    return (
    <>
        {turnScores.length > 0 &&
            <ul>
                {turnScores.map(playerScore => (
                    <li key={playerScore.username}>{playerScore.username}: {playerScore.score}</li>
                ))}
            </ul>
        }
    </>
  )
}

export default ScoresScreen
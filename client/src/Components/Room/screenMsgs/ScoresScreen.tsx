import { useEffect, useState, useRef } from "react"
import { Socket } from "socket.io-client"
import { score } from "../../../types/RoomTypes/screenMsgs"

type Props = {
    socket: Socket
}

const ScoresScreen = (props: Props) => {
  
    const [turnScores, setTurnScores] = useState<score[]>([])
    const timeoutRef = useRef<NodeJS.Timeout>(null!)

    useEffect(() => {
        
        const showScores = (scores: score[]): void => {
            setTurnScores(scores)
            timeoutRef.current = setTimeout(() => {
                setTurnScores([])
                props.socket.emit('chooseword')
            }, 3000)
        }   

        props.socket.on('endturn', showScores)

        return (): void => {
            props.socket.off('endturn', showScores)
            // clearTimeout(timeoutRef.current)
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
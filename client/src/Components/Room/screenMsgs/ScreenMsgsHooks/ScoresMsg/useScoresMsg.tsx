import { useEffect, useContext } from "react"
import { RoomContext, ScreenMsgsContext } from "../../../Room"
import { ScreenMsgsFunctionsContext } from "../../ScreenMsgs"
import { useAppSelector } from "../../../../../store/hooks"
import { RootState } from "../../../../../store/store"
import { ShowScoresType } from "../../../../../types/RoomTypes/types"
import ReactDOMServer from 'react-dom/server'

const useScoresMsg = () => {
  
    const room = useAppSelector((state: RootState) => state.room)
    const username = useAppSelector((state: RootState) => state.username)
    const socket = useContext(RoomContext).socket
    const painter = useContext(RoomContext).painter
    const props = useContext(ScreenMsgsContext)
    const setScreenCurrentMsg = useContext(ScreenMsgsFunctionsContext).setScreenCurrentMsg

    useEffect(() => {
        
        const showScores = (data: ShowScoresType): void => {
            const screenCurrentMsg = 
            <div>
                <p>The word was: {props.currentWord.word}</p>
                <ul className="screen-msg">       
                    {data.scores.map(playerScore => (
                        <li key={playerScore.username} className={playerScore.score > 0 ? 'got-score' : 'zero-score'}>
                            {playerScore.username}: {playerScore.score > 0 && '+'}{playerScore.score}</li>
                    ))}
                </ul>
            </div>
            
            setScreenCurrentMsg(screenCurrentMsg)
            socket.emit('new_screen_msg', {room: room, msg: ReactDOMServer.renderToString(screenCurrentMsg)})

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
                    painter.current = data.painter
                    props.currentWord.word = ''
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
    
}

export default useScoresMsg
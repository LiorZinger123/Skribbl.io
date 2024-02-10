import { useEffect } from "react"
import PlayerType from "../../types/RoomTypes/playerType"
import { SetConnectedPlayersType } from "../../types/RoomTypes/setConnectedPlayersType"
import { Socket } from "socket.io-client"

type Props = {
  socket: Socket,
  players: PlayerType[],
  setPlayers: React.Dispatch<React.SetStateAction<PlayerType[]>>
}

const Players = (props: Props) => {

  useEffect(() => {

    const setConnectedPlayers = (data: SetConnectedPlayersType): void => {
      if(Array.isArray(data))
        props.setPlayers(currentPlayers => [...currentPlayers, ...data])
      else{
        if(typeof data !== 'string')
          props.setPlayers(currentPlayers => [...currentPlayers, data])
        else
          props.setPlayers(currentPlayers => currentPlayers.filter(player => player.username !== data))
      }
    }

    props.socket.on('players', setConnectedPlayers)

    return (): void => {
      props.socket.off('players', setConnectedPlayers)
    }

  }, [])

  return (
    <div>
      <ul>
        {props.players.map(player => (
          <li key={player.id}>{player.username}: {player.score}</li>
        ))}
      </ul>
    </div>
  )
}

export default Players
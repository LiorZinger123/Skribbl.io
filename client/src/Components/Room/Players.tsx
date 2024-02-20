import { useEffect, useContext } from "react"
import { StableNavigateContext } from "../../App"
import { Socket } from "socket.io-client"
import { PlayerType, SetConnectedPlayersType } from "../../types/RoomTypes/types"

type Props = {
  socket: Socket,
  players: PlayerType[],
  setPlayers: React.Dispatch<React.SetStateAction<PlayerType[]>>
}

const Players = (props: Props) => {

  const nav = useContext(StableNavigateContext)

  useEffect(() => {

    const setConnectedPlayers = (data: SetConnectedPlayersType): void => {
      if(Array.isArray(data)) //add player on entrance
        props.setPlayers(currentPlayers => [...currentPlayers, ...data])
      else //add new player
        props.setPlayers(currentPlayers => [...currentPlayers, data])
    }

    const removePlayer = (updatedPlayers: PlayerType[]): void => {
      props.setPlayers(updatedPlayers)
    }

    const leave = (): void => {
      //send msg to client befaore leaving
      nav('/home')
    }

    props.socket.on('players', setConnectedPlayers)
    props.socket.on('player_left', removePlayer)
    props.socket.on('room_closed', leave)

    return (): void => {
      props.socket.off('players', setConnectedPlayers)
      props.socket.off('player_left', removePlayer)
      props.socket.off('closed_room', leave)
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
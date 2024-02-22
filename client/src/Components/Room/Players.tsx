import { useEffect, useContext } from "react"
import { StableNavigateContext } from "../../App"
import { SocketContext } from "./Room"
import { PlayerType, SetConnectedPlayersType } from "../../types/RoomTypes/types"

type Props = {
  players: PlayerType[],
  setPlayers: React.Dispatch<React.SetStateAction<PlayerType[]>>
}

const Players = (props: Props) => {

  const nav = useContext(StableNavigateContext)
  const socket = useContext(SocketContext)

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

    socket.on('players', setConnectedPlayers)
    socket.on('player_left', removePlayer)
    socket.on('room_closed', leave)

    return (): void => {
      socket.off('players', setConnectedPlayers)
      socket.off('player_left', removePlayer)
      socket.off('closed_room', leave)
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
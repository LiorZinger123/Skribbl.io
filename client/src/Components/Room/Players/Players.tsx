import { useEffect, useContext } from "react"
import { StableNavigateContext } from "../../../App"
import { SocketContext } from "../Room"
import { PlayerType, SetConnectedPlayersType } from "../../../types/RoomTypes/types"
import Player from "./Player"

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
    <ul className="players">
      {props.players.sort((a, b) => a.score - b.score).map((player, i) => (
        <Player key={player.id} player={player} index={i} />
      ))}
    </ul>
  )
}

export default Players
import { useEffect, useContext, useState } from "react"
import { SocketContext } from "../Room"
import { LocationsType, PlayerType, SetConnectedPlayersType } from "../../../types/RoomTypes/types"
import Player from "./Player"
import RoomMsg from "../RoomMsg"

type Props = {
  players: PlayerType[],
  setPlayers: React.Dispatch<React.SetStateAction<PlayerType[]>>
}

const Players = (props: Props) => {

  const socket = useContext(SocketContext)
  const [locations, setLocations] = useState<number[]>([]) 
  const [showMsg, setShowMsg] = useState<boolean>(false)
  const msg = 'All the players left the room.'

  useEffect(() => {

    const setConnectedPlayers = (data: SetConnectedPlayersType): void => {
      if(Array.isArray(data)) //add player on entrance
        props.setPlayers(currentPlayers => [...currentPlayers, ...data])
      else //add new player
        props.setPlayers(currentPlayers => [...currentPlayers, data])
    }

    const updateLocations = (data: LocationsType): void => {
      setLocations(data.locations)
    } 
    
    const removePlayer = (updatedPlayers: PlayerType[]): void => {
      props.setPlayers(updatedPlayers)
    }

    const leave = (): void => {
      setShowMsg(true)
    }

    socket.on('players', setConnectedPlayers)
    socket.on('locations', updateLocations)
    socket.on('player_left', removePlayer)
    socket.on('room_closed', leave)

    return (): void => {
      socket.off('players', setConnectedPlayers)
      socket.off('locations', updateLocations)
      socket.off('player_left', removePlayer)
      socket.off('closed_room', leave)
    }

  }, [])

  return (
    <>
      <ul className="players">
        {props.players.map((player, i) => (
          <Player key={player.id} player={player} index={i} location={locations[i]} />
        ))}
      </ul>
      {showMsg && <RoomMsg msg={msg} msgType="close" setShowMsg={setShowMsg} />}
    </>
  )
}

export default Players
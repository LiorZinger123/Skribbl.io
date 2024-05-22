import React, { useEffect, useContext, useState } from "react"
import { RoomContext } from "../Room"
import { LocationsType, PlayerType, RoomCloseType, SetConnectedPlayersType } from "../../../types/RoomTypes/types"
import Player from "./Player"
import RoomMsg from "../RoomMsg/RoomMsg"

type Props = {
  players: PlayerType[],
  setPlayers: React.Dispatch<React.SetStateAction<PlayerType[]>>,
}

const Players = (props: Props) => {

  const socket = useContext(RoomContext).socket
  const painter = useContext(RoomContext).painter
  const [locations, setLocations] = useState<number[]>([]) 
  const [roomCloseMsg, setRoomCloseMsg] = useState<RoomCloseType>({ show: false, msg: '' })

  useEffect(() => {

    const setConnectedPlayers = (data: SetConnectedPlayersType): void => {
      if(Array.isArray(data)){ //add player on entrance
        props.setPlayers(currentPlayers => [...currentPlayers, ...data])
        painter.current = data[0].username
      }
      else //add new player
        props.setPlayers(currentPlayers => [...currentPlayers, data])
    }

    const updateLocations = (data: LocationsType): void => {
      setLocations(data.locations)
    } 
    
    const removePlayer = (updatedPlayers: PlayerType[]): void => {
      props.setPlayers(updatedPlayers)
    }

    const leave = (msg: string): void => {
      setRoomCloseMsg({ show: true, msg: msg })
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
      {roomCloseMsg.show && <RoomMsg msg={roomCloseMsg.msg} msgType="close" />}
    </>
  )
}

export default Players
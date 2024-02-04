import { useState } from "react"
import { useContext } from 'react'
import { StableNavigateContext } from '../../App'
import { fetchToApi } from "../../Api/fetch"
import Room from "../../types/room"
import { useAppDispatch } from "../../store/hooks"
import { setRoomId } from "../../store/counterSlice"

type Props = {
  room: Room
}

const RoomInList = (props: Props) => {

  const dispatch = useAppDispatch()
  const [password, setPassward] = useState<string>('')
  const nav = useContext(StableNavigateContext)

  const joinRoom = async (id: string): Promise<void> => {
    try{
        const res = await fetchToApi('users/join', { room: id, password: password })
        if(res.ok){
          dispatch(setRoomId(await res.text()))
          nav('/room')
        }
    }
    catch{
        //pass error
    } 
  }

  return (
    <li key={props.room.id}>
      id: {props.room.id} name: {props.room.name} Players: {props.room.connectedPlayers} / {props.room.maxPlayers}
      
      {props.room.hasPassword &&
        <input type="text" value={password} onChange={e => setPassward(e.target.value)}
          placeholder="Enter Password" required disabled={props.room.connectedPlayers === props.room.maxPlayers}/>}
          
      <button type='submit' disabled={props.room.hasPassword && password.length < 3} 
        onClick={() => joinRoom(props.room.id)}>Join Room</button>
    </li>
  )
}

export default RoomInList
import { useState } from "react"
import { useContext } from 'react'
import { StableNavigateContext } from '../../App'
import { fetchToApi } from "../../Api/fetch"
import Room from "../../types/room"

type Props = {
  room: Room
}

const RoomInList = (props: Props) => {

  const [password, setPassward] = useState<string>('')
  const nav = useContext(StableNavigateContext)

  const joinRoom = async (id: string): Promise<void> => {
    try{
        const res = await fetchToApi('users/join', { room: id, password: password })
        if(res.ok)
            //set id global val
            nav('/room')
    }
    catch{
        //pass error
    } 
  }

  return (
    <li key={props.room.id}>
      id: {props.room.id} name: {props.room.name}
      {props.room.hasPassword &&
        <input type="text" value={password} onChange={e => setPassward(e.target.value)} placeholder="Enter Password" required/>}
      <button disabled={props.room.hasPassword && password.length < 3} onClick={() => joinRoom(props.room.id)}>Join Room</button>
    </li>
  )
}

export default RoomInList
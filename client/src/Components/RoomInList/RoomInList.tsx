import { useEffect, useRef, useState } from "react"
import { useContext } from 'react'
import { StableNavigateContext } from '../../App'
import { fetchToApi } from "../../Api/fetch"
import Room from "../../types/room"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { setRoomId } from "../../store/counterSlice"
import { RootState } from "../../store/store"

type Props = {
  room: Room
}

const RoomInList = (props: Props) => {

  const dispatch = useAppDispatch()
  const [password, setPassward] = useState<string>('')
  const nav = useContext(StableNavigateContext)
  const username = useAppSelector((state: RootState) => state.username)
  const disable = props.room.hasPassword && password.length < 3
  const [errorAnimations, setErrorAnimations] = useState<boolean>(false)
  const [showErrorMsg, setShowErrorMsg] = useState<boolean>(false)
  const animationRef = useRef<NodeJS.Timeout | null>(null)
  const errorRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if(animationRef.current)
        clearTimeout(animationRef.current)
      if(errorRef.current)
        clearTimeout(errorRef.current)
    }
  }, [])
  
  const joinRoom = async (id: string): Promise<void> => {
    try{
        const res = await fetchToApi('rooms/join', { room: id, password: password, username: username })
        if(res.ok){
          dispatch(setRoomId(await res.text()))
          nav('/room')
        }
        else if(res.status === 401){
          setErrorAnimations(true)
          animationRef.current = setTimeout(() => {
            setErrorAnimations(false)
          }, 700)
        }
        else{
          setShowErrorMsg(true)
          errorRef.current = setTimeout(() => {
            setShowErrorMsg(false)
          }, 3000)
        }
    }
    catch{
      setShowErrorMsg(true)
      errorRef.current = setTimeout(() => {
        setShowErrorMsg(false)
      }, 3000)
    } 
  }

  return (
    <div>
      <li key={props.room.id} className="room-item">
        
        <p>Id: {props.room.id}</p>
        <p>Name: {props.room.name}</p>
        <p>Players: {props.room.connectedPlayers.length} / {props.room.maxPlayers}</p>

        {props.room.hasPassword &&
          <input className={!errorAnimations ? "enter-password" : "enter-password enter-password-animations"} type="text" value={password} 
            onChange={e => setPassward(e.target.value)} placeholder="Enter Password" 
            disabled={props.room.connectedPlayers.length === props.room.maxPlayers} />
        }
            
        <button className={disable ? "join-room" : "join-room join-room-enable"} type='submit' disabled={disable} 
          onClick={() => joinRoom(props.room.id)}>Join Room</button>
  
      </li>
      {showErrorMsg && <p className="room-join-error">Join room {props.room.id} failed, please try again later</p>}
    </div>
  )
}

export default RoomInList
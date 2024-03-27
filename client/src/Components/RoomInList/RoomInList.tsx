import { useEffect, useRef, useState } from "react"
import { useContext } from 'react'
import { StableNavigateContext } from '../../App'
import { fetchToApi } from "../../Api/fetch"
import Room from "../../types/room"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { setRoomId } from "../../store/counterSlice"
import { RootState } from "../../store/store"

type Props = {
  room: Room,
  setShowTokenError: React.Dispatch<React.SetStateAction<boolean>>
}

const RoomInList = (props: Props) => {

  const dispatch = useAppDispatch()
  const [password, setPassward] = useState<string>('')
  const nav = useContext(StableNavigateContext)
  const username = useAppSelector((state: RootState) => state.username)
  const disable = props.room.hasPassword && password.length < 3
  const [errorAnimations, setErrorAnimations] = useState<boolean>(false)
  const [showErrorMsg, setShowErrorMsg] = useState<boolean>(false)
  const passwordRef = useRef<HTMLInputElement | null>(null)
  const errorRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    const turnOffPassAnimation = (): void => {
      setErrorAnimations(false)
    }

    const removeRoomError = (): void => {
      setShowErrorMsg(false)
    }

    passwordRef.current?.addEventListener("animationend", turnOffPassAnimation)
    errorRef.current?.addEventListener("animationend", removeRoomError)

    return () => {
      passwordRef.current?.removeEventListener("animationend", turnOffPassAnimation)
      errorRef.current?.removeEventListener("animationend", removeRoomError)
    }
  }, [showErrorMsg])
  
  const joinRoom = async (id: string): Promise<void> => {
    try{
        const res = await fetchToApi('rooms/join', { room: id, password: password, username: username })
        if(res.ok){
          dispatch(setRoomId(await res.text()))
          nav('/room')
        }
        else if(res.status === 401){
          const responseMsg = await res.json()
          if(responseMsg.message === 'wrong_password')
            setErrorAnimations(true)
          else
            props.setShowTokenError(true)
        }
        else
          setShowErrorMsg(true)
    }
    catch{
      setShowErrorMsg(true)
    } 
  }

  return (
    <div>
      <li key={props.room.id} className="room-item">
        
        <p>Id: {props.room.id}</p>
        <p>Name: {props.room.name}</p>
        <p>Players: {props.room.connectedPlayers.length} / {props.room.maxPlayers}</p>

        {props.room.hasPassword &&
          <input ref={passwordRef} className={!errorAnimations ? "enter-password" : "enter-password enter-password-animations"} type="text"
            value={password} onChange={e => setPassward(e.target.value)} placeholder="Enter Password" 
            disabled={props.room.connectedPlayers.length === props.room.maxPlayers} />
        }
            
        <button className={disable ? "join-room" : "join-room join-room-enable"} type='submit' disabled={disable} 
          onClick={() => joinRoom(props.room.id)}>Join Room</button>
  
      </li>
      {showErrorMsg && <p ref={errorRef} className="room-join-error">Join room {props.room.id} failed, please try again later</p>}
    </div>
  )
}

export default RoomInList
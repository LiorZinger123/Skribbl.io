import { useEffect, useState, useContext, useRef } from 'react';
import { SocketContext } from "../Room"
import { useAppSelector } from "../../../store/hooks"
import { RootState } from "../../../store/store"
import { StableNavigateContext } from '../../../App';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';

type Props = {
    msg: string,
    msgType: string,
    setShowMsg?: React.Dispatch<React.SetStateAction<boolean>>,
    painter?: React.MutableRefObject<string>
}

const RoomMsg = (props: Props) => {

    const nav = useContext(StableNavigateContext)
    const room = useAppSelector((state: RootState) => state.room)
    const username = useAppSelector((state: RootState) => state.username)
    const socket = useContext(SocketContext)
    
    const [time, setTime] = useState<number>(10)
    const intervalRef = useRef<NodeJS.Timeout | null>(null!)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null!)
    const msgRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        const handleClick = (e: MouseEvent): void => {
            if(!msgRef.current?.contains(e.target as Node) && props.setShowMsg)
                props.setShowMsg(false)
        }

        if(props.msgType !== 'leave'){
            const navUrl = props.msgType === 'close' ? '/home' : '/'

            intervalRef.current = setInterval(() => {
                setTime(t => t - 1)
            }, 1000)
            
            timeoutRef.current = setTimeout(() => {
                nav(navUrl)
            }, 1000 * time)    
        }  
        else{
            window.addEventListener('mousedown', handleClick)
        }

        return (): void => {
            if(intervalRef.current && timeoutRef.current){
                clearInterval(intervalRef.current)
                clearTimeout(timeoutRef.current)
            }
            else{
                window.removeEventListener('mousedown', handleClick)
            }
        }

    }, [])

    const leaveRoom = (): void => {
        socket.emit('leave_Room', {username: username, room: room, currentPainter: props.painter!.current})
        nav('/home')
    }
    
  return (
    <div className={`sliding-msg msg ${props.msgType === 'leave' ? 'leave-room-msg' : 'close-room-msg'}`} ref={msgRef}>
        <SentimentVeryDissatisfiedIcon className={`sliding-msg-icon ${props.msgType === 'leave' ? 'leave-room-icon' : 'close-room-icon'}`} fontSize='large' />
        <p className='leave-room-p'>{props.msg}</p>

        {props.msgType === 'leave'
            ? <div className='leave-room-buttons'>
                <button onClick={leaveRoom}>Yes</button>
                <button onClick={() => props.setShowMsg && props.setShowMsg(false)}>No</button>
            </div> :

            props.msgType === 'close' ?
            <div className='return-back'>
                <p>Your will return to home page in {time} seconds</p>
                <button className='return-back-button' onClick={() => nav('/home')}>Back Home</button>
            </div> :

            <div className='return-back'>
                <p>Your will return to login page in {time} seconds</p>
                <button className='return-back-button' onClick={() => nav('/')}>Back to login</button>
            </div>
            
        }
    </div>
  )
}

export default RoomMsg
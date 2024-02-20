import { useEffect, useRef, useState } from "react"
import { ChatMessage } from "../../types/RoomTypes/types"
import { Socket } from "socket.io-client"
import { useAppSelector } from "../../store/hooks"
import { RootState } from "../../store/store"
import { Word } from "../../types/RoomTypes/types"

type Props = {
    socket: Socket,
    messages: ChatMessage[],
    setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
    currentWord: Word
}

const Chat = (props: Props) => {

  const room = useAppSelector((state: RootState) => state.room)
  const username = useAppSelector((state: RootState) => state.username)
  const [msg, setMsg] = useState<string>('')
  const currentDrawer = useRef<string>('')

  useEffect(() => {

    const setCurrentDrawer = (name: string): void => {
      currentDrawer.current = name      
    }

    const handleMsg = (msg: string): void => {
      props.setMessages(messages => [...messages, { id: messages.length + 1, msg: msg}])
    }

    props.socket.on('current_drawer', setCurrentDrawer)
    props.socket.on('message', handleMsg)
    props.socket.on('leave_room', handleMsg)

    return (): void => {
      props.socket.off('current_drawer', setCurrentDrawer)
      props.socket.off('message', handleMsg)
      props.socket.off('leave_room', handleMsg)
    }

  }, [])

  const sendMsg = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    const data = {msg: msg, username: username}
    if(msg.toLowerCase() === props.currentWord.word.toLowerCase()){
      if(currentDrawer.current !== username)
        props.socket.emit('correct', {msgData: data, currentDrawer: currentDrawer.current, room: room})
      else{
        const newMsg = {id: props.messages.length + 1, msg: `${data.username}: ${data.msg}`}
        props.setMessages(msgs => [...msgs, newMsg])
      }
    }
    else
      props.socket.send(data)
    setMsg('')
  }

  return (
    <div className="chat">
        {props.messages.map(msg => (
          <p key={msg.id}>{msg.msg}</p>
        ))}
        <form onSubmit={sendMsg}>
          <input type="text" value={msg} onChange={e => setMsg(e.target.value)} required />
          <button>SEND</button>
        </form>
      </div>
  )
}

export default Chat
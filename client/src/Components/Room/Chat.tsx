import { useEffect, useState, useContext } from "react"
import { SocketContext } from "./Room"
import { ChatMessage } from "../../types/RoomTypes/types"
import { useAppSelector } from "../../store/hooks"
import { RootState } from "../../store/store"
import { Word } from "../../types/RoomTypes/types"

type Props = {
    messages: ChatMessage[],
    setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
    currentWord: Word,
    painter: React.MutableRefObject<string>,
}

const Chat = (props: Props) => {

  const room = useAppSelector((state: RootState) => state.room)
  const username = useAppSelector((state: RootState) => state.username)
  const socket = useContext(SocketContext)
  const [msg, setMsg] = useState<string>('')

  useEffect(() => {

    const handleMsg = (msg: string): void => {
      props.setMessages(messages => [...messages, { id: messages.length + 1, msg: msg}])
    }

    socket.on('message', handleMsg)
    socket.on('leave_room', handleMsg)

    return (): void => {
      socket.off('message', handleMsg)
      socket.off('leave_room', handleMsg)
    }

  }, [])

  const sendMsg = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    const data = {msg: msg, username: username}
    if(msg.toLowerCase() === props.currentWord.word.toLowerCase()){
      if(props.painter.current !== username)
        socket.emit('correct', {msgData: data, currentPainter: props.painter.current, room: room})
      else{
        const newMsg = {id: props.messages.length + 1, msg: `${data.username}: ${data.msg}`}
        props.setMessages(msgs => [...msgs, newMsg])
      }
    }
    else
      socket.send(data)
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
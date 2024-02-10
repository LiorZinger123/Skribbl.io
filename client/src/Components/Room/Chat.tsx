import { useEffect, useState } from "react"
import ChatMessage from "../../types/RoomTypes/chatMessage"
import { Socket } from "socket.io-client"
import { Word } from "../../types/RoomTypes/screenMsgs"

type Props = {
    socket: Socket,
    username: string,
    messages: ChatMessage[],
    setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
    currentWord: Word
}

const Chat = (props: Props) => {

  const [msg, setMsg] = useState<string>('')

  useEffect(() => {

    const handleMsg = (msg: string): void => {
      props.setMessages(messages => [...messages, { id: messages.length + 1, msg: msg}])
    }

    props.socket.on('message', handleMsg)
    props.socket.on('leaveroom', handleMsg)

    return (): void => {
      props.socket.off('message', handleMsg)
      props.socket.off('leaveroom', handleMsg)
    }

  }, [])

  const sendMsg = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    const data = {msg: msg, username: props.username}
    if(msg.toLowerCase() === props.currentWord.word.toLowerCase())
      props.socket.emit('correct', data)
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
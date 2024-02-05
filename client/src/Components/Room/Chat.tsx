import { useState } from "react"
import ChatMessage from "../../types/chatMessage"
import { Socket } from "socket.io-client"

type Props = {
    socket: Socket,
    room: string,
    messages: ChatMessage[]
}

const Chat = (props: Props) => {

  const [msg, setMsg] = useState<string>('')
    

  const sendMsg = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    props.socket.send({room: props.room, msg: msg})
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
import React, { useEffect, useState, useContext, useRef } from "react"
import { SocketContext } from "./Room"
import { ChatMessage, CorrectMsgFromServer } from "../../types/RoomTypes/types"
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
  const msgsRef = useRef<HTMLDivElement>(null!)

  useEffect(() => {

    const handleMsg = (data: CorrectMsgFromServer): void => {
      props.setMessages(messages => [...messages, { id: messages.length + 1, msg: data.msg, color: data.color}])
    }

    socket.on('message', handleMsg)
    socket.on('leave_room', handleMsg)

    return (): void => {
      socket.off('message', handleMsg)
      socket.off('leave_room', handleMsg)
    }

  }, [])

  useEffect(() => {
    msgsRef.current.lastElementChild?.scrollIntoView()
  }, [props.messages])

  const sendMsg = (e: React.FormEvent<HTMLFormElement> | React.MouseEvent): void => {
    e.preventDefault()
    const data = {msg: msg, username: username}
    if(msg.toLowerCase() === props.currentWord.word.toLowerCase()){
      let newMsg = {id: props.messages.length + 1, msg: `${data.username}: ${data.msg}`, color: 'black'} //local msg to add to user's chat
      if(props.painter.current !== username){
        socket.emit('correct', {msgData: data, currentPainter: props.painter.current, room: room}) // send msg to all the other users if not the drawer
        newMsg = {...newMsg, color: 'green'} // add green color to user msg
      } 
      props.setMessages(msgs => [...msgs, newMsg]) // add msg locally
    }
    else
      socket.send(data)
    setMsg('')
  }

  return (
    <div className="chat">

      <div className="chat-msgs" ref={msgsRef}>
        {props.messages.map(msg => (
          <p key={msg.id} style={{ color: msg.color ? msg.color : 'black' }}>{msg.msg}</p>
        ))}
      </div>

      <form onSubmit={sendMsg}>
        <input type="text" value={msg} onChange={e => setMsg(e.target.value)} required placeholder="Type your message here" />
      </form>

    </div>
  )
}

export default Chat
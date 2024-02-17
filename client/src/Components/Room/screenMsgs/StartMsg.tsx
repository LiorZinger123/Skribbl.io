import { useEffect, useRef, useState } from "react"
import { Socket } from "socket.io-client"

type Props = {
  socket: Socket,
}

const StartMsg = (props: Props) => {

  const [screenMsg, setScreenMsg] = useState<string>('')
  const timeoutRef = useRef<NodeJS.Timeout>(null!)

  useEffect(() => {

    const startMsg = (msg: string): void => {
      setScreenMsg(msg)
      timeoutRef.current = setTimeout(() => {
        setScreenMsg('')
        props.socket.emit('chooseword')
      }, 3000)
    }

    props.socket.on('startgame', startMsg)

    return (): void => {
      props.socket.off('startgame', startMsg)
      clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <>
      {screenMsg.length > 0 &&
        <div>
          <p>{screenMsg}</p>
        </div>
      }
    </>
  )
}

export default StartMsg
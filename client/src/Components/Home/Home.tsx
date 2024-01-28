import { useState, useEffect } from "react"
import { Socket, io } from "socket.io-client"

const Home = () => {

    const [socket, setSocket] = useState<Socket>(null!)
    const [room, setRoom] = useState<string>('')

    useEffect(() => {
        const newSocket = io('http://localhost:8080')
        setSocket(newSocket)
        newSocket.on('createRoom', (id: string) => {
            setRoom(id)
        })
        return (): void => {
            newSocket.off('createRoom')
            newSocket.close()
        }
    }, [])

    const joinRoon = (): void => {
        socket.emit('join', room)
    }

    const createRoom = (): void => {
        socket.emit('create')
    }

  return (
    <div>
        <input type="text" value={room} onChange={e => setRoom(e.target.value)} placeholder="Room ID" />
        <button onClick={joinRoon}>Join Room</button>
        <button onClick={createRoom}>Create Room</button>
    </div>
  )
}

export default Home
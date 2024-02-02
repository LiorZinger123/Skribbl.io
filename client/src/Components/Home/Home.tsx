import { useState, useEffect, useContext } from "react"
import Room from "../../types/room"
import { getFromApi } from "../../Api/fetch"
import RoomInList from "../RoomInList/RoomInList"
import { StableNavigateContext } from "../../App"

const Home = () => {

    const [rooms, setRooms] = useState<Room[]>([])
    const nav = useContext(StableNavigateContext)

    useEffect(() => {
        const getRoomsFromApi = async (): Promise<void> => {
            const res = await getFromApi('users/rooms')
            if(res.ok)
              setRooms(await res.json())
        }
       getRoomsFromApi()
    }, [])

  return (
    <div>
        <button onClick={() => nav('/createroom')}>Create Room</button>
        <ul>
            {rooms.map(room => (
              <RoomInList key={room.id} room={room} />
            ))}
        </ul>
    </div>
  )
}

export default Home
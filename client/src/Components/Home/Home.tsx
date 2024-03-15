import React, { useState, useEffect, useContext, useRef } from "react"
import Room from "../../types/room"
import { fetchToApi, getFromApi } from "../../Api/fetch"
import RoomInList from "../RoomInList/RoomInList"
import { StableNavigateContext } from "../../App"

const Home = () => {

    const nav = useContext(StableNavigateContext)
    const [rooms, setRooms] = useState<Room[]>([])
    const intervalRef = useRef<NodeJS.Timeout>(null!)
    const refreshTime = 1000 * 60 * 5

    useEffect(() => {

      const onScroll = async (e: any): Promise<void> => { //change type
        if(e.currentTarget.scrollHeight - e.currentTarget.scrollTop === e.currentTarget.clientHeight){
          try{
            const res = await fetchToApi('rooms/get_more_rooms', {roomsLength: rooms.length})
            if(res.ok){
              const moreRooms = await res.json()
              setRooms(rooms => [...rooms, ...moreRooms])
            }
          }
          catch{

          }
        }
      }

      getRoomsFromApi()
      window.addEventListener('scroll', onScroll)

      return (): void => {
        window.removeEventListener('scroll', onScroll)
      }
    }, [])

    const getRoomsFromApi = async (): Promise<void> => {
      const res = await getFromApi('rooms/getrooms')
      if(res.ok)
        setRooms(await res.json())
    }

    useEffect(() => {
      intervalRef.current = setInterval(() => {
        refreshRooms()
      }, refreshTime)

      return (): void => {
        clearInterval(intervalRef.current)
      }
    }, [])

    const refreshRooms = async (): Promise<void> => { 
      try{
        await getRoomsFromApi()
        clearInterval(intervalRef.current)
        intervalRef.current = setInterval(() => {
          refreshRooms()
        }, refreshTime)
      }
      catch{

      }
    }

  return (
    <div>
        <button onClick={() => nav('/createroom')}>Create Room</button>
        <button onClick={refreshRooms}>RERESH</button>
        <ul>
            {rooms.map(room => (
              <RoomInList key={room.id} room={room} />
            ))}
        </ul>
    </div>
  )
}

export default Home
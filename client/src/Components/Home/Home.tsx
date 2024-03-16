import { useState, useEffect, useContext } from "react"
import Room from "../../types/room"
import { fetchToApi, getFromApi } from "../../Api/fetch"
import Rooms from "./Rooms"
import { StableNavigateContext } from "../../App"
import Search from "./Search"
import Refresh from "./Refresh"

const Home = () => {

    const nav = useContext(StableNavigateContext)
    const [rooms, setRooms] = useState<Room[]>([])
    const [showError, setShowError] = useState<boolean>(false)
    const [search, setSearch] = useState<string>('')
    const [searchRooms, setSearchRooms] = useState<Room[]>([])
    const [showSearchError, setShowSearchError] = useState<boolean>(false)
    const [refreshTime, setRefreshTime] = useState<number>(0)

    useEffect(() => {

      const onScroll = async (e: any): Promise<void> => { //change type
        if(e.currentTarget.scrollHeight - e.currentTarget.scrollTop === e.currentTarget.clientHeight){
          try{
            const res = await fetchToApi('rooms/get_more_room', {roomsLength: rooms.length})
            if(res.ok){
              const moreRooms = await res.json()
              setRooms(rooms => [...rooms, ...moreRooms])
            }
          }
          catch(e){
            throw e //check
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
      try{
        const res = await getFromApi('rooms/getrooms')
        if(res.ok)
          setRooms(await res.json())
        else
          setShowError(true)
      }
      catch{
        setShowError(true)
      }
    }

  return (
    <div className="home">
      <h1>SKRIBBLE.IO</h1>
        
        <div className="search-div">
          <Search search={search} setSearch={setSearch} setSearchRooms={setSearchRooms} setShowSearchError={setShowSearchError} />
          <Refresh getRoomsFromApi={getRoomsFromApi} setRefreshTime={setRefreshTime} />
        </div>
        
        {!showError
          ? <Rooms search={search} rooms={rooms} searchRooms={searchRooms} showSearchError={showSearchError} refreshTime={refreshTime} />
          : <p>An error has occurred while loading game rooms. Please try again later.</p>
        }

        <button className='create-btn' onClick={() => nav('/createroom')}>+</button>
    </div>
  )
}

export default Home
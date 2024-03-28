import { useState, useEffect } from "react"
import Room from "../../types/room"
import { fetchToApi, getFromApi } from "../../Api/fetch"
import Rooms from "./Rooms"
import { useAppSelector } from "../../store/hooks"
import { RootState } from "../../store/store"
import Search from "./Search"
import Refresh from "./Refresh"
import Disconnect from "./Disconnect"
import TokenError from "../TokenError/TokenError"
import CreateButton from "./CreateButton"

const Home = () => {

    const username = useAppSelector((state: RootState) => state.username)
    const [rooms, setRooms] = useState<Room[]>([])
    const [showError, setShowError] = useState<boolean>(false)
    const [search, setSearch] = useState<string>('')
    const [searchRooms, setSearchRooms] = useState<Room[]>([])
    const [showSearchError, setShowSearchError] = useState<boolean>(false)
    const [refreshTime, setRefreshTime] = useState<number>(0)
    const [showTokenError, setShowTokenError] = useState<boolean>(false)

    useEffect(() => {

      const onScroll = async (e: any): Promise<void> => { //change type
        if(e.currentTarget.scrollHeight - e.currentTarget.scrollTop === e.currentTarget.clientHeight){
          try{
            const res = await fetchToApi('rooms/get_more_room', {roomsLength: rooms.length})
            if(res.ok){
              const moreRooms = await res.json()
              setRooms(rooms => [...rooms, ...moreRooms])
            }
            else if(res.status === 401)
              setShowTokenError(true)
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
        if(res.ok){
          setRooms(await res.json())
          if(showError)
            setShowError(false)
        }
        else if(res.status === 401)
          setShowTokenError(true)
        else
          setShowError(true)
      }
      catch{
        setShowError(true)
      }
    }

  return (
    <>
      <div className={`home ${showTokenError ? 'home-when-error' : null}`}>
        <h1 className="title">WELCOME TO SKRIBBLE.IO</h1>
          
          <div className="disconnect-div">
            <p>Welcome {username}</p>
            <Disconnect />
          </div>

          <div className="search-div">
            <Search search={search} setSearch={setSearch} setSearchRooms={setSearchRooms}
              setShowSearchError={setShowSearchError} setShowTokenError={setShowTokenError} />
            <Refresh getRoomsFromApi={getRoomsFromApi} setRefreshTime={setRefreshTime} />
          </div>
          
          {!showError
            ? <Rooms search={search} rooms={rooms} searchRooms={searchRooms} showSearchError={showSearchError} 
                setShowTokenError={setShowTokenError} refreshTime={refreshTime} />
            : <p>An error has occurred while loading game rooms. Please try again later.</p>
          }

          <CreateButton setShowTokenError={setShowTokenError} />
      </div>

      {showTokenError && <TokenError />}
    </>
    
  )
}

export default Home
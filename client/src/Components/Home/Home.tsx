import { useState, useEffect, useRef } from "react"
import { Room } from "../../types/HomeTypes/homeTypes"
import { fetchToApi, getFromApi } from "../../Api/fetch"
import Rooms from "./Rooms/Rooms"
import { useAppSelector } from "../../store/hooks"
import { RootState } from "../../store/store"
import Search from "./Search/Search"
import Refresh from "./Refresh/Refresh"
import Disconnect from "./Disconnect/Disconnect"
import TokenError from "../TokenError/TokenError"
import CreateButton from "./CreateButton/CreateButton"

const Home = () => {

    const username = useAppSelector((state: RootState) => state.username)
    const [rooms, setRooms] = useState<Room[]>([])
    const roomsLength = useRef<number>(0)
    const homeRef = useRef<HTMLDivElement | null>(null)
    const [showError, setShowError] = useState<boolean>(false)
    const [search, setSearch] = useState<string>('')
    const [searchRooms, setSearchRooms] = useState<Room[]>([])
    const [showSearchError, setShowSearchError] = useState<boolean>(false)
    const [refreshTime, setRefreshTime] = useState<number>(0)
    const [showTokenError, setShowTokenError] = useState<boolean>(false)
    const [showRefreshError, setShowRefreshError] = useState<boolean>(false)
    const [lazyLoadingError, setLazyLoadingError] = useState<boolean>(false)
    
    useEffect(() => {
      
      const onScroll = async (): Promise<void> => {
        if(Math.ceil(window.scrollY + window.innerHeight) === homeRef.current?.scrollHeight){
          try{
            const res = await fetchToApi('rooms/get_more_rooms', {roomsLength: roomsLength.current})
            if(res.ok){
              const data = await res.json()
              setRooms(rooms => [...rooms, ...data.rooms])
              roomsLength.current += data.count
              setLazyLoadingError(false)
            }
            else if(res.status === 401)
              setShowTokenError(true)
            else
              setLazyLoadingError(true)
          }
          catch{
            setLazyLoadingError(true)
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
          roomsLength.current = 10
          if(showError)
            setShowError(false)
          if(showRefreshError)
            setShowRefreshError(false)
        }
        else if(res.status === 401)
          setShowTokenError(true)
        else if(res.status === 429)
          setShowRefreshError(true)
        else
          setShowError(true)
      }
      catch{
        setShowError(true)
      }
    }

  return (
    <>
      <div className={`home ${showTokenError ? 'home-when-error' : null}`} ref={homeRef}>
        <h1 className="title">WELCOME TO SKRIBBL.IO</h1>
          
          <div className="disconnect-div">
            <p>Welcome {username}</p>
            <Disconnect />
          </div>

          <div className="search-div">
            <Search search={search} setSearch={setSearch} setSearchRooms={setSearchRooms}
              setShowSearchError={setShowSearchError} setShowTokenError={setShowTokenError} />
            <Refresh getRoomsFromApi={getRoomsFromApi} setRefreshTime={setRefreshTime} />
          </div>
          
          {!showError && !showRefreshError
            ? <Rooms search={search} rooms={rooms} searchRooms={searchRooms} showSearchError={showSearchError} 
                setShowTokenError={setShowTokenError} refreshTime={refreshTime} />
            : (showError
                ? <p>An error has occurred while loading game rooms. Please try again later.</p>
                : <p>Too many refreshes, try again later.</p>
              ) 
          }

          {lazyLoadingError && <p className="lazy-loading-error">An error has occurred while loading more rooms. Please try again later.</p>}

          <CreateButton setShowTokenError={setShowTokenError} />
      </div>

      {showTokenError && <TokenError />}
    </>
    
  )
}

export default Home
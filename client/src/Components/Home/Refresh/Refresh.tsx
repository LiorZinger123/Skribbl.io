import { useState, useRef, useEffect } from "react"
import RefreshIcon from '@mui/icons-material/Refresh';
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';

type Props = {
    getRoomsFromApi: () => Promise<void>,
    setRefreshTime: React.Dispatch<React.SetStateAction<number>>,
}

const Refresh = (props: Props) => {

    const [popup, setPopup] = useState<boolean>(false)
    const [anchor, setAnchor] = useState<HTMLElement | null>(null)
    const [classname, setClassname] = useState<string>("refresh")
    const refreshRef = useRef<any | null>(null)
    const intervalRef = useRef<NodeJS.Timeout>(null!)
    const timeoutRef = useRef<NodeJS.Timeout>(null!)
    const time = 1000 * 60 * 5

    useEffect(() => {
      const cancelRotation = (): void => {
        setClassname("refresh")
      }
      
      refreshRef.current?.addEventListener("animationend", cancelRotation)      
      refreshRooms()
      
      return (): void => {
        clearInterval(intervalRef.current)
        clearTimeout(timeoutRef.current)
        refreshRef.current?.removeEventListener("animationend", cancelRotation)
      }
    }, [])

    const refreshRooms = (): void => {
      clearInterval(intervalRef.current)
      clearTimeout(timeoutRef.current)
      props.setRefreshTime(time / 1000)
      
      intervalRef.current = setInterval(() => {
        props.setRefreshTime(t => t - 1)
      }, 1000)

      timeoutRef.current = setTimeout(async () => {
        await props.getRoomsFromApi()
        refreshRooms()
      }, time)
    }

    const handleRefresh = async (): Promise<void> => {
      await props.getRoomsFromApi()
      refreshRooms()
      setClassname("refresh refresh-rotate")
    }

    const handleMouseEnter = (e: React.MouseEvent<any>): void => {
      setPopup(true)
      if(!anchor)
        setAnchor(e.currentTarget)
    }

  return (
    <>
      <RefreshIcon ref={refreshRef} className={classname} onClick={handleRefresh} fontSize="large" 
        onMouseEnter={handleMouseEnter} onMouseLeave={() => setPopup(false)} />
      <BasePopup open={popup} anchor={anchor} placement="right-start">
        <div className="popup refresh-popup">Refresh Rooms</div>
      </BasePopup>
    </>
  )
}

export default Refresh
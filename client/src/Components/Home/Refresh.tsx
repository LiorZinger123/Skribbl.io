import { useRef, useEffect } from "react"
import RefreshIcon from '@mui/icons-material/Refresh';

type Props = {
    getRoomsFromApi: () => Promise<void>,
    setRefreshTime: React.Dispatch<React.SetStateAction<number>>
}

const Refresh = (props: Props) => {

    const intervalRef = useRef<NodeJS.Timeout>(null!)
    const timeoutRef = useRef<NodeJS.Timeout>(null!)
    const time = 1000 * 60 * 5

    useEffect(() => {

      refreshRooms()

      return (): void => {
        clearInterval(intervalRef.current)
        clearTimeout(timeoutRef.current)
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
    }

  return (
    <>
      <RefreshIcon className="refresh" onClick={handleRefresh} fontSize="large" />
    </>
  )
}

export default Refresh
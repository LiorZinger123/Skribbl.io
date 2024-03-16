import { useRef, useEffect } from "react"

type Props = {
    getRoomsFromApi: () => Promise<void>
}

const Refresh = (props: Props) => {

    const intervalRef = useRef<NodeJS.Timeout>(null!)
    const refreshTime = 1000 * 60 * 5

    useEffect(() => {
        intervalRef.current = setInterval(() => {
          refreshRooms()
        }, refreshTime)
  
        return (): void => {
          clearInterval(intervalRef.current)
        }
      }, [])

    const refreshRooms = async (): Promise<void> => { 
      await props.getRoomsFromApi()
      clearInterval(intervalRef.current)
      intervalRef.current = setInterval(() => {
        refreshRooms()
      }, refreshTime)
    }  

  return (
    <div>
        <button onClick={refreshRooms}>RERESH</button>
    </div>
  )
}

export default Refresh
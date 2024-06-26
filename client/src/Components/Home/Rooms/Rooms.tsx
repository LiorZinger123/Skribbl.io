import RoomInList from "./RoomInList"
import { Room } from "../../../types/HomeTypes/homeTypes"

type Props = {
    search: string,
    rooms: Room[],
    searchRooms: Room[],
    showSearchError: boolean,
    refreshTime: number,
    setShowTokenError: React.Dispatch<React.SetStateAction<boolean>>
}

const Rooms = (props: Props) => {

    const rooms = 
    <div>
        {
            props.rooms.length > 0
            ? (props.rooms.map(room => (
                <RoomInList key={room.id} room={room} setShowTokenError={props.setShowTokenError} />
                )))
            : <p>There are no active rooms. Create one and start play!</p>
        }
    </div>
    
    const serachRooms = 
    <div>
        {
            props.searchRooms.length > 0
            ? (props.searchRooms.map(room => (
                <RoomInList key={room.id} room={room} setShowTokenError={props.setShowTokenError} />
                )))
            : (
                !props.showSearchError
                ? <p>No results!</p>
                : <p>Failed to search rooms, please try again.</p>
                ) 
        }
    </div>

    const refreshTime = <p className="next-refresh-time">Next Refresh: {Math.floor(props.refreshTime / 60) != 0 && 
        `${Math.floor(props.refreshTime / 60)} Minutes`} {props.refreshTime % 60 != 0 && ` ${props.refreshTime % 60} Seconds`}</p> 

    return (
        <div className="rooms">
            {refreshTime}
            {
                props.search.length === 0
                ? (rooms)
                : (serachRooms)
            }
        </div>
    )
}

export default Rooms
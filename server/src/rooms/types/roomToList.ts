import { ConnectedPlayersType } from "./room"

type RoomToList = {
    id: string, 
    name: string,
    hasPassword: boolean,
    connectedPlayers: ConnectedPlayersType[],
    maxPlayers: number
}

export default RoomToList
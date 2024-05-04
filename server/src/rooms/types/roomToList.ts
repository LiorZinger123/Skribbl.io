import { ConnectedPlayersType } from "./room"

export type RoomToList = {
    id: string, 
    name: string,
    hasPassword: boolean,
    connectedPlayers: ConnectedPlayersType[],
    maxPlayers: number
}
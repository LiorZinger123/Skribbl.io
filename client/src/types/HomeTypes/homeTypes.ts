import { PlayerType } from "../RoomTypes/types"

export type Room = {
    id: string,
    name: string
    hasPassword: boolean,
    connectedPlayers: PlayerType[],
    maxPlayers: number
}
import PlayerType from "./RoomTypes/playerType"

type Room = {
    id: string,
    name: string
    hasPassword: boolean,
    connectedPlayers: PlayerType[],
    maxPlayers: number
}

export default Room
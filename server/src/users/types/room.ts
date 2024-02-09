interface Room {
    id: string,
    name: string,
    password?: string,
    players: number,
    time: number,
    rounds: number,
    connectedPlayers: ConnectedPlayersType[],
    currentDrawing: string
}

export type ConnectedPlayersType = {
    id: number,
    username: string, 
    score: number,
    roomOwner: boolean
}

export default Room
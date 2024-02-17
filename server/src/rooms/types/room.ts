interface Room {
    id: string,
    name: string,
    password?: string,
    players: number,
    time: number,
    rounds: number,
    connectedPlayers: ConnectedPlayersType[],
    turnScores: playerTurnScore[]
    currentDrawing: string
}

export type ConnectedPlayersType = {
    id: number,
    username: string, 
    score: number,
    roomOwner: boolean
}

export type playerTurnScore = {
    username: string, 
    score: number
}

export default Room
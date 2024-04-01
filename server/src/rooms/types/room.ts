type Room = {
    id: string,
    name: string,
    password?: string,
    players: number,
    seconds: number,
    rounds: number,
    currentTime: number,
    currentRound: number,
    connectedPlayers: ConnectedPlayersType[],
    currentPlayerPos: number,
    startPlaying: boolean,
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
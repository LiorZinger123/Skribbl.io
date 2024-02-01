interface Room {
    id: string,
    name: string,
    password?: string,
    players: number,
    time: number,
    rounds: number,
    connectedPlayers: number,
    currentDrawing: any[]
}

export default Room
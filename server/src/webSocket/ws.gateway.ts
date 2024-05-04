import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer,
    ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io'
import { RoomsService } from "src/rooms/rooms.service";
import { Word, msgData } from "./types/types";

@WebSocketGateway({ cors: true })
export class WsGateway implements OnGatewayConnection, OnGatewayDisconnect{

    constructor(
        private readonly roomsService: RoomsService
    ){}

    @WebSocketServer()
    server: Server

    handleConnection(socket: Socket) {
        console.log(`${socket.id} Connected`)
    }

    handleDisconnect(socket: Socket) {
        console.log(`${socket.id} disconnected`)
    }

    @SubscribeMessage('join')
    joinRoom(@MessageBody() data: {room: string, username: string}, @ConnectedSocket() socket: Socket): void {
        socket.join(data.room)
        const connectedPlayers = this.roomsService.getPlayers(data.room)
        const RoomDetails = this.roomsService.getRoomDetails(data.room)
        const locations = this.roomsService.updatePlayersLocations(data.room)
        const isOwner = this.roomsService.getOwner(data.room)
        const checkIfGameStarted = this.roomsService.checkIfGameStarted(data.room)
        this.server.to(socket.id).emit('players', connectedPlayers)
        this.server.to(socket.id).emit('room_details', RoomDetails)
        this.server.to(data.room).emit('locations', {locations: locations})
        this.server.to(data.room).emit('message', {msg: `${data.username} joined the room`, color: 'blue'})
        this.server.to(data.room).except(socket.id).emit('players', connectedPlayers.slice(-1))
        if(isOwner === data.username)
            this.server.to(socket.id).emit('show_start_button')
        if(checkIfGameStarted){
            const whileDrawing = this.roomsService.joinWhileDrawing(data.room)
            this.server.to(socket.id).emit("while_drawing", whileDrawing.turnData)
            this.server.to(socket.id).emit('join_turn', whileDrawing.turnData.word)
            this.server.to(socket.id).emit('update_drawing', whileDrawing.currentDrawing)
        }
    }

    @SubscribeMessage('message')
    sendMessage(@MessageBody() data: { msg: string, username: string }, @ConnectedSocket() socket: Socket): void{
        const room = Array.from(socket.rooms.values())[1]
        this.server.to(room).emit('message', {msg: `${data.username}: ${data.msg}`})
    }

    @SubscribeMessage('start_game')
    startGame(@MessageBody() data: { room: string }): void{
        this.roomsService.startPlaying(data.room)
        this.server.to(data.room).emit('start_game')
    }   

    @SubscribeMessage('choose_word')
    chooseWord(@MessageBody() data: { room: string }): void {
        this.server.to(data.room).emit('choose_word')
    }
    
    @SubscribeMessage('turn')
    startTurn(@MessageBody() data: {word: Word, currentPainter: string, room: string}, @ConnectedSocket() socket: Socket): void {
        this.roomsService.updateCurrentWord(data.room, data.word)
        this.server.to(data.room).emit('start_turn', data.word)
        this.server.to(socket.id).emit('start_draw')
        this.server.to(data.room).emit('message', {msg: `${data.currentPainter} is drawing now!`, color: 'orange'})
    }

    @SubscribeMessage('tick')
    tick(@MessageBody() data: {room: string}, @ConnectedSocket() socket: Socket): void{
        const currentTime = this.roomsService.tick(data.room)
        this.server.to(data.room).except(socket.id).emit('tick', currentTime)
    }

    @SubscribeMessage('drawing')
    sendDrawing(@MessageBody() data: {drawing: string, room: string}, @ConnectedSocket() socket: Socket): void{
        this.roomsService.updateDrawing(data.room, data.drawing)
        this.server.to(data.room).except(socket.id).emit('update_drawing', data.drawing)   
    }
    
    @SubscribeMessage('correct')
    correctAnswer(@MessageBody() data: { msgData: msgData, room: string}, @ConnectedSocket() socket: Socket): void{
        this.roomsService.addNewTurnScore(data.room, data.msgData.username)
        this.server.to(data.room).except(socket.id).emit('message', {msg: `${data.msgData.username} guessed the word!`, color: 'green'})
        this.server.to(data.room).emit('correct', { username: data.msgData.username })
        if(this.roomsService.checkIfAllPlayersGuested(data.room))
            this.server.to(data.room).emit('end_turn_now')
    }

    @SubscribeMessage('end_turn')
    endTurn(@MessageBody() data: { room: string }, ifIncreaseCurrentPos?: boolean): void{
        const increase = ifIncreaseCurrentPos != undefined ? ifIncreaseCurrentPos : true
        if(increase)
            this.roomsService.updateScoreAfterTurn(data.room)
        this.roomsService.resetTurnClock(data.room)
        const updatedPainter = this.roomsService.updatePainter(data.room, increase)
        const scores = this.roomsService.getTurnScores(data.room)
        const owner = this.roomsService.getOwner(data.room)
        const locations = this.roomsService.updatePlayersLocations(data.room)
        this.roomsService.updateCurrentWord(data.room, { word: '', length: '' })
        this.server.to(data.room).emit('end_turn', {scores: scores, painter: updatedPainter, owner: owner})
        this.server.to(data.room).emit('locations', {locations: locations})
        this.server.to(data.room).emit('remove_color')
    }

    @SubscribeMessage('leave_Room')
    leaveRoom(@MessageBody() data: {username: string, room: string, currentPainter: string}, @ConnectedSocket() socket: Socket): void {
        const ownerLeftBeofreStarting = this.roomsService.checkIfOwnerLeftBeforeStarting(data.room, data.username)
        const ownerLeftAfterStarting = this.roomsService.checkIfOwnerLeftAfterStarting(data.room, data.username)
        const updatedPlayers = this.roomsService.leaveRoom(data.room, data.username)
        this.server.to(data.room).emit('message', {msg: `${data.username} has left the room`, color: 'red'})

        if(ownerLeftBeofreStarting){
            this.server.to(data.room).emit('owner_left', updatedPlayers[0].username)
            this.server.to(data.room).emit('message', {msg: `${updatedPlayers[0].username} is the new owner of the room!`, color: 'fuchsia'})
        }

        if(updatedPlayers != null){
            this.server.to(data.room).emit('player_left', updatedPlayers)

            if(ownerLeftAfterStarting)
                this.server.to(data.room).emit('message', {msg: `${updatedPlayers[0].username} is the new owner of the room!`, color: 'fuchsia'})

            if(data.username === data.currentPainter){
                this.server.to(data.room).emit('end_turn_now')
                this.roomsService.setTurnScoresToZero(data.room)
                this.endTurn({room: data.room}, false)
            }
        }
        else
            this.server.to(data.room).emit('room_closed')
        socket.disconnect(true)
    }

    @SubscribeMessage('end_game')
    endGame(@MessageBody() data: {room: string}): void{
        let winnerMsg = null
        const winner = this.roomsService.getWinner(data.room)
        if(winner.length === 1)
            winnerMsg = winner[0]
        else{
            winnerMsg = winner.map(w => {
                if(winner.indexOf(w) < winner.length - 2)
                    return `${w}, `
                else if (winner.indexOf(w) === winner.length - 2)
                    return `${w} and `
                else
                    return `${w}`
            })
        }
        const owner = this.roomsService.getOwner(data.room)
        this.server.to(data.room).emit('end_game', {winnerMsg: winnerMsg, owner: owner})
    }

    @SubscribeMessage('close_room')
    closeRoom(@MessageBody() data: {room: string}): void{
        this.roomsService.closeRoom(data.room)
    }

    @SubscribeMessage('restart')
    restart(@MessageBody() data: {room: string}): void{
        this.roomsService.restartGame(data.room)
        const owner = this.roomsService.getOwner(data.room)
        const locations = this.roomsService.updatePlayersLocations(data.room)
        this.server.to(data.room).emit('restart', owner)
        this.server.to(data.room).emit('locations', {locations: locations})
    }

    @SubscribeMessage('start_new_game')
    startNewGame(@MessageBody() data: {room: string}): void{
        this.server.to(data.room).emit('start_game')
    }
}  
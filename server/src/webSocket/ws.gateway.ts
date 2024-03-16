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
        this.server.to(socket.id).emit('players', connectedPlayers)
        this.server.to(socket.id).emit('room_details', RoomDetails)
        this.server.to(data.room).emit('message', `${data.username} joined the room`)
        this.server.to(data.room).except(socket.id).emit('players', connectedPlayers.slice(-1))
    }

    @SubscribeMessage('message')
    sendMessage(@MessageBody() data: { msg: string, username: string }, @ConnectedSocket() socket: Socket): void{
        const room = Array.from(socket.rooms.values())[1]
        this.server.to(room).emit('message', `${data.username}: ${data.msg}`)
    }

    @SubscribeMessage('start_game')
    startGame(@MessageBody() data: { room: string }): void{
        this.roomsService.startPlaying(data.room)
        this.server.to(data.room).emit('hide_start_btn')
        this.server.to(data.room).emit('start_game')
    }   

    @SubscribeMessage('choose_word')
    chooseWord(@MessageBody() data: { room: string }): void {
        this.server.to(data.room).emit('choose_word')
    }
    
    @SubscribeMessage('turn')
    startTurn(@MessageBody() data: {word: Word, currentPainter: string, room: string}, @ConnectedSocket() socket: Socket): void {
        this.server.to(data.room).emit('start_turn', data.word)
        this.server.to(socket.id).emit('start_draw')
        this.server.to(data.room).emit('message', `${data.currentPainter} is drawing now!`)
    }

    @SubscribeMessage('tick')
    tick(@MessageBody() data: {room: string}): void{
        this.roomsService.tick(data.room)
    }

    @SubscribeMessage('drawing')
    sendDrawing(@MessageBody() data: {drawing: string, room: string}, @ConnectedSocket() socket: Socket): void{
        this.roomsService.updateDrawing(data.room, data.drawing)
        this.server.to(data.room).except(socket.id).emit('update_drawing', data.drawing)    
    }
    
    @SubscribeMessage('correct')
    correctAnswer(@MessageBody() data: { msgData: msgData, currentPainter: string, room: string}, @ConnectedSocket() socket: Socket): void{
        this.roomsService.addNewTurnScore(data.room, data.msgData.username, data.currentPainter)
        this.server.to(socket.id).emit('message', `${data.msgData.username}: ${data.msgData.msg}`)
        this.server.to(data.room).except(socket.id).emit('message', `${data.msgData.username} guessed the word!`)
        if(this.roomsService.checkIfAllPlayersGuested(data.room))
            this.server.to(data.room).emit('end_turn_now')
    }

    @SubscribeMessage('end_turn')
    endTurn(@MessageBody() data: { room: string }, ifIncreaseCurrentPos?: boolean): void{
        this.roomsService.resetTurnClock(data.room)
        this.roomsService.updateScoreAfterTurn(data.room)
        const increase = ifIncreaseCurrentPos ? ifIncreaseCurrentPos : true
        const updatedPainter = this.roomsService.updatePainter(data.room, increase)
        const scores = this.roomsService.getTurnScores(data.room)
        const owner = this.roomsService.getOwner(data.room)
        this.server.to(data.room).emit('end_turn', {scores: scores, painter: updatedPainter, owner: owner})
    }

    @SubscribeMessage('leave_Room')
    leaveRoom(@MessageBody() data: {username: string, room: string, currentPainter: string}, @ConnectedSocket() socket: Socket): void {
        const updatedPlayers = this.roomsService.leaveRoom(data.room, data.username)
        this.server.to(data.room).emit('message', `${data.username} has left the room`)
        if(updatedPlayers != null){
            this.server.to(data.room).emit('player_left', updatedPlayers)
            if(data.username === data.currentPainter){
                this.server.to(data.room).emit('end_turn_now')
                this.roomsService.setTurnScoreToZero(data.room)
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
        this.server.to(data.room).emit('restart', owner)
    }

    @SubscribeMessage('start_new_game')
    startNewGame(@MessageBody() data: {room: string}): void{
        this.server.to(data.room).emit('start_game')
    }
}   
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
        this.server.emit('start_game', 'Starting Game!')
    }   

    @SubscribeMessage('choose_word')
    chooseWord(@MessageBody() data: { room: string }): void {
        this.server.to(data.room).emit('choose_word')
    }
    
    @SubscribeMessage('turn')
    startTurn(@MessageBody() data: {word: Word, currentDrawer: string, room: string}, @ConnectedSocket() socket: Socket): void {
        this.server.to(data.room).emit('start_turn', data.word)
        this.server.to(socket.id).emit('start_draw')
        this.server.to(data.room).emit('current_drawer', data.currentDrawer)
        this.server.to(data.room).emit('message', `${data.currentDrawer} is drawing now!`)
    }

    @SubscribeMessage('drawing')
    sendDrawing(@MessageBody() data: {drawing: string, room: string}, @ConnectedSocket() socket: Socket): void{
        this.roomsService.updateDrawing(data.room, data.drawing)
        this.server.to(data.room).except(socket.id).emit('update_drawing', data.drawing)    
    }
    
    @SubscribeMessage('correct')
    correctAnswer(@MessageBody() data: { msgData: msgData, currentDrawer: string, room: string}, @ConnectedSocket() socket: Socket): void{
        this.roomsService.addNewTurnScore(data.room, data.msgData.username, data.currentDrawer)
        this.server.to(socket.id).emit('message', `${data.msgData.username}: ${data.msgData.msg}`)
        this.server.to(data.room).except(socket.id).emit('message', `${data.msgData.username} guessed the word!`)
        if(this.roomsService.checkIfAllPlayersGuested(data.room))
            this.server.to(data.room).emit('end_turn_now')
    }

    @SubscribeMessage('end_turn')
    endTurn(@MessageBody() data: { room: string }): void{
        const scores = this.roomsService.getTurnScores(data.room)
        this.server.to(data.room).emit('end_turn', scores)
    }

    @SubscribeMessage('leave_Room')
    leaveRoom(@MessageBody() data: {username: string, room: string}, @ConnectedSocket() socket: Socket): void {
        const updatedPlayers = this.roomsService.leaveRoom(data.room, data.username)
        this.server.to(data.room).emit('message', `${data.username} has left the room`)
        if(updatedPlayers != null)
            this.server.to(data.room).emit('player_left', updatedPlayers)
        else
            this.server.to(data.room).emit('room_closed')
        socket.disconnect(true)
    }
}   
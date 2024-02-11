import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer,
    ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io'
import { RoomsService } from "src/rooms/rooms.service";

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
        const drawingTime = this.roomsService.getTime(data.room)
        this.server.to(socket.id).emit('players', connectedPlayers)
        this.server.to(socket.id).emit('time', drawingTime)
        this.server.to(data.room).emit('message', `${data.username} joined the room`)
        this.server.to(data.room).except(socket.id).emit('players', connectedPlayers.slice(-1))
    }

    @SubscribeMessage('message')
    sendMessage(@MessageBody() data: { msg: string, username: string }, @ConnectedSocket() socket: Socket): void{
        const room = Array.from(socket.rooms.values())[1]
        this.server.to(room).emit('message', `${data.username}: ${data.msg}`)
    }

    @SubscribeMessage('startgame')
    startGame(): void{
        this.server.emit('startgame', 'Starting Game!')
    }   

    @SubscribeMessage('correct')
    correctAnswer(@MessageBody() data: { msg: string, username: string }, @ConnectedSocket() socket: Socket): void{
        const room = Array.from(socket.rooms.values())[1]
        this.server.to(socket.id).emit('message', `${data.username}: ${data.msg}`)
        this.server.to(room).except(socket.id).emit('message', `${data.username} guessed the word!`)
    }

    @SubscribeMessage('turn')
    startTurn(@MessageBody() data: {word: string, length: string}, @ConnectedSocket() socket: Socket): void {
        const room = Array.from(socket.rooms.values())[1]
        this.server.to(room).emit('startturn', data)
        this.server.to(socket.id).emit('startdraw')
    }

    @SubscribeMessage('endturn')
    endTurn(@ConnectedSocket() socket: Socket): void{
        const room = Array.from(socket.rooms.values())[1]
        this.server.to(room).emit('endturn')
    }

    @SubscribeMessage('leaveRoom')
    leaveRoom(@MessageBody() data: {username: string}, @ConnectedSocket() socket: Socket): void {
        const room = Array.from(socket.rooms.values())[1]
        this.roomsService.leaveRoom(room, data.username)
        this.server.to(room).emit('message', `${data.username} has left the room`)
        this.server.to(room).emit('players', data.username)
        socket.disconnect(true)
    }

    @SubscribeMessage('drawing')
    sendDrawing(@MessageBody() data: {drawing: string}, @ConnectedSocket() socket: Socket): void{
        const room = Array.from(socket.rooms.values())[1]
        this.roomsService.updateDrawing(room, data.drawing)
        this.server.to(room).except(socket.id).emit('updatedrawing', data.drawing)    
    }
}   
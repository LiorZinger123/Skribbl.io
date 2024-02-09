import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer,
    ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io'
import { UsersService } from "src/users/users.service";

@WebSocketGateway({ cors: true })
export class WsGateway implements OnGatewayConnection, OnGatewayDisconnect{

    constructor(
        private readonly userService: UsersService
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
        const connectedPlayers = this.userService.getPlayersAfterJoin(data.room)
        this.server.to(socket.id).emit('players', connectedPlayers)
        this.server.to(data.room).emit('message', `${data.username} joined the room`)
        this.server.to(data.room).except(socket.id).emit('players', connectedPlayers.slice(-1))
    }

    @SubscribeMessage('message')
    sendMessage(@MessageBody() data: { room: string, msg: string, username: string }): void{
        this.server.to(data.room).emit('message', `${data.username}: ${data.msg}`)
    }

    @SubscribeMessage('leaveRoom')
    leaveRoom(@MessageBody() data: {username: string}, @ConnectedSocket() socket: Socket): void {
        const room = Array.from(socket.rooms.values())[1]
        this.userService.leaveRoom(room, data.username)
        this.server.to(room).emit('message', `${data.username} has left the room`)
        this.server.to(room).emit('players', data.username)
        socket.disconnect(true)
    }

    @SubscribeMessage('drawing')
    sendDrawing(@MessageBody() data: {drawing: string, room: string}, @ConnectedSocket() socket: Socket): void{
        this.userService.updateDrawing(data.room, data.drawing)
        this.server.to(data.room).except(socket.id).emit('updatedrawing', data.drawing)    
    }
}   
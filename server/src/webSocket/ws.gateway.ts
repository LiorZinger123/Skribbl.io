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
        this.server.to(data.room).emit('message', `${data.username} joined the room`) 
    }

    @SubscribeMessage('getplayers')
    connectedPlayers(@MessageBody() room: string, @ConnectedSocket() socket: Socket): void{
        this.server.to(socket.id).emit('players', this.server.in(room).fetchSockets())
    }
    
    @SubscribeMessage('message')
    sendMessage(@MessageBody() data: { room: string, msg: string, username: string }): void{
        this.server.to(data.room).emit('message', `${data.username}: ${data.msg}`)
    }

    @SubscribeMessage('leaveRoom')
    leaveRoom(@MessageBody() username: string, @ConnectedSocket() socket: Socket): void {
        socket.rooms.forEach(room => {
            if(socket.id !== room){
                this.userService.leaveRoom(room)
                this.server.to(room).emit('message', `${username} has left the room`)
            }
        })
        socket.disconnect(true)
    }

    @SubscribeMessage('drawing')
    sendDrawing(@MessageBody() data: {drawing: string, room: string}): void{
        this.userService.updateDrawing(data.room, data.drawing)
        this.server.to(data.room).emit('updatedrawing', data.drawing)    
    }
}   
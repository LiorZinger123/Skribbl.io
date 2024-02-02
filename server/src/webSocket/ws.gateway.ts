import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer,
    ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io'
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";

@WebSocketGateway({ cors: true })
export class WsGateway implements OnGatewayConnection, OnGatewayDisconnect{
    
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
        this.server.to(data.room).emit(`${data.username} joined the room`) 
    }
    
    @SubscribeMessage('message')
    sendMessage(@MessageBody() room: string, data: string): void{
        this.server.to(room).emit(data)
    }

    @SubscribeMessage('leaveRoom')
    leaveRoom(@MessageBody() username: string, @ConnectedSocket() socket: Socket): void {
        socket.rooms.forEach(room => {
            if(socket.id !== room){
                socket.leave(room)
                this.server.to(room).emit(`${username} has left the room`)
            }
        })
    }
}   
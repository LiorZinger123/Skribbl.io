import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer,
    ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io'

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
        this.server.to(data.room).emit('message', `${data.username} joined the room`) 
    }
    
    @SubscribeMessage('message')
    sendMessage(@MessageBody() data: { room: string, msg: string }): void{
        this.server.to(data.room).emit('message', data.msg)
    }

    @SubscribeMessage('leaveRoom')
    leaveRoom(@MessageBody() username: string, @ConnectedSocket() socket: Socket): void {
        socket.rooms.forEach(room => {
            if(socket.id !== room){
                this.server.to(room).emit('message', `${username} has left the room`)
            }
        })
        socket.disconnect(true)
    }
}   
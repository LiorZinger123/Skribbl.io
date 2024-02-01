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
        // this.server.to(socket.id).emit('rooms', this.rooms.slice(-100))
    }

    handleDisconnect(socket: Socket) {
        console.log(`${socket.id} disconnected`)
    }

    // generateNewId(): string {
    //     let roomID = ''
    //     do{
    //         roomID = Math.floor(Math.random() * (999999 + 100000) + 100000).toString()
    //     }while(this.findRoomById(roomID))
    //     return roomID
    // }
    
    // @UseGuards(AuthGuard)
    // @SubscribeMessage('create')
    // createRoom(@ConnectedSocket() socket: Socket): void {
    //     const newRoom = this.generateNewId()
    //     socket.join(newRoom)
    //     this.rooms.push({ id: newRoom, currentDrawing: [] })
    //     this.server.to(socket.id).emit('creatRoom', newRoom)
    // }

    // @UseGuards(JwtAuthGuard)
    // @SubscribeMessage('join')
    // joinRoom(@MessageBody() data: {room: string, username: string}, @ConnectedSocket() socket: Socket): void {
    //     if(this.findRoomById(data.room)){
    //         socket.join(data.room)
    //         this.server.to(data.room).emit(`${data.username} joined the room`)
    //         this.server.to(socket.id).emit('join', 'Success')   
    //     }
    //     else
    //         this.server.to(socket.id).emit('join', 'Failed')   
    // }

    // @UseGuards(AuthGuard)
    // @SubscribeMessage('getDrawing')
    // getCurrentDrawing(@MessageBody() room: string, @ConnectedSocket() socket: Socket): void {
    //     const drawing = this.rooms.find(roomObj => roomObj.id === room).currentDrawing
    //     this.server.to(socket.id).emit('currentDrawing', drawing)
    // }
    
    // @UseGuards(AuthGuard)
    // @SubscribeMessage('message')
    // sendMessage(@MessageBody() room: string, data: string): void{
    //     this.server.to(room).emit(data)
    // }

    // @SubscribeMessage('leaveRoom')
    // leaveRoom(@MessageBody() username: string, @ConnectedSocket() socket: Socket): void {
    //     socket.rooms.forEach(room => {
    //         if(socket.id !== room){
    //             socket.leave(room)
    //             this.server.to(room).emit(`${username} has left the room`)
    //         }
    //     })
    // }
}   
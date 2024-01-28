import { OnModuleInit } from "@nestjs/common";
import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket, WsException } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io'
import Rooms from "./rooms";

@WebSocketGateway({ cors: true })
export class WsGateway implements OnModuleInit{
    private rooms: Rooms[] = []
    
    @WebSocketServer()
    server: Server

    onModuleInit() {
        this.server.on('connection', (socket: Socket) => {
            console.log(`${socket.id} Connected`)
        })
        this.server.on('disconnect', (socket: Socket) => {
            socket.disconnect()
            console.log(`${socket.id} disconnected`)
        } )
    }

    generateNewId(): string {
        let roomID = ''
        do{
            roomID = Math.floor(Math.random() * (999999 + 100000) + 100000).toString()
        }while(this.findRoomById(roomID))
        this.rooms.push({ roomID: roomID, currentDrawing: [] })
        return roomID
    }

    findRoomById(room: string): boolean{
        const existingRoom = this.rooms.find(roomObj => roomObj.roomID === room)
        if(existingRoom)
            return true
        return false
    }
    
    @SubscribeMessage('create')
    createRoom(@ConnectedSocket() socket: Socket): void {
        const newRoom = this.generateNewId()
        socket.join(newRoom)
        this.server.to(socket.id).emit('creatRoom', newRoom)
    }

    @SubscribeMessage('join')
    joinRoom(@MessageBody() room: string, username: string, @ConnectedSocket() socket: Socket): void {
        if(room in this.rooms){
            socket.join(room)
            this.server.to(room).emit(`${username} joined the room`)
            this.server.to(socket.id).emit('joinRoom', 'Success')   
        }
        else
            this.server.to(socket.id).emit('joinRoom', 'Failed')   
    }

    @SubscribeMessage('getDrawing')
    getCurrentDrawing(@MessageBody() room: string, @ConnectedSocket() socket: Socket): void {
        const drawing = this.rooms.find(roomObj => roomObj.roomID === room).currentDrawing
        this.server.to(socket.id).emit('currentDrawing', drawing)
    }
    
    @SubscribeMessage('message')
    handleEvent(@MessageBody() room: string, data: string): void{
        this.server.to(room).emit(data)
    }
}
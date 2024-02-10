import { Injectable } from "@nestjs/common";
import Room, { ConnectedPlayersType } from "./types/room";
import RoomToList from "./types/roomToList";
import { JoinRoomDto } from "./dtos/joinRoom.dto";
import { NewRoomDto } from "./dtos/newRoom.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Word, WordDocument } from "src/schemas/words.schema";
import { Model } from "mongoose";

@Injectable()
export class RoomsService{

  constructor(
    @InjectModel(Word.name)
    private readonly wordsModule: Model<WordDocument>
  ){}

  private rooms: Room[] = [{ id: '111111', name: 'Lior', password: 'aaaa', players: 5, time: 60, rounds: 2, connectedPlayers: [], currentDrawing: '' }]

  getRooms(): RoomToList[] {
    const lastRooms = this.rooms.slice(-10)
    return lastRooms.map(room => (
      {
        id: room.id,
        name: room.name,
        hasPassword: room.password !== '' ? true : false,
        connectedPlayers: room.connectedPlayers,
        maxPlayers: room.players 
      }
    ))
  }
  
  joinRoom(data: JoinRoomDto): string {
    const existingRoom = this.rooms.find(room => room.id === data.room)
    if(data.password.length === 0 || data.password === existingRoom.password){
      this.rooms = this.rooms.map(room => {
        if(room.id === data.room){
          const newPlayer = {id: room.connectedPlayers.length + 1, username: data.username, score: 0, roomOwner: false} 
          return {...room, connectedPlayers: [...room.connectedPlayers, newPlayer ]}
        }
        return room
      })
      return data.room
    }
    return null
  }
  
  getPlayers(id: string): ConnectedPlayersType[] {
    return this.rooms.find(room => room.id === id).connectedPlayers
  }

  createRoom(data: NewRoomDto): string {
    const newId = this.generateNewId()
    const newPlayer = {id: 1, username: data.username, score: 0, roomOwner: true}
    this.rooms.push({...data, id: newId, connectedPlayers: [newPlayer], currentDrawing: ''})
    return newId
  }

  generateNewId(): string {
    let roomID = ''
    do{
      roomID = Math.floor(Math.random() * (999999 + 100000) + 100000).toString()
    }while(this.findRoomById(roomID))
    return roomID
  }

  findRoomById(id: string): Boolean{
    const room = this.rooms.find(room => room.id === id)
    if(room)
      return true
    return false
  }

  updateDrawing(id: string, drawing: string): void{
    this.rooms = this.rooms.map(room => {
      if(room.id === id)
        return {...room, drawing: drawing}
      return room
    })
  }

  async getWords(): Promise<Word[] | void>{
    try{
      return await this.wordsModule.aggregate([{$project: {_id: 0, id: 0}}, {$sample: {size: 3}}])
    }
    catch(e){
      return e
    }
  }

  leaveRoom(id: string, username: string): void{
    this.rooms = this.rooms.map(room => {
      if(room.id === id){
        const newConnctedPlayers = room.connectedPlayers.filter(player => player.username != username)
        return {...room, connectedPlayers: newConnctedPlayers}
      }
      return room
    })
  }
}
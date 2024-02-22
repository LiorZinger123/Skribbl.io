import { Injectable } from "@nestjs/common";
import Room, { ConnectedPlayersType, playerTurnScore } from "./types/room";
import RoomToList from "./types/roomToList";
import { JoinRoomDto } from "./dtos/joinRoom.dto";
import { NewRoomDto } from "./dtos/newRoom.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Word, WordDocument } from "src/schemas/words.schema";
import { Model } from "mongoose";
import { RoomDetails } from "./types/RoomDetails";

@Injectable()
export class RoomsService{

  constructor(
    @InjectModel(Word.name)
    private readonly wordsModule: Model<WordDocument>
  ){}

  private rooms: Room[] = [{ id: '111111', name: 'Lior', password: 'aaaa', players: 5, time: 60, rounds: 2, startPlaying: false, connectedPlayers: [], currentPlayerPos: 0,turnScores: [], currentDrawing: '' }]

  getRooms(): RoomToList[] {
    const rooms = this.rooms.slice(-10)
    return rooms.map(room => (
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

  createRoom(data: NewRoomDto): string {
    const newId = this.generateNewId()
    const { username, ...roomData } = data
    const newPlayer = {id: 1, username: username, score: 0, roomOwner: true}
    this.rooms.push({...roomData, id: newId, startPlaying: false, connectedPlayers: [newPlayer], currentPlayerPos: 0, turnScores: [], currentDrawing: ''})
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

  getPlayers(id: string): ConnectedPlayersType[] {
    const room = this.rooms.find(room => room.id === id)
    return room != undefined ? room.connectedPlayers : []
  }

  getRoomDetails(id: string): RoomDetails{
    const room = this.rooms.find(room => room.id === id)
    if(room != undefined)
      return {time: room.time, rounds: room.rounds}
    return {time: 0, rounds: 0}
  }

  checkIfGameStarted(id: string): boolean{
    return this.rooms.find(room => room.id === id).startPlaying
  }
  
  startPlaying(id: string): void {
    this.rooms = this.rooms.map(room => {
      if(room.id === id)
        return {...room, startPlaying: true}
      return room
    })
  }

  getNewPainter(id: string): string{
    const room = this.rooms.find(room => room.id === id)
    return room.connectedPlayers[room.currentPlayerPos].username
  }
  
  updatePainter(id: string): string{
    this.rooms = this.rooms.map(room => {
      if(room.id === id){
        if(room.currentPlayerPos === room.connectedPlayers.length - 1)
          return {...room, currentPlayerPos: 0}
        return {...room, currentPlayerPos: room.currentPlayerPos + 1}
      }
      return room
    })
    const room = this.rooms.find(room => room.id === id)
    return room.connectedPlayers[room.currentPlayerPos].username
  }

  async getWords(): Promise<Word[] | void>{
    try{
      return await this.wordsModule.aggregate([{$project: {_id: 0, id: 0}}, {$sample: {size: 3}}])
    }
    catch(e){
      return e
    }
  }

  updateDrawing(id: string, drawing: string): void{
    this.rooms = this.rooms.map(room => {
      if(room.id === id)
        return {...room, drawing: drawing}
      return room
    })
  }

  addNewTurnScore(roomID: string, username: string, currentPainter: string): void{
    this.rooms = this.rooms.map(room => {
      if(room.id === roomID){
        let newScores = [{username: username, score: (room.connectedPlayers.length - room.turnScores.length) * 50}]
        if(room.turnScores.length === 0)
          newScores.push({ username: currentPainter, score: 75 })
        return {...room, turnScores: [...room.turnScores, ...newScores]}
      }
      return room
    })
  }

  checkIfAllPlayersGuested(roomID: string): boolean{
    const room = this.rooms.find(room => room.id === roomID)
    if(room.connectedPlayers.length === room.turnScores.length)
      return true
    return false
  }

  getTurnScores(roomID: string): playerTurnScore[]{
    const room = this.rooms.find(room => room.id === roomID)
    room.turnScores.sort((a, b) => b.score - a.score)
    const playersNames = room.connectedPlayers.map(player => player.username)
    const playersNamesWithScore = room.turnScores.map(player => player.username)
    playersNames.forEach(name => {
      if(!playersNamesWithScore.includes(name))
        room.turnScores.push({username: name, score: 0})
    })
    const currentTurnScores = room.turnScores
    room.turnScores = []
    return currentTurnScores
  }

  setTurnScoreToZero(id: string): void{
    const room = this.rooms.find(room => room.id === id)
    const playersNames = room.connectedPlayers.map(player => player.username)
    const newTurnScores = playersNames.map(name => ({username: name, score: 0}))
    this.rooms = this.rooms.map(room => {
      if(room.id === id)
        return {...room, turnScores: newTurnScores}
      return room
    })
  }

  leaveRoom(id: string, username: string): ConnectedPlayersType[] | null{ //remove player or close room if one left
    const room = this.rooms.find(room => room.id === id)
    if(!room) return null
    else if(room.connectedPlayers.length === 1 || (room.startPlaying && room.connectedPlayers.length === 2)){
      this.rooms = this.rooms.filter(room => room.id !== id)
      return null
    }
    else{
      let updatedPlayers: ConnectedPlayersType[] = []
      this.rooms = this.rooms.map(room => {
        if(room.id === id){
          const leavingPlayer = room.connectedPlayers.find(player => player.username === username)
          const newConnctedPlayers = room.connectedPlayers.filter(player => player !== leavingPlayer)
          if(leavingPlayer.roomOwner)
            newConnctedPlayers[0].roomOwner = true
          updatedPlayers = newConnctedPlayers
          return {...room, connectedPlayers: newConnctedPlayers}
        }
        return room
      })
      return updatedPlayers
    }
  }
}
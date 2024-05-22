import { Injectable } from "@nestjs/common";
import Room, { ConnectedPlayersType, playerTurnScore } from "./types/room";
import { RoomToList } from "./types/roomToList";
import { JoinRoomDto } from "./dtos/joinRoom.dto";
import { NewRoomDto } from "./dtos/newRoom.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Word, WordDocument } from "src/schemas/words.schema";
import { Model } from "mongoose";
import { RoomDetails } from "./types/roomDetails";
import { MoreRooms } from "./types/moreRooms";
import { JoinWhileDrawing } from "./types/joinWhileDrawing";
import { RoomMsgStatus } from "src/webSocket/types/types";
import { EndScreenStatus } from "./types/endScreenStatus";

@Injectable()
export class RoomsService{

  constructor(
    @InjectModel(Word.name)
    private readonly wordsModule: Model<WordDocument>
  ){}

  private rooms: Room[] = []

  getRooms(): RoomToList[] {
    const rooms = this.rooms.slice(-10).reverse()
    return this.sendRoomsDetails(rooms)
  }

  getMoreRooms(roomsLength: number): MoreRooms {
    const rooms = this.rooms.slice( -roomsLength - 10, -roomsLength).reverse()
    const detailedRooms = this.sendRoomsDetails(rooms)
    return { rooms: detailedRooms, count: detailedRooms.length }
  }

  sendRoomsDetails(rooms: Room[]): RoomToList[] {
    return rooms.map(room => (
      {
        id: room.id,
        name: room.name,
        hasPassword: room.password !== '' && room.password !== undefined ? true : false,
        connectedPlayers: room.connectedPlayers,
        maxPlayers: room.players 
      }
    ))
  }

  searchRooms(search: string): RoomToList[] {
    const rooms = this.rooms.map(room => {
      if(room.name.includes(search) || room.id.includes(search))
        return room
    })
    if(rooms[0] !== undefined)
      return this.sendRoomsDetails(rooms)
    return []
  }
  
  joinRoom(data: JoinRoomDto): string {
    const existingRoom = this.rooms.find(room => room.id === data.room)
    if(existingRoom === undefined)
      return undefined
    if(data.password.length === 0 || data.password === existingRoom.password){
        const newPlayer = {id: existingRoom.connectedPlayers.length + 1, username: data.username, score: 0, roomOwner: false} 
        existingRoom.connectedPlayers.push(newPlayer)
      return data.room
    }
    return null
  }

  joinWhileDrawing(id: string): JoinWhileDrawing{
    const room = this.rooms.find(room => room.id === id)
    const turnData = { time: room.currentTime, round: room.currentRound, word: room.currentWord }
    return { turnData: turnData, currentDrawing: room.currentDrawing }
  }

  createRoom(data: NewRoomDto): string {
    const newId = this.generateNewId()
    const { username, ...roomData } = data
    const newPlayer = {id: 1, username: username, score: 0, roomOwner: true}
    this.rooms.push({...roomData, id: newId, startPlaying: false, connectedPlayers: [newPlayer],
      currentTime: data.seconds, currentPlayerPos: 0, currentRound: 0, turnScores: [], currentDrawing: '',
      currentWord: { word: '', length: '' }, currentPainter: '', screenStatus: '', currentMsg: ''})
    return newId
  }

  generateNewId(): string {
    let roomID = ''
    do{
      roomID = Math.floor(Math.random() * (999999 - 100000) + 100000).toString()
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
      return {time: room.seconds, rounds: room.rounds, currentRound: room.currentRound}
    return {time: 0, rounds: 0, currentRound: 0}
  } 
  
  startPlaying(id: string): void {
    const room = this.rooms.find(room => room.id === id)
    room.startPlaying = true
    room.currentPainter = room.connectedPlayers[0].username
  }

  checkIfGameStarted(id: string): boolean {
    const room = this.rooms.find(room => room.id === id)
    return room.startPlaying
  }

  screenmsgsSetTime(id: string): void {
    const room = this.rooms.find(room => room.id === id)
    room.currentTime = 15
  }

  newScreenMsg(id: string, msg: string, status: string): void {
    const room = this.rooms.find(room => room.id === id)
    room.screenStatus = status
    room.currentMsg = msg
  }

  startTurn(id: string): void {
    const room = this.rooms.find(room => room.id === id)
    room.screenStatus = 'turn'
  }

  roomDrawingStatus(id: string): string {
    const room = this.rooms.find(room => room.id === id)
    return room.screenStatus
  }

  roomMsgStatus(id: string): RoomMsgStatus {
    const room = this.rooms.find(room => room.id === id)
    return { msg: room.currentMsg, time: room.currentTime }
  }

  setEndStatus(id: string, endMsg: string): void{
    const room = this.rooms.find(room => room.id === id)
    room.screenStatus = 'end'
    room.currentMsg = endMsg
    room.currentTime = 16
  }

  getEndScreenStatus(id: string): EndScreenStatus {
    const room = this.rooms.find(room => room.id === id)
    const data = { winnerMsg: room.currentMsg, owner: room.connectedPlayers[0].username }
    return { data: data, time: room.currentTime }
  }

  setTurnTime(id: string): void {
    const room = this.rooms.find(room => room.id === id)
    room.currentTime = room.seconds
  }

  tick(id: string): number{
    const room = this.rooms.find(room => room.id === id)
    room.currentTime -= 1
    return room.currentTime
  }

  updateCurrentRound(id: string): void{
    const room = this.rooms.find(room => room.id === id)
    room.currentRound += 1
  }

  checkLeavingPlayerPos(username: string, id: string): boolean{
    const room = this.rooms.find(room => room.id === id)
    const leavingPlayerPos = room.connectedPlayers.findIndex(player => player.username === username)
    const painterPos = room.connectedPlayers.findIndex(player => player.username === room.currentPainter)
    if(leavingPlayerPos < painterPos)
      return true
    return false
  }

  updatePainter(id: string, ifIncreaseCurrentPos: boolean): string | null{
    let room = this.rooms.find(room => room.id === id)
    if(room.currentPlayerPos === room.connectedPlayers.length - 1 && room.currentRound === room.rounds)
      return null
    else{
        if(room.currentPlayerPos === room.connectedPlayers.length - 1)
          room.currentPlayerPos = 0  
        if(ifIncreaseCurrentPos)
          room.currentPlayerPos += 1  
    }
    room.currentPainter = room.connectedPlayers[room.currentPlayerPos].username
    return room.currentPainter
  }

  getOwner(id: string): string{
    const room = this.rooms.find(room => room.id === id)
    let owner = room.connectedPlayers.filter(player => player.roomOwner)
    return owner[0].username
  }

  async getWords(): Promise<Word[] | void>{
    try{
      return await this.wordsModule.aggregate([{$project: {_id: 0, id: 0}}, {$sample: {size: 3}}])
    }
    catch(e){
      return e
    }
  }

  updateCurrentWord(id: string, word: Word): void{
    const room = this.rooms.find(room => room.id === id)
    room.currentWord = word
  }

  updateDrawing(id: string, drawing: string): void{
    const room = this.rooms.find(room => room.id === id)
    room.currentDrawing = drawing
  }

  addNewTurnScore(id: string, username: string): void{
    const room = this.rooms.find(room => room.id === id)
    const newScore = {username: username, score: 50 * (room.connectedPlayers.length - room.turnScores.length) * (room.currentTime / 5 + (parseInt(room.currentWord.length) / 3))}
    room.turnScores.push(newScore)
  }

  checkIfAllPlayersGuested(id: string): boolean{
    const room = this.rooms.find(room => room.id === id)
    if(room.connectedPlayers.length - 1 === room.turnScores.length)
      return true
    return false
  }

  resetTurnClock(id: string): void{
    const room = this.rooms.find(room => room.id === id)
    room.currentTime = room.seconds
  }

  updateScoreAfterTurn(id: string): void{
    const room = this.rooms.find(room => room.id === id)
    if(room.turnScores.length > 0){
      room.turnScores.push({ username: room.currentPainter, score: 50 })
      const turnScoresNames = room.turnScores.map(player => player.username)
      const turnScoresValues = room.turnScores.map(player => player.score)
      const updatedConnectedPlayers = room.connectedPlayers.map(player => {
        if(turnScoresNames.includes(player.username)){
          const new_score = turnScoresValues[turnScoresNames.indexOf(player.username)]
          return {...player, score: player.score + new_score}
        }
        return player
      })
      room.connectedPlayers = updatedConnectedPlayers
    }
  }

  updatePlayersLocations(id: string): number[]{
    const room = this.rooms.find(room => room.id === id)
    let sortedPlayers = [...room.connectedPlayers].sort((a, b) => a.score - b.score) // sort players by score
    const sortedPlayersWithScoreZero = sortedPlayers.filter(player => player.score === 0) //check how much players has score 0
    sortedPlayers = sortedPlayers.length !== sortedPlayersWithScoreZero.length ? sortedPlayers.reverse() : sortedPlayers // reverse if all players has score 0
    const locations = (room.connectedPlayers.map(player => { // updated locations of players
      return sortedPlayers.findIndex(p => player.id === p.id) + 1
    }))
    return locations
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

  setTurnScoresToZero(id: string): void{
    const room = this.rooms.find(room => room.id === id)
    const playersNames = room.connectedPlayers.map(player => player.username)
    const newTurnScores = playersNames.map(name => ({username: name, score: 0}))
    room.turnScores = newTurnScores
  }

  leaveRoom(id: string, username: string): ConnectedPlayersType[] | null{ //remove player or close room if one left
    const room = this.rooms.find(room => room.id === id)
    if(!room) return null
    else if(room.connectedPlayers.length === 1 || (room.startPlaying && room.connectedPlayers.length === 2)){
      this.rooms = this.rooms.filter(room => room.id !== id)
      return null
    }
    else{
      const leavingPlayer = room.connectedPlayers.find(player => player.username === username)
      const newConnctedPlayers = room.connectedPlayers.filter(player => player !== leavingPlayer)

      if(leavingPlayer.roomOwner)
        newConnctedPlayers[0].roomOwner = true
      if((leavingPlayer.id === room.connectedPlayers.length && room.currentPainter === username) || this.checkLeavingPlayerPos(username, id))
        room.currentPlayerPos -= 1

      room.connectedPlayers = newConnctedPlayers
      return newConnctedPlayers
    }
  }

  checkIfOwnerLeftBeforeStarting(id: string, username: string): boolean {
    const room = this.rooms.find(room => room.id === id)
    if(!room.startPlaying){
      if(room.connectedPlayers[0].username === username)
        return true
    }
    return false
  }

  checkIfOwnerLeftAfterStarting(id: string, username: string): boolean {
    const room = this.rooms.find(room => room.id === id)
    if(room.startPlaying){
      if(room.connectedPlayers[0].username === username)
        return true
    }
    return false
  }

  checkIfOwnerLeftInEndScreen(id: string, username: string): boolean{
    const room = this.rooms.find(room => room.id === id)
    if(room.screenStatus === 'end' && room.connectedPlayers[0].username === username)
      return true
    return false
  }

  getWinner(id: string): string[] | null{
    const room = this.rooms.find(room => room.id === id)
    if(room){
      const sortedPlayers = [...room.connectedPlayers].sort((a, b) => b.score - a.score)
      let maxScore = sortedPlayers[0].score
      const winners = room.connectedPlayers.filter(player => player.score === maxScore)
      const winnersNames = winners.map(player => player.username)
      return winnersNames
    }
    return null
  }

  closeRoom(id: string): void{
    this.rooms = this.rooms.filter(room => room.id != id)
  }

  restartGame(id: string): void{
    const room = this.rooms.find(room => room.id === id)
    const updatedConnectedPlayers = room.connectedPlayers.map(player => {
      return {...player, score: 0}
    })
    room.connectedPlayers = updatedConnectedPlayers
    room.currentRound = 0
    room.currentPlayerPos = 0
    room.currentDrawing = ''
    room.currentWord = { word: '', length: '' },
    room.currentPainter = room.connectedPlayers[0].username
    room.screenStatus = ''
    room.currentMsg = ''
  }
}
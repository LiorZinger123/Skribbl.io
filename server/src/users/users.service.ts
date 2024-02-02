import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/users.schema';
import { UserDto } from './dtos/user.dto';
import { encode } from './utils/hash';
import { CreateUserDto } from './dtos/createUser.dto';
import Room from "./types/room";
import { JoinRoomDto } from './dtos/joinRoom.dto';
import RoomToList from './types/roomToList';
import { NewRoom } from './dtos/newRoom.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly usersModel: Model<UserDocument>
  ) {}

    private rooms: Room[] = [{ id: '111111', name: 'Lior', password: 'aaaa', players: 5, time: 60, rounds: 2, connectedPlayers: 0, currentDrawing: [] }]

    async findOne(username: string): Promise<UserDto> {
      try{
        const user = await this.usersModel.find({ username: username }).exec()
        if(user.length === 1)
          return user[0]
        return null
      }
      catch(e){
        // throw e
      }
    }

    async createUser(user: CreateUserDto): Promise<CreateUserDto | string> {
      try{
        const existsUser = await this.usersModel.find({ username: user.username }).exec()
        const existsEmail = await this.usersModel.find({ email: user.email }).exec()
        if(existsUser.length > 0){
          return 'Username already exists'
        }
        if(existsEmail.length > 0)
          return 'Email already exists'
        const newUser = new this.usersModel({...user, password: encode(user.password)})
        await newUser.save()
        return newUser
      }
      catch(e){
        // throw e
      }
    }

    getRooms(): RoomToList[] {
      const lastRooms = this.rooms.slice(-10)
      return lastRooms.map(room => (
        {
          id: room.id,
          name: room.name,
          hasPassword: room.password !== '' ? true : false 
        }
      ))
    }

    joinRoom(data: JoinRoomDto): boolean {
      const existingRoom = this.rooms.find(roomObj => roomObj.id === data.room)
      if(existingRoom){
        if(data.password.length === 0)
          return true
        else{
          if(data.password === existingRoom.password)
            return true
        }
      }
      return false
    }

    createRoom(data: NewRoom): string {
      const newId = this.generateNewId()
      this.rooms.push({...data, id: newId, connectedPlayers: 0, currentDrawing: []})
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
}
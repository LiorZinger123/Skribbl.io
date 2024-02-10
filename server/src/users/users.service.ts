import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/users.schema';
import { UserDto } from './dtos/user.dto';
import { encode } from './utils/hash';
import { CreateUserDto } from './dtos/createUser.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly usersModel: Model<UserDocument>
  ) {}

    async findOne(username: string): Promise<UserDto> {
      try{
        const user = await this.usersModel.find({ username: username }).exec()
        if(user.length === 1)
          return user[0]
        return null
      }
      catch(e){
        return null
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
      catch{
        return 'Something went wrong, please try again later.'
      }
    }
}
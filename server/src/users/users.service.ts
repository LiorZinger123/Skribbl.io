import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/users.schema';
import { UserDto } from './dtos/user.dto';
import { encode } from './utils/hash';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly usersModel: Model<UserDocument>
  ) {}

    async findOne(username: string): Promise<UserDto> {
      try{
        const user = await this.usersModel.find({ username: username }) 
        if(user.length === 1)
          return user[0]
        return null
      }
      catch(e){
        throw e
      }
    }

    async create(user: UserDto): Promise<UserDto | number> {
      try{
        const existsUser = await this.usersModel.find({ username: user.username })
        if(existsUser.length > 0)
          return HttpStatus.FORBIDDEN
        const newUser = new this.usersModel({...user, password: encode(user.password)})
        await newUser.save()
        return newUser
      }
      catch(e){
        throw e
      }
    }
}

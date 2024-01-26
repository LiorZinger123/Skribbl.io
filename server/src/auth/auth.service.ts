import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from 'src/users/dtos/user.dto';
import { compare } from 'src/users/utils/hash';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(user: UserDto): Promise<UserDto>{
    const userDB = await this.usersService.findOne(user.username)
    if(userDB){
      const matched = compare(user.password, userDB?.password) 
      if(!matched)
        return null
      return userDB
    }
    return null
  }

  login(user: UserDto){
    const payload = { username: user.username }
    return{
      accessToken: this.jwtService.sign(payload)
    }   
  }
}
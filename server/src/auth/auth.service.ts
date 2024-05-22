import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'src/users/utils/hash';
import { ValidateType, LoginType, CreateUserType, AccessTokenType } from './types/authTypes';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(user: ValidateType): Promise<boolean>{
    const userDB = await this.usersService.findOne(user.username)
    if(userDB){
      const matched = compare(user.password, userDB?.password) 
      if(!matched)
        return false
      return true
    }
    return false
  }

  login(data: LoginType | CreateUserType): AccessTokenType{
    let payload = { username: data.username, rememberMe: false }
    if("rememberMe" in data)
      payload.rememberMe = data.rememberMe
    return{
      accessToken: this.jwtService.sign(payload)
    }   
  }

  reset(username: string): AccessTokenType{
    const payload = { username: username }
    return{
      accessToken: this.jwtService.sign(payload)
    }
  }
}
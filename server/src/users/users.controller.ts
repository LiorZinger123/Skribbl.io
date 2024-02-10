import { Controller, Post, Body, Res, UsePipes, ValidationPipe, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { Response } from 'express';
import { CreateUserDto } from './dtos/createUser.dto';
import { AuthService } from 'src/auth/auth.service';
import { ConfigService } from '@nestjs/config';

@Controller('users')
export class UsersController {
  constructor(
      private readonly usersService: UsersService,
      private readonly authService: AuthService,
      private readonly configService: ConfigService
    ) {}
  
  @UsePipes(ValidationPipe)  
  @Post('add')
  async addUser(@Res() res: Response, @Body() user: CreateUserDto): Promise<void>{
    try{
      const result = await this.usersService.createUser(user)
      if(typeof result !== "string"){
        const token = this.authService.login(result)
        const maxAge = this.configService.get<number>('cookieExpirationTime')
        res.cookie('Login', token, { httpOnly: true, maxAge: maxAge })
        res.status(HttpStatus.CREATED).send(result.username)
      }
      else
        res.status(HttpStatus.FORBIDDEN).send(result)
    }
    catch(msg){
      res.status(500).send(msg)
    }
  }
}
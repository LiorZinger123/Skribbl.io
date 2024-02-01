import { Controller, Get, Post, Body, Res, UsePipes, ValidationPipe, HttpStatus, UseGuards, HttpException } from '@nestjs/common';
import { UsersService } from './users.service';
import { Response } from 'express';
import { CreateUserDto } from './dtos/createUser.dto';
import { AuthService } from 'src/auth/auth.service';
import { ConfigService } from '@nestjs/config';
import { JoinRoomDto } from './dtos/joinRoom.dto';
import Room from './types/room';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { NewRoom } from './dtos/newRoom.dto';

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
        res.sendStatus(HttpStatus.CREATED)
      }
      else
        res.status(HttpStatus.FORBIDDEN).send(result)
    }
    catch(e){
      throw e
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('rooms')
  getRooms(@Res() res: Response): void {
    res.send(this.usersService.getRooms())
  }

  @UseGuards(JwtAuthGuard)
  @Post('join')
  joinRoom(@Res() res: Response, @Body() data: JoinRoomDto): void {
    const result = this.usersService.joinRoom(data)
    if(result)
      res.sendStatus(HttpStatus.OK)
    else
      res.sendStatus(HttpStatus.UNAUTHORIZED)
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)  
  @Post('createroom')
  createRoom(@Res() res: Response, @Body() data: NewRoom): void {
    res.send(this.usersService.createRoom(data))
  }
}
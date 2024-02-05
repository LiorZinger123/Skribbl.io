import { Controller, Get, Post, Body, Res, UsePipes, ValidationPipe, HttpStatus, UseGuards, HttpException } from '@nestjs/common';
import { UsersService } from './users.service';
import { Response } from 'express';
import { CreateUserDto } from './dtos/createUser.dto';
import { AuthService } from 'src/auth/auth.service';
import { ConfigService } from '@nestjs/config';
import { JoinRoomDto } from './dtos/joinRoom.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { NewRoom } from './dtos/newRoom.dto';
import { LeaveRoomDto } from './dtos/leaveRoom.dto';

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

  @UseGuards(JwtAuthGuard)
  @Get('rooms')
  getRooms(@Res() res: Response): void {
    res.send(this.usersService.getRooms())
  }

  @UseGuards(JwtAuthGuard)
  @Post('join')
  joinRoom(@Res() res: Response, @Body() data: JoinRoomDto): void {
    const id = this.usersService.joinRoom(data)
    if(id)
      res.status(HttpStatus.OK).send(id)
    else
      res.sendStatus(HttpStatus.UNAUTHORIZED)
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)  
  @Post('createroom')
  createRoom(@Res() res: Response, @Body() data: NewRoom): void {
    res.send(this.usersService.createRoom(data))
  }

  @Post('leaveroom')
  leaveRoom(@Res() res: Response, @Body() data: LeaveRoomDto): void {
    this.usersService.leaveRoom(data.id)
    res.sendStatus(200)
  }
}
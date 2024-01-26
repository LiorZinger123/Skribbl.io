import { Controller, Get, Post, Body, Res, UsePipes, ValidationPipe, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { Response } from 'express';
import { UserDto } from './dtos/user.dto';
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
  async addUser(@Res() res: Response, @Body() user: UserDto): Promise<void>{
    try{
      const result = await this.usersService.create(user)
      if(typeof result !== "number"){
        const token = this.authService.login(result)
        const maxAge = this.configService.get<number>('cookieExpirationTime')
        res.cookie('Login', token, { httpOnly: true, maxAge: maxAge })
        res.sendStatus(HttpStatus.CREATED)
      }
      else
        res.sendStatus(result)
    }
    catch(e){
      throw e
    }
  }
}

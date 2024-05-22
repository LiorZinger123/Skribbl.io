import { Controller, Post, Body, Req, Res, UsePipes, ValidationPipe, HttpStatus, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { Response } from 'express';
import { CreateUserDto } from './dtos/createUser.dto';
import { AuthService } from 'src/auth/auth.service';
import { ConfigService } from '@nestjs/config';
import { VerifyCodeDto } from './dtos/verifyCode.dto';
import { ResetPassJwtAuthGuard } from 'src/auth/guards/resetPassJwt-auth.guard';
import { ResetPassDto } from './dtos/resetPass.dto';

@Controller('users')
export class UsersController {
  constructor(
      private readonly usersService: UsersService,
      private readonly authService: AuthService,
      private readonly configService: ConfigService,
    ) {}
  
  @UsePipes(ValidationPipe)  
  @Post('add')
  async addUser(@Res() res: Response, @Body() user: CreateUserDto): Promise<void>{
    try{
      if(user.password !== user.submitPassword)
        res.sendStatus(HttpStatus.BAD_REQUEST)
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
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(msg)
    }
  }

  @Post('validate')
  async validateUser(@Res() res: Response, @Body() data: {username: string}): Promise<void>{
    try{
      const result = await this.usersService.findOne(data.username)
      if(result){
        const createCode = await this.usersService.createVerificationCode(result.username, result.email)
        if(createCode){
          const token = this.authService.reset(result.username)
          const maxAge = this.configService.get<number>('codeValidationCookieExpirationTime')
          res.cookie('CodeValidation', token, {httpOnly: true, maxAge: maxAge})
          res.status(HttpStatus.OK).send(result.username)
        }
        else
          res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR)
      }
      else
        res.sendStatus(HttpStatus.UNAUTHORIZED)
    }
    catch{
      res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @UseGuards(ResetPassJwtAuthGuard)
  @UsePipes(ValidationPipe)  
  @Post('verify')
  verifyCode(@Res() res: Response, @Body() data: VerifyCodeDto): void{
    const result = this.usersService.verifyCode(data.username, data.code)
    if(result){
      const token = this.authService.reset(data.username)
      const maxAge = this.configService.get<number>('resetPasswordCookieExpirationTime')
      res.cookie('ResetPassword', token, {httpOnly: true, maxAge: maxAge})
      res.clearCookie('CodeValidation')
      res.sendStatus(HttpStatus.OK)
    }
    else
      res.status(HttpStatus.UNAUTHORIZED).send('wrong')
  }

  @UseGuards(ResetPassJwtAuthGuard)
  @UsePipes(ValidationPipe)  
  @Post('reset_pass')
  async resetPass(@Req() req: any, @Res() res: Response, @Body() data: ResetPassDto): Promise<void>{
    try{
      if(data.password !== data.submitPassword)
        res.sendStatus(HttpStatus.BAD_REQUEST)
      else{  
        const status = await this.usersService.resetPassword(req.user.username, data.password)
        res.sendStatus(status)
      }
    }
    catch{
      res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    }
  } 
}
import {
    Req,
    Res,
    Controller,
    Post,
    UseGuards,
    HttpCode,
    HttpStatus,
  } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local-auth.guard';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
  
@Controller('auth')
export class AuthController {
    
    constructor(
        private authService: AuthService, 
        private configService: ConfigService
    ){}

    @HttpCode(HttpStatus.OK)
    @UseGuards(LocalGuard)
    @Post('login')
    login(@Req() req, @Res({ passthrough: true }) res: Response): void{
        const token = this.authService.login(req.user)
        const maxAge = this.configService.get<number>('cookieExpirationTime')
        res.cookie('Login', token, { httpOnly: true, maxAge: maxAge })
        res.status(HttpStatus.OK).send(req.user.username)
    }
}
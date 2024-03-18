import {
    Req,
    Res,
    Controller,
    Post,
    UseGuards,
    HttpCode,
    HttpStatus,
    Get,
  } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local-auth.guard';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
  
@Controller('auth')
export class AuthController {
    
    constructor(
        private authService: AuthService, 
        private configService: ConfigService
    ){}

    @UseGuards(JwtAuthGuard)
    @Get("remember_me")
    autoLogin(@Req() req: any, @Res() res: Response): void{
        if(req.user.rememberMe){
            const token = this.authService.login({username: req.user.username, rememberMe: req.user.rememberMe})
            const maxAge = this.configService.get<number>('cookieExpirationTime')
            res.cookie('Login', token, { httpOnly: false, maxAge: maxAge })
            res.status(HttpStatus.OK).send(req.user.username)
        }
        else
            res.sendStatus(HttpStatus.UNAUTHORIZED)
    }

    @HttpCode(HttpStatus.OK)
    @UseGuards(LocalGuard)
    @Post('login')
    login(@Req() req: Request, @Res({ passthrough: true }) res: Response): void{
        const token = this.authService.login(req.body)
        const maxAge = this.configService.get<number>('cookieExpirationTime')
        res.cookie('Login', token, { httpOnly: false, maxAge: maxAge })
        res.status(HttpStatus.OK).send(req.body.username)
    }
}
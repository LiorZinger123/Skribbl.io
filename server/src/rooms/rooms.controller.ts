import { Controller, Get, Post, Body, Res, UsePipes, ValidationPipe, HttpStatus, UseGuards } from "@nestjs/common";
import { Response } from "express";
import { RoomsService } from "./rooms.service";
import { JoinRoomDto } from './dtos/joinRoom.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { NewRoomDto } from './dtos/newRoom.dto';

@Controller('rooms')
export class RoomsController{
    constructor(
        private readonly roomsService: RoomsService
    ){}

    @UseGuards(JwtAuthGuard)
    @Get('getrooms')
    getRooms(@Res() res: Response): void {
        res.send(this.roomsService.getRooms())
    }

    @UseGuards(JwtAuthGuard)
    @Post('join')
    joinRoom(@Res() res: Response, @Body() data: JoinRoomDto): void {
        const id = this.roomsService.joinRoom(data)
        if(id)
        res.status(HttpStatus.OK).send(id)
        else
        res.sendStatus(HttpStatus.UNAUTHORIZED)
    }

    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ transform: true }))  
    @Post('createroom')
    createRoom(@Res() res: Response, @Body() data: NewRoomDto): void {
        res.send(this.roomsService.createRoom(data))
    }

    @Get('words')
    async getWords(@Res() res: Response): Promise<void> {
        try{
            res.send(await this.roomsService.getWords())
        }
        catch(e){
            res.send(e)
        }
    }
}

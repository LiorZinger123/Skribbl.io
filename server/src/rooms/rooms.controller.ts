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
    @Post('get_more_rooms')
    getMoreRooms(@Res() res: Response, @Body() data: { roomsLength: number }): void{
        res.send(this.roomsService.getMoreRooms(data.roomsLength))
    }

    @UseGuards(JwtAuthGuard)
    @Post('search')
    search(@Res() res: Response, @Body() data:{ search: string }): void{
        res.send(this.roomsService.searchRooms(data.search))
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

    @Post('ifgamestarted')
    checkIfStarted(@Res() res: Response, @Body() data: {room: string}): void{
        res.send(this.roomsService.checkIfGameStarted(data.room))
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

    @Post('currentround')
    updateCurrentRound(@Res() res: Response, @Body() data: {room: string}): void{
        res.send(this.roomsService.updateCurrentRound(data.room))
    }
}

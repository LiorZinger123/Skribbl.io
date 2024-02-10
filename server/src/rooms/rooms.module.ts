import { Module } from "@nestjs/common";
import { RoomsController } from "./rooms.controller";
import { RoomsService } from "./rooms.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Word, WordSchema } from 'src/schemas/words.schema';

@Module({
    imports: [MongooseModule.forFeature([{name: Word.name, schema: WordSchema}])],
    controllers: [RoomsController],
    providers: [RoomsService],
    exports: [RoomsService]
})

export class RoomsModule{}
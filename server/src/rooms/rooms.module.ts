import { Module } from "@nestjs/common";
import { RoomsController } from "./rooms.controller";
import { RoomsService } from "./rooms.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Word, WordSchema } from 'src/schemas/words.schema';
import { ThrottlerGuard, ThrottlerModule, seconds } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";

@Module({
    imports: [
        MongooseModule.forFeature([{name: Word.name, schema: WordSchema}]),
        ThrottlerModule.forRoot([{
            ttl: seconds(10),
            limit: 8
        }])
    ],
    controllers: [RoomsController],
    providers: [
        RoomsService,
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard
        }
    ],
    exports: [RoomsService]
})

export class RoomsModule{}
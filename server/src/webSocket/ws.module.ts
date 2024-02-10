import { Module } from "@nestjs/common";
import { WsGateway } from "./ws.gateway";
import { RoomsModule } from "src/rooms/rooms.module";

@Module({
    imports: [RoomsModule],
    providers: [WsGateway]
})
export class WsModule{}
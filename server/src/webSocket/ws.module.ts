import { Module } from "@nestjs/common";
import { WsGateway } from "./ws.gateway";

@Module({
    imports: [WsGateway]
})
export class WsModule{}
import { Module } from "@nestjs/common";
import { WsGateway } from "./ws.gateway";
import { UsersModule } from "src/users/users.module";

@Module({
    imports: [UsersModule],
    providers: [WsGateway]
})
export class WsModule{}
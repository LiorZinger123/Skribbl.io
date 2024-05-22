import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import configuration from './config/configuration';
import { ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { WsModule } from './webSocket/ws.module';
import { RoomsModule } from './rooms/rooms.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration]
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('database'),
      })
    }),
    AuthModule,
    UsersModule,
    RoomsModule,
    WsModule,
    MailModule
  ]
})

export class AppModule {}
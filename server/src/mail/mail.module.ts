import { Module } from "@nestjs/common";
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { MailService } from "./mail.service";
import { AuthService } from "src/auth/auth.service";
import { UsersModule } from "src/users/users.module";
import { AuthModule } from "src/auth/auth.module";

@Module({
    imports: [
        AuthModule,
        UsersModule,
        MailerModule.forRootAsync({
            inject: [ConfigService],
            useFactory: async (ConfigService: ConfigService) => ({    
                transport: {
                    host: ConfigService.get<string>('mailHost'),
                    port: ConfigService.get<string>('mailPort'),
                    secure: true,
                    auth: {
                        type: 'OAuth2',
                        clientId: ConfigService.get<string>('clientId'),
                        clientSecret: ConfigService.get<string>('clientSecret'),
                        refreshToken: ConfigService.get<string>('refreshToken'),
                        accessToken: ConfigService.get<string>('accessToken'),
                        user: ConfigService.get<string>('mailUser'),
                        pass: ConfigService.get<string>('mailPass')
                    }
                }
            })
        })
    ],
    providers: [MailService, AuthService],
    exports: [MailService]
})

export class MailModule {}
import { Injectable } from "@nestjs/common";
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from "@nestjs/config";

@Injectable()
export class MailService{
    constructor(
        private readonly mailerService: MailerService,
        private readonly configService: ConfigService,

    ){}

    async sendVerificationCode(mail: string, verificationCode: string): Promise<boolean>{
        try{
            await this.mailerService.sendMail({
                to: mail,
                from: this.configService.get<string>('mailUser'),
                subject: 'Skribbl.io change password verification code',
                text: `Verification code: ${verificationCode}`
            })
            return true
        }
        catch{
            return false
        }
    }
}
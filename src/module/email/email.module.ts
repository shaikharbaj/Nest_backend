import { Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
@Module({
    imports: [
        MailerModule.forRoot({
            transport: {
                host: "smtp.gmail.com",
                port: Number(587),
                secure: false,
                auth: {
                    user: "arbaaj1147@gmail.com",
                    pass: "piwtsghxbeecmmne"
                }
            },
            // defaults: {
            //     from: '"From Name" <from@example.com>',
            // },
            // template: {
            //     dir: join(__dirname,"../../mail/templates"),
            //     adapter: new EjsAdapter(),
            //     options: {
            //         strict: true,
            //     },
            // },
        },
        )
    ],
    controllers: [EmailController],
    providers: [EmailService]
})
export class EmailModule { }

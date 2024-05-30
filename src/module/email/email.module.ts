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
                host: process.env.EMAIL_HOST,
                port: Number(587),
                secure: false,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_SECRET_PASS
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

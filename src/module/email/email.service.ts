import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { userSendResetLinkEvent } from './events/user.sendresetlink.event';
@Injectable()
export class EmailService {
    constructor(private readonly mailservice: MailerService) { }


    @OnEvent('user.successpasswordreset')
    async successpasswordreset(payload: userSendResetLinkEvent) {
        console.log('email send to user');
        await this.mailservice.sendMail({
            from: '<arbaaj1147@gmail.com>',
            to: `shaikharbaj2001@gmail.com`,
            subject: `Reset password otp`,
            html: `<p>Hello user reset password Link is <b>http://localhost:3000/reset-passwordlink/${payload.userid}/${payload.token}</b> and it is valid only for 10min</p>`,
        });
    }




}

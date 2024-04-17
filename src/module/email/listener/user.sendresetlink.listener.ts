import { MailerService } from "@nestjs-modules/mailer";
import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { userSendResetLinkEvent } from "../events/user.sendresetlink.event";

@Injectable()
export class usersendresetlinkListener {
    constructor(private readonly mailservice: MailerService) { }
    
}
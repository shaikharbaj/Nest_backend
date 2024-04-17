import { Controller, Get } from '@nestjs/common';
import { EmailService } from './email.service';
@Controller("email")
export class EmailController {
    constructor(private readonly emailService: EmailService) { }


    
    // @Get('/sendmail')
    // async sendMail() {
    //     await this.emailService.sendWelcomeEmail();
    //     return 'Email sent successfully';
    // }
}

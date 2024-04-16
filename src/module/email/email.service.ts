import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
    constructor(private readonly mailerService: MailerService) { }

    async sendWelcomeEmail(): Promise<void> {
        try {
            // Sending the welcome email using the EJS template
            await this.mailerService.sendMail({
                from: '<arbaaj1147@gmail.com>',
                to: 'shaikharbaj2001@gmail.com',
                subject: `How to Send Emails with Nodemailer`,
                text: "hello how are you.....",
            });
            return
        } catch (error) {
            console.error('Error sending welcome email:', error);
            throw error; // Rethrow the error for proper error handling
        }
    }
}

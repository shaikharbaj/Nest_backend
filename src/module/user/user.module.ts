import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CloudinaryService } from 'src/cloudinary.service';
import { EmailService } from '../email/email.service';
@Module({
  controllers: [UserController],
  providers: [UserService,CloudinaryService,EmailService]
})
export class UserModule {}

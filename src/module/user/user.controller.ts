import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
  Patch,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { createUserDto } from './dto/createuser.dto';
import { loginuserDto } from './dto/loginuser.dto';
import { JwtGuard } from './guards/jwt.guards';
import { RefreshJWTGuard } from './guards/refreshtoken.guards';
import { Request } from 'express';
import { Auth } from './dto/authdto';
import { CloudinaryService } from 'src/cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';
import multer from 'multer';
import path from 'path';
import { FileValidationPipe } from 'src/exceptions/filetypeandsize';
import { updateuserdto } from './dto/updateuserdto';
@Controller('user')
export class UserController {
  constructor(
    private readonly userservice: UserService,
  ) { }

  @Post('/create_user')
  @UseInterceptors(FileInterceptor('file'))
  async createuser(@Body() data: createUserDto,@UploadedFile(FileValidationPipe) file: Express.Multer.File) {
    return 'hiii'
    // return await this.userservice.createuser(data, file);
  }

  @Post('/login_user')
  async loginuser(@Body() data: loginuserDto) {
    return await this.userservice.loginuser(data);
  }
  @UseGuards(JwtGuard)
  @Get('loaduser')
  async getuserprofile(@Auth() auth: any) {
    return await this.userservice.getuserprofile(auth);
  }

  @UseGuards(JwtGuard)
  @Patch('updateprofile')
  @UseInterceptors(FileInterceptor('file'))
  async updateProfile(@Auth() auth: any, @Body() data: updateuserdto, @UploadedFile(FileValidationPipe) file: Express.Multer.File) {
    return await this.userservice.updateProfile(auth, data, file)
  }

  @UseGuards(RefreshJWTGuard)
  @Post('refresh')
  async refreshToken(@Req() req: Request) { }
}

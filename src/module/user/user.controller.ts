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
  Query,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { createUserDto } from './dto/createuser.dto';
import { loginuserDto } from './dto/loginuser.dto';
import { JwtGuard } from './guards/jwt.guards';
import { RefreshJWTGuard } from './guards/refreshtoken.guards';
import { Request, Response } from 'express';
import { Auth } from './dto/authdto';
import { CloudinaryService } from 'src/cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileValidationPipe } from 'src/exceptions/filetypeandsize';
import { updateuserdto } from './dto/updateuserdto';
import { resetpasswordDto } from './dto/resetpassword.dto';
import { updatePasswordwithLinkDTO } from './dto/updatepasswordwithlinkDTO';
import { updatePasswordwithOTPDTO } from './dto/updatePasswordwithOTP.dto';
import { Roles } from '../auth/decorator/roles.decorator';
import { Role } from 'src/constants/role';
import { RolesGuard } from '../auth/guards/roles.guard';

type verifyOTPType = {
  email: string;
  otp: number;
};
@Controller('user')
export class UserController {
  constructor(private readonly userservice: UserService) { }

  @Roles(Role.ADMIN,Role.SUBADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  @Get()
  async getallusers(@Query() payload: any) {
    const { page, searchTerm }: { page: number; searchTerm: string } = payload;
    return await this.userservice.getallusers(Number(page), searchTerm);
  }

  @Post('/create_user')
  @UseInterceptors(FileInterceptor('file'))
  async createuser(
    @Body() data: createUserDto,
    @UploadedFile(FileValidationPipe) file: Express.Multer.File,
  ) {
    return await this.userservice.createuser(data, file);
  }

  @Post('/login_user')
  async loginuser(@Body() data: loginuserDto) {
    return await this.userservice.loginuser(data);
  }
  @Post('/login_admin')
  async loginadmin(@Body() data: loginuserDto) {
    return await this.userservice.loginAdmin(data);
  }
  @UseGuards(JwtGuard)
  @Get('loaduser')
  async getuserprofile(@Auth() auth: any) {
    return await this.userservice.getuserprofile(auth);
  }

  @Get(':id')
  async getuserbyId(@Param('id') id: number, @Res() res: Response) {
    return await this.userservice.getuserbyId(id, res);
  }

  @UseGuards(JwtGuard)
  @Patch('updateprofile')
  @UseInterceptors(FileInterceptor('file'))
  async updateProfile(
    @Auth() auth: any,
    @Body() data: updateuserdto,
    @UploadedFile(FileValidationPipe) file: Express.Multer.File,
  ) {
    return await this.userservice.updateProfile(auth, data, file);
  }

  @Post('/forgot-passwordlink')
  async forgotPasswordlink(@Body() payload: any) {
    return await this.userservice.forgotpasswordlink(payload);
  }
  @Post('/forgot-password')
  async forgotPassword(@Body() payload: any, @Res() response: Response) {
    return await this.userservice.forgotpassword(payload, response);
  }

  @Post('verify-otp')
  async verifyOTP(@Body() payload: verifyOTPType, @Res() response: Response) {
    return await this.userservice.verifyOTP(
      payload.email,
      payload.otp,
      response,
    );
  }

  @Post('/reset-passwordlink/:id/:token')
  async resetPasswordLink(
    @Param() { id, token }: any,
    @Body() payload: updatePasswordwithLinkDTO,
    @Res() response: Response,
  ) {
    return await this.userservice.resetpasswordlink(
      id,
      token,
      payload.password,
      payload.confirmpassword,
      response,
    );
  }
  @Post('/reset-password')
  async resetPassword(
    @Body() payload: updatePasswordwithOTPDTO,
    @Res() response: Response,
  ) {
    return await this.userservice.resetpassword(
      payload.otp,
      payload.email,
      payload.password,
      payload.confirmpassword,
      response,
    );
  }

  @UseGuards(RefreshJWTGuard)
  @Post('refresh')
  async refreshToken(@Req() req: Request) { }

  //chnaga role....
  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  @Patch("/change_role")
  async changeRole(@Body() data: any, @Res() response: Response) {
    return await this.userservice.change_role(response, data);
  }
}

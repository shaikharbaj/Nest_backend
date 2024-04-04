import { Body, Controller, Post,Get, Param, UseGuards, Req } from '@nestjs/common';
import { PrismaService } from '../prisma/prismaservice';
import { UserService } from './user.service';
import { createUserDto } from './dto/createuser.dto';
import { loginuserDto } from './dto/loginuser.dto';
import { JwtGuard } from './guards/jwt.guards';
import { RefreshJWTGuard } from './guards/refreshtoken.guards';
import { Request } from 'express';
import { Auth } from './dto/authdto';

@Controller('user')
export class UserController {

    constructor(private readonly userservice: UserService) { }
    @Post("/create_user")
    async createuser(@Body() data: createUserDto) {
       return await this.userservice.createuser(data)
    }

    @Post("/login_user")
    async loginuser(@Body() data:loginuserDto){
      return await this.userservice.loginuser(data);
    }
    @UseGuards(JwtGuard)
    @Get("loaduser")
    async getuserprofile(@Auth() auth:any){
        return await this.userservice.getuserprofile(auth)
    }

    @UseGuards(RefreshJWTGuard)
    @Post('refresh')
    async refreshToken(@Req() req:Request){
            
    }
}

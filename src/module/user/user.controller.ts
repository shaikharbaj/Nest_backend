import { Body, Controller, Post,Get, Param, UseGuards, Req } from '@nestjs/common';
import { PrismaService } from '../prisma/prismaservice';
import { UserService } from './user.service';
import { createUserDto } from './dto/createuser.dto';
import { loginuserDto } from './dto/loginuser.dto';
import { JwtGuard } from './guards/jwt.guards';
import { RefreshJWTGuard } from './guards/refreshtoken.guards';

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
    @Get(":id")
    async getuserprofile(@Param("id") id:number){
        return await this.userservice.getuserprofile(id)
    }

    @UseGuards(RefreshJWTGuard)
    @Post('refresh')
    async refreshToken(@Req() req:Request){
            
    }
}

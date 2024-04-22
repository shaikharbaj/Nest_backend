import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { userSendResetLinkEvent } from './module/email/events/user.sendresetlink.event';
import { PrismaService } from './module/prisma/prismaservice';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private prisma: PrismaService) { }

  @Get()
  async getHello(): Promise<any> {
    // const payload = [
    //   { name: "ADMIN" },
    //   { name: "MODERATOR" },
    //   { name: "USER" }
    // ]
    // return await this.prisma.roles.createMany({
    //   data: [
    //        {name:"ADMIN"},
    //        {name:"MODERATOR"},
    //        {name:"USER"},
    //   ]
    // });

  }

  @Post("createuser")
  async createUser(@Body() body: any) {
    try {
      return await this.appService.createuser(body);
    } catch (error) {
      console.log(error)
    }
  }
}

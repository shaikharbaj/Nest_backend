import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { userSendResetLinkEvent } from './module/email/events/user.sendresetlink.event';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService, ) { }

  @Get()
  getHello(): Promise<any> {
    return this.appService.getHello();
  }

  @Post("createuser")
  async createUser(@Body() body:any){
      try {
       return await this.appService.createuser(body);
      } catch (error) {
        console.log(error)
      }
  }
}

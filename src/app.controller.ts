import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { userSendResetLinkEvent } from './module/email/events/user.sendresetlink.event';
import { PrismaService } from './module/prisma/prismaservice';
import { CloudinaryService } from './cloudinary.service';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private prisma: PrismaService,readonly cloudinary:CloudinaryService) { }

  public async extract_public(url: string) {
    const regex = /\/v\d+\/(\w+)\/\w+\.\w+$/;
    const match = url.match(regex);
    console.log(match);
    const publicID = match ? match[0].slice(1).split(".")[0].split("/").slice(1,3).join("/") : null;
    return publicID;
}
  @Get("/remove_image")
  async getHello(): Promise<any> {
      // const user_information = await this.prisma.user.findFirst({
      //      select:{
      //           role:{
      //                select:{
      //                   name:true,
      //                   id:true,
      //                   permissions:{
      //                        select:{
      //                             permission:{
      //                                  select:{
      //                                   slug
      //                                  }
      //                             }
      //                        }
      //                   }
      //                },
      //           }
      //      },
      //      where:{
      //           email:'admin@gmail.com'
      //      }
      // })
      // return user_information;
    
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

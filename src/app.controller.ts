import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { userSendResetLinkEvent } from './module/email/events/user.sendresetlink.event';
import { PrismaService } from './module/prisma/prismaservice';
import { CloudinaryService } from './cloudinary.service';
import { Response } from 'express';
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
// select:{
//   role:{
//        select:{
//           name:true,
//           id:true,
//           permissions:{
//                select:{
//                    permission_id:true,
//                    permission:true
//                }
//           }
//        },
//   }
// }

  @Get("/remove_image")
  async getHello(@Res() res:Response): Promise<any> {
      const user_information = await this.prisma.user.findFirst({
        select: {
          id: true,
          name: true,
          avatar: true,
          email: true,
          password: true,
          user_information: {
            select: {
              data_of_birth: true,
              phone_number: true,
              state: true,
              street: true,
              city: true,
              zipcode: true,
            },
          },
          role_id: true,
          role: {
            select: {
              id: true,
              name: true,
              permissions:{
                   select:{
                       permission_id:true,
                       permission:true
                   }
              }
            },
          },
        },
           where:{
                email:'admin@gmail.com'
           }
      })
      return res.send(user_information);
    
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

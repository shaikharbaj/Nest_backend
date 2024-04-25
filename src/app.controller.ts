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
    // {
    //   asset_id: '6ac92c13867d1ea82b19720e67bcb1b7',
    //   public_id: 'nest/vrmfgfgemlvk08md0efy',
    //   version: 1714067901,
    //   version_id: 'f6f58321bab168f10c908f1095dce77d',
    //   signature: 'ab1364b5c299e89ebc6abe801b7e3940162173a4',
    //   width: 1024,
    //   height: 682,
    //   format: 'jpg',
    //   resource_type: 'image',
    //   created_at: '2024-04-25T17:58:21Z',
    //   tags: [],
    //   bytes: 57533,
    //   type: 'upload',
    //   etag: '548c148032d38dec8d013c493c7a3219',
    //   placeholder: false,
    //   url: 'http://res.cloudinary.com/dj48ilwse/image/upload/v1714067901/nest/vrmfgfgemlvk08md0efy.jpg',
    //   secure_url: 'https://res.cloudinary.com/dj48ilwse/image/upload/v1714067901/nest/vrmfgfgemlvk08md0efy.jpg',
    //   folder: 'nest',
    //   original_filename: 'file',
    //   api_key: '892445676793415'
    // }
    const imageURL = "https://res.cloudinary.com/dj48ilwse/image/upload/v1713416503/nest/ccg1sut5bsgpsotx69zu.jpg"  
    const getPublicId =await this.extract_public(imageURL);
     const remove = await this.cloudinary.removeImage(getPublicId)
    
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

import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prismaservice';
import { Response } from 'express';
import { CloudinaryService } from 'src/cloudinary.service';
@Injectable()
export class BlogService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  public async extract_public(url: string) {
    const regex = /\/v\d+\/(\w+)\/\w+\.\w+$/;
    const match = url.match(regex);
    const publicID = match
        ? match[0].slice(1).split('.')[0].split('/').slice(1, 3).join('/')
        : null;
    return publicID;
}

  async removeImage(){
         const imageUrl = "https://res.cloudinary.com/dj48ilwse/image/upload/v1715011273/nest/bq427nfsjhsysnstxvte.png"

         const public_id = await this.extract_public(imageUrl);
         console.log(public_id);
  }

  async addblog(
    auth: any,
    data: any,
    file: Express.Multer.File,
    res: Response,
  ) {
    try {
      let fileUrl = '';
      if (file) {
        const result = await this.cloudinary.uploadImage(file);
        fileUrl = result.url;
      }
      const addedData = await this.prisma.blog.create({
        data: {
          title: data.title,
          description: data.description,
          image: fileUrl,
          category_id: Number(data.category_id),
          user_id: Number(auth.userId),
        },
      });

      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'blog posted successfully',
        data: addedData,
      });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, error: error.message });
    }
  }

  async getAllBlog(res: Response) {
    try {
      const data = await this.prisma.blog.findMany({
        select: {
          id: true,
          title: true,
          description: true,
          image:true,
          createdAt: true,
          updatedAt: true,
          user_id: true,
          user: {
            select: {
              name: true,
              email: true,
              avatar: true,
            },
          },
          category_id: true,
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'all blog fetch successfully',
        data: data,
      });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, error: error.message });
    }
  }

  async getblogById(id: number, res: Response) {
    try {
      const checkblogexist = await this.prisma.blog.findFirst({
        select: {
          id: true,
          title: true,
          description: true,
          image:true,
          createdAt: true,
          updatedAt: true,
          user_id: true,
          user: {
            select: {
              name: true,
              email: true,
              avatar: true,
            },
          },
          category_id: true,
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        where: {
          id: Number(id),
        },
      });
      if (!checkblogexist) {
        throw new Error('no blog found with this id');
      }

      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'all blog fetch successfully',
        data: checkblogexist,
      });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, error: error.message });
    }
  }

  async updateblog(
    id: number,
    data: any,
    file: Express.Multer.File,
    res: Response,
  ) {
    try {
      const checkblogexist = await this.prisma.blog.findFirst({
        where: {
          id: Number(id),
        },
      });
      if (!checkblogexist) {
        throw new Error('No blog found with this id');
      }
      const payload = {};
      //update data......
      if (data.title) {
        payload['title'] = data.title;
      }
      if (data.description) {
        payload['description'] = data.description;
      }
      if (data.category_id) {
        //check category exist....
        const checkCategoryExist = await this.prisma.category.findFirst({
          where: {
            id: Number(data.category_id),
          },
        });
        if (!checkCategoryExist) {
          throw new Error('no category found with this id');
        }
        payload['category_id'] = Number(data.category_id);
      }
      if (file) {
        //remove previous......
        const public_id = await this.extract_public(checkblogexist.image);
        await this.cloudinary
          .removeImage(public_id)
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
          });
        const result = await this.cloudinary.uploadImage(file);
        payload['image'] = result.url;
        //remove previous
      }

      const updated_data = await this.prisma.blog.update({
        select: {
          id: true,
          title: true,
          description: true,
          image:true,
          createdAt: true,
          updatedAt: true,
          user_id: true,
          user: {
            select: {
              name: true,
              email: true,
              avatar: true,
            },
          },
          category_id: true,
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        where: {
          id: Number(id),
        },
        data: payload,
      });
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'blog updated successfully',
        data: updated_data,
      });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, error: error.message });
    }
  }

  async deleteBlog(id:number,res:Response){
       try {
        //check blog exist ...
        const checkblogExist = await this.prisma.blog.findFirst({
              where:{
                  id:Number(id)
              }
        })
        if(!checkblogExist){
               throw new Error("no blog found with this id");
        }
        //delete blog....
        const deletedblog = await this.prisma.blog.delete({
                where:{
                        id:Number(id)
                }
        })

        //remove the image from clodinary
        await this.cloudinary.removeImage(await this.extract_public(deletedblog.image));
        return res.status(HttpStatus.OK).json({
            success: true,
            message: 'blog deleted successfully',
            data:deletedblog
          });
        } catch (error) {
          return res
            .status(HttpStatus.BAD_REQUEST)
            .json({ success: false, error: error.message });
        }
  }
}

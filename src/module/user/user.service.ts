import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prismaservice';
import { createUserDto } from './dto/createuser.dto';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { loginuserDto } from './dto/loginuser.dto';
import { Request } from 'express';
import { S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { CloudinaryService } from 'src/cloudinary.service';
import { updateuserdto } from './dto/updateuserdto';
@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
  ) { }

  public async hashpassword(password: string) {
    return await bcrypt.hash(password, 10);
  }
  public async extractPublicId(url: string) {
    const parts = url.split('/');
    const filename = parts[parts.length - 1];
    const publicId = filename.split('.')[0];
    return publicId;
  }

  public async generateToken(payload: any, options: any) {
    return await jwt.sign(payload, 'ARBAJ', options);
  }

  public async validateuser(data: loginuserDto) {
    //check user is exist or not
    const user = await this.findByEmail(data.email);

    //if user is not found
    if (!user) {
      throw new UnauthorizedException('Invalid credintials');
    }

    //comopair
    const checkpassword = await bcrypt.compare(data.password, user.password);
    if (!checkpassword) {
      throw new UnauthorizedException('Invalid credintials');
    }

    const { password, ...result } = user;

    return result;
  }

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  async createuser(data: createUserDto, file: any) {
    const checkuser = await this.prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });
    if (checkuser) {
      throw new ConflictException('user with this email already exit');
    }

    //hash password......
    const hashpassword = await this.hashpassword(data.password);
    const payload: any = {
      name: data.name,
      email: data.email,
      password: hashpassword,
    };
    if (file) {
      try {
        const result = await this.cloudinary.uploadImage(file);
        payload.avatar = result.url; // Add avatar property if image upload successful
      } catch (error) {
        console.error('Error uploading image:', error);
        throw new InternalServerErrorException('Failed to upload image');
      }
    }
    const newUser = await this.prisma.user.create({
      data: payload,
    });

    return newUser;
  }

  async loginuser(data: loginuserDto) {
    try {
      const user = await this.validateuser(data);
      const payload = {
        userId: user.id,
        email: user.email,
      };

      const token = await this.generateToken(payload, { expiresIn: '10h' });
      return {
        ...payload,
        token,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid credintials');
    }
  }
  async getuserprofile(auth: any) {
    try {
      const select = {
        id: true,
        name: true,
        email: true,
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
      };
      const user = await this.prisma.user.findFirst({
        where: {
          id: Number(auth.userId),
        },
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
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
        },
      });
      return user;
    } catch (error) {
      return error;
    }
  }

  async updateProfile(auth: any, data: updateuserdto, file: any) {
    //check email already exist or not
    const check = await this.prisma.user.findFirst({
      where: {
        email: data.email,
        NOT: {
          id: Number(auth.userId),
        },
      },
    });
    console.log(file);
    //check.......
    if (check) {
      throw new ConflictException('user already exist with this email id');
    }
    //current user...
    const currentuser = await this.prisma.user.findFirst({
      where: {
        id: auth.userId,
      },
    });

    const userPayload: any = {};
    const userInformationPayload: any = {
      userId: Number(auth.userId),
    };
    if (data.email) {
      userPayload.email = data.email;
    }
    if (data.name) {
      userPayload.name = data.name;
    }
    //check file is present or not....
    if (file) {
      //save file and remove previous added profile....
      try {
        if (currentuser.avatar) {
          const result = await this.cloudinary.uploadImage(file);
          userPayload.avatar = result.url; // Add avatar property if image upload successful
        } else {
          const result = await this.cloudinary.uploadImage(file);
          userPayload.avatar = result.url;
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        throw new InternalServerErrorException('Failed to upload image');
      }
    }
    if (data.data_of_birth) {
      userInformationPayload.data_of_birth = new Date(data.data_of_birth);
    }
    if (data.phone_number) {
      userInformationPayload.phone_number = data.phone_number;
    }
    if (data.street) {
      userInformationPayload.street = data.street;
    }
    if (data.city) {
      userInformationPayload.city = data.city;
    }
    if (data.state) {
      userInformationPayload.state = data.state;
    }
    if (data.zipcode) {
      userInformationPayload.zipcode = data.zipcode;
    }

    //update user.....

    const updateduserdata = await this.prisma.user.update({
      where: {
        id: auth.userId,
      },
      data: {
        ...userPayload,
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
      },
    });

    //update userInformation
    //check it is exist or not....
    let user_information: any;
    const checkuserinformationexist =
      await this.prisma.userInformation.findFirst({
        where: {
          userId: Number(currentuser.id),
        },
      });

    if (checkuserinformationexist) {
      user_information = await this.prisma.userInformation.update({
        where: {
          id: Number(checkuserinformationexist.id),
        },
        data: {
          ...userInformationPayload,
        },
      });
    } else {
      user_information = await this.prisma.userInformation.create({
        data: {
          ...userInformationPayload,
        },
      });
    }

    const payload: any = { ...updateduserdata, user_information: { ...userInformationPayload } };
    return payload;
  }
}

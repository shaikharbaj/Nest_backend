import {
  ConflictException,
  HttpCode,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prismaservice';
import { createUserDto } from './dto/createuser.dto';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { loginuserDto } from './dto/loginuser.dto';
import { CloudinaryService } from 'src/cloudinary.service';
import { updateuserdto } from './dto/updateuserdto';
import { PaginateFunction, paginator } from '../prisma/paginator';
import { MailerService } from '@nestjs-modules/mailer';
import { Response } from 'express';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { userSendResetLinkEvent } from '../email/events/user.sendresetlink.event';
import { successpassevent } from '../email/events/user.successpass.event';
import { error } from 'console';
const paginate: PaginateFunction = paginator({ perPage: 10 });
@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
    private readonly mailservice: MailerService,
    private readonly eventEmitter: EventEmitter2,
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
    console.log(user)
    //if user is not found
    if (!user) {
      throw new UnauthorizedException('Invalid credintials');
    }

    if (!user.status) {
      throw new Error("your accound is currently suspended please contact to admin")
    }

    //comopair
    const checkpassword = await bcrypt.compare(data.password, user.password);

    if (!checkpassword) {
      throw new UnauthorizedException('Invalid credintials');
    }

    const { password, ...result } = user;

    return result;
  }
  public async validateAdmin(data: loginuserDto) {
    //check user is exist or not
    const user = await this.findAdminByEmail(data.email);
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
  public generateotp() {
    var digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 6; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
  }

  async findByEmail(email: string) {
    const checkuserRole = await this.prisma.roles.findFirst({
      where: {
        name: 'USER',
      },
    });
    return await this.prisma.user.findUnique({
      select: {
        id: true,
        name: true,
        avatar: true,
        email: true,
        password: true,
        status: true,
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
            permissions: true
          },
        },

      },
      where: { email, role_id: Number(checkuserRole.id) },
    });
  }

  async findAdminByEmail(email: string) {
    const checkuserRole = await this.prisma.roles.findFirst({
      where: {
        name: 'USER',
      },
    });
    return await this.prisma.user.findUnique({
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
          },
        },
      },
      where: {
        email, NOT: {
          role_id: checkuserRole.id
        }
      },
    });
  }

  //dashboard count...
  async getalldashboardcount(response: Response) {
    try {
      //admin count......
      const roles = await this.prisma.roles.findMany({});
      const admin = roles.filter((role) => role.name === "ADMIN")[0];
      const subadmin = roles.filter((role) => role.name === "SUBADMIN")[0];
      const user = roles.filter((role) => role.name === "USER")[0];

      const admincount = await this.prisma.user.aggregate({
        _count: true, where: {
          role_id: Number(admin.id)
        }
      })
      //subadmin count.......
      const subadmincount = await this.prisma.user.aggregate({
        _count: true, where: {
          role_id: Number(subadmin.id)
        }
      })
      //user count........
      const usercount = await this.prisma.user.aggregate({
        _count: true, where: {
          role_id: Number(user.id)
        }
      })

      let data = {
        admincount,
        subadmincount,
        usercount
      }
      return response.status(HttpStatus.OK).json({ success: true, data })
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({ success: false, message: error.message })
    }
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

    // //hash password......
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

    //check user roleID
    const UserRoleId = await this.prisma.roles.findFirst({
      where: { name: 'USER' },
    });
    //create new User with type user....
    const userroleId = await this.prisma.roles.findFirst({
      where: { name: 'USER' },
    });
    const newUser = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashpassword,
        role_id: userroleId.id,
      },
    });

    return newUser;
    // const roles = JSON.parse(data?.roles);
    //check roles is exist or not....
    // const checkrolesexist = await this.prisma.roles.findMany({
    //       where:{
    //            id:{
    //               in:roles
    //            }
    //       }
    // })

    // const newUser = await this.prisma.user.create({
    //   data: {
    //     ...payload
    //   }
    // })
    // const datapayload = roles.map(roleid => ({ roleId: Number(roleid), userId: Number(newUser?.id) }))
    //add roles to the user.....
    // const addRoles = await this.prisma.userRoles.createMany({
    //   data: [
    //     ...datapayload
    //   ]
    // })
    // return newUser;
  }

  async loginuser(data: loginuserDto) {
    try {
      const user = await this.validateuser(data);
      const payload = {
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        user_information: user.user_information,
      };
      const token = await this.generateToken(payload, { expiresIn: '10h' });
      return {
        ...payload,
        token,
      };
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  async loginAdmin(data: loginuserDto) {
    try {
      const admin = await this.validateAdmin(data);
      const payload = {
        userId: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        avatar: admin.avatar,
        user_information: admin.user_information,
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
          // role: true,
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
  async getuserbyId(id: number, res: Response) {
    try {
      const userdata = await this.prisma.user.findFirst({
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          user_information: {
            select: {
              id: true,
              data_of_birth: true,
              state: true,
              street: true,
              city: true,
              zipcode: true,
              phone_number: true,
            },
          },
          role_id: true,
          role: {
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
      return res.status(HttpStatus.OK).json({ success: true, data: userdata });
    } catch (error) {
      return res
        .status(HttpStatus.FORBIDDEN)
        .json({ success: false, message: error.message });
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
        select: {
          id: true,
          data_of_birth: true,
          state: true,
          street: true,
          city: true,
          zipcode: true,
          phone_number: true,
        },
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
        select: {
          id: true,
          data_of_birth: true,
          state: true,
          street: true,
          city: true,
          zipcode: true,
          phone_number: true,
        },
      });
    }

    const payload: any = {
      ...updateduserdata,
      user_information: { ...user_information },
    };
    return payload;
  }

  //change role
  async change_role(response: Response, data: any) {
    if (!data.user_id) {
      return response
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: 'please provide userid' });
    }
    if (!data.role_id) {
      return response
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: 'please provide roleid' });
    }
    //check user present or not
    const user = await this.prisma.user.findFirst({
      where: { id: Number(data.user_id) },
    });
    if (!user) {
      return response
        .status(HttpStatus.NOT_FOUND)
        .json({ success: false, message: 'user is not present' });
    }
    //ckeck role...
    const role = await this.prisma.roles.findFirst({
      where: { id: Number(data.role_id) },
    });
    if (!role) {
      return response
        .status(HttpStatus.NOT_FOUND)
        .json({ success: false, message: 'role is not present' });
    }

    const userPayload = {
      id: true,
      name: true,
      email: true,
      avatar: true,
      user_information: {
        select: {
          id: true,
          data_of_birth: true,
          state: true,
          street: true,
          city: true,
          zipcode: true,
          phone_number: true,
        },
      },
      role_id: true,
      role: {
        select: {
          id: true,
          name: true,
        },
      },
    };

    //update role....
    const updateduser = await this.prisma.user.update({
      select: userPayload,
      where: {
        id: Number(data.user_id),
      },
      data: {
        role_id: Number(data.role_id),
      },
    });
    return response.status(HttpStatus.OK).json({
      success: true,
      message: 'user updated successfully',
      data: updateduser,
    });
  }

  //toggle status....
  async togglestatus(response: Response, id: number) {
    try {
      //check status......
      const select = {
        id: true,
        name: true,
        email: true,
        avatar: true,
        status: true,
        user_information: {
          select: {
            id: true,
            data_of_birth: true,
            phone_number: true,
            state: true,
            street: true,
            city: true,
            zipcode: true,
            userId: true,
          },
        },
        role_id: true,
        role: {
          select: {
            id: true,
            name: true,
          },
        },
      }
      const isActive = await this.prisma.user.findUnique({
        where: {
          id: Number(id)
        }
      })
      if (isActive.status) {
        const user = await this.prisma.user.update({
          select: select,
          where: {
            id: Number(id)
          },
          data: {
            status: false
          }
        })
        return response.status(HttpStatus.OK).json({ success: true, data: user, message: "status update successfully" })
      } else {
        const user = await this.prisma.user.update({
          select: select,
          where: {
            id: Number(id)
          },
          data: {
            status: true
          }
        })

        return response.status(HttpStatus.OK).json({ success: true, data: user, message: "status update successfully" })
      }
    } catch (error) {
      return response.status(HttpStatus.BAD_GATEWAY).json({ success: false, message: error.message });
    }
  }

  async findManywithPagination(select: {}, where: any, page: number = 1) {
    return await paginate(
      this.prisma.user,
      {
        select: select,
        where: { ...where },
      },
      { page },
    );
  }

  async getallusers(page: number, searchTerm: string) {
    const select = {
      id: true,
      name: true,
      email: true,
      avatar: true,
      status: true,
      user_information: {
        select: {
          id: true,
          data_of_birth: true,
          phone_number: true,
          state: true,
          street: true,
          city: true,
          zipcode: true,
          userId: true,
        },
      },
      role_id: true,
      role: {
        select: {
          id: true,
          name: true,
        },
      },
    };

    // let filter: any = {};
    // if (searchTerm) {
    //   filter = {
    //     OR: [
    //         { name: { contains: searchTerm, mode: 'insensitive' } },
    //         { email: { contains: searchTerm, mode: 'insensitive' } },
    //         {
    //             user_information: {
    //                 OR: [
    //                     { data_of_birth: { contains: searchTerm, mode: 'insensitive' } },
    //                     // { phone_number: { contains: searchTerm, mode: 'insensitive' } },
    //                     { street: { contains: searchTerm, mode: 'insensitive' } },
    //                     { city: { contains: searchTerm, mode: 'insensitive' } },
    //                     { state: { contains: searchTerm, mode: 'insensitive' } },
    //                     // { zipcode: { contains: searchTerm, mode: 'insensitive' } }
    //                 ]
    //             }
    //         }
    //     ]
    // };
    // }
    // // return JSON.stringify(filter)
    const where = {
      OR: [
        { name: { contains: searchTerm, mode: 'insensitive' } },
        { email: { contains: searchTerm, mode: 'insensitive' } },
        {
          user_information: {
            OR: [
              { phone_number: { contains: searchTerm, mode: 'insensitive' } },
              { street: { contains: searchTerm, mode: 'insensitive' } },
              { city: { contains: searchTerm, mode: 'insensitive' } },
              { state: { contains: searchTerm, mode: 'insensitive' } },
              { zipcode: { contains: searchTerm, mode: 'insensitive' } },
            ],
          },
        },
      ],
    };
    return await this.findManywithPagination(select, where, page);
  }

  async forgotpassword(payload: any, response: Response) {
    //check user exist or not......
    const checkuserexist = await this.prisma.user.findUnique({
      where: {
        email: payload.email,
      },
    });
    console.log(checkuserexist);
    if (!checkuserexist) {
      throw new UnauthorizedException('user not found');
    }
    //create OTP SAVE IN DATABASE AND SEND EMAIL TO USER......
    const OTP = this.generateotp();
    //save OTP IN DATABASE AND SEND MAIL TO USER....
    const check_OTP_EXIST = await this.prisma.oTP.findFirst({
      where: {
        user_id: Number(checkuserexist.id),
      },
    });

    if (check_OTP_EXIST) {
      await this.prisma.oTP.update({
        where: {
          user_id: Number(checkuserexist.id),
        },
        data: {
          otp: Number(OTP),
          isVerified: false,
        },
      });
    } else {
      await this.prisma.oTP.create({
        data: {
          otp: Number(OTP),
          user_id: checkuserexist.id,
          isVerified: false,
        },
      });
    }
    //send Email To User.......
    await this.mailservice.sendMail({
      from: '<arbaaj1147@gmail.com>',
      to: 'shaikharbaj2001@gmail.com',
      subject: `Reset password otp`,
      html: `<p>Hello user reset password OTP is <b>${OTP}</b></p>`,
    });
    return response
      .status(201)
      .json({ success: true, message: 'OTP send successfully' });
  }

  //for link method...
  async forgotpasswordlink(payload: any) {
    try {
      const checkuserexist = await this.prisma.user.findUnique({
        where: {
          email: payload.email,
        },
      });
      if (!checkuserexist) {
        throw new UnauthorizedException('user not found');
      }
      //generate token with expiry date........
      const token = await this.generateToken(
        { id: checkuserexist.id, email: checkuserexist.email },
        { expiresIn: '10m' },
      );

      //send link to client link to user on email...........
      let userid = checkuserexist.id;
      let to = checkuserexist.email;
      this.eventEmitter.emit(
        'user.sendresetlinkemail',
        new userSendResetLinkEvent(userid, token, to),
      );
      return {
        success: true,
        message: 'forgot password link send succesfully',
      };
    } catch (error) {
      console.log(error);
    }
  }

  //reset password using link....
  async resetpasswordlink(
    id: number,
    token: string,
    password: string,
    confirmpassword: string,
    response: Response,
  ) {
    try {
      //check user is exist or not.....
      const checkuserexist = await this.prisma.user.findUnique({
        where: { id: Number(id) },
      });
      if (!checkuserexist) {
        throw new UnauthorizedException('user not found');
      }
      //verify token.....
      const verifiedToken = await jwt.verify(token, 'ARBAJ');
      console.log(verifiedToken);
      if (password !== confirmpassword) {
        return response.status(401).json({
          success: false,
          message: 'password and confirmpassword not matched.',
        });
      }
      //hash password

      const hashedpassword = await this.hashpassword(password);
      //reset password........
      await this.prisma.user.update({
        where: {
          id: Number(checkuserexist.id),
        },
        data: {
          password: hashedpassword,
        },
      });
      const to = checkuserexist.email;
      this.eventEmitter.emit(
        'user.send_success_pass_update_email',
        new successpassevent(to),
      );
      return response
        .status(201)
        .json({ success: true, message: 'password updated successfully.' });
    } catch (error) {
      if (error.message === 'jwt expired') {
        return response
          .status(401)
          .json({ success: false, message: 'This url is expired' });
      }
      if (error.message) {
        return response
          .status(401)
          .json({ success: false, message: error.message });
      }
      return response.status(401).json({ success: false, message: error });
    }
  }
  //verify OTP.......
  async verifyOTP(email: any, otp: number, response: Response) {
    //check user exist or not.......
    const checkuser = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!otp) {
      return response
        .status(401)
        .json({ success: false, message: 'Otp is required' });
    }
    if (!checkuser) {
      return response
        .status(401)
        .json({ success: false, message: 'user not found' });
    }

    //verify otp
    const isVerified = await this.prisma.oTP.findUnique({
      where: {
        user_id: Number(checkuser.id),
        otp: Number(otp),
        isVerified: false,
      },
    });
    if (!isVerified) {
      return response
        .status(401)
        .json({ success: false, message: 'Invalid OTP...' });
    }

    //update isverified to true,,,
    await this.prisma.oTP.update({
      where: { id: Number(isVerified.id) },
      data: {
        isVerified: true,
      },
    });
    return response
      .status(201)
      .json({ success: false, message: 'OTP verified successfully' });
    //create passwordToken send back to user.............
  }

  async resetpassword(
    otp: number,
    email: string,
    password: string,
    confirmpassword: string,
    response: Response,
  ) {
    try {
      // try {
      //check user is present is present or not
      const checkuser = await this.prisma.user.findUnique({
        where: {
          email: email,
        },
      });

      if (!checkuser) {
        return response
          .status(401)
          .json({ success: false, message: 'Invalid user' });
      }

      //check condition OTP is correcct and isVerified is true...
      const isVerified = await this.prisma.oTP.findUnique({
        where: {
          user_id: Number(checkuser.id),
          otp: Number(otp),
          isVerified: true,
        },
      });

      if (isVerified) {
        //compair password and confirmpassword
        if (password === confirmpassword) {
          //reset password
          const hashedpassword = await this.hashpassword(password);
          //update password....
          await this.prisma.user.update({
            where: {
              id: Number(checkuser.id),
            },
            data: {
              password: hashedpassword,
            },
          });
          return response.status(201).json({
            success: true,
            message: 'password reset successfully.Please logged In....!',
          });
        } else {
          return response.status(401).json({
            success: false,
            message: 'password and confirmpassword does not match..',
          });
        }
        //reset password...
      } else {
        return response.status(401).json({
          success: false,
          message: 'Invalid OTP ! OTP is not verified',
        });
      }
    } catch (error) {
      return response
        .status(401)
        .json({ success: false, message: error?.message });
    }
  }

  @OnEvent('user.sendresetlinkemail')
  async sendresetlinkEmail(payload: userSendResetLinkEvent) {
    console.log('email send to user');
    await this.mailservice.sendMail({
      from: '<arbaaj1147@gmail.com>',
      to: `shaikharbaj2001@gmail.com`,
      subject: `Reset password otp`,
      html: `<p>Hello user reset password Link is <b>http://localhost:3000/reset-passwordlink/${payload.userid}/${payload.token}</b> and it is valid only for 10min</p>`,
    });
  }

  @OnEvent('user.send_success_pass_update_email')
  async sendsucessresetpassword(payload: successpassevent) {
    console.log('email send to user');
    await this.mailservice.sendMail({
      from: '<arbaaj1147@gmail.com>',
      to: `shaikharbaj2001@gmail.com`,
      subject: `password update notification`,
      html: `<p>${payload.to} user password updated successfully...!</p>`,
    });
  }
}

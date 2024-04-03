import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prismaservice';
import { createUserDto } from './dto/createuser.dto';
import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import { loginuserDto } from './dto/loginuser.dto';
@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) { }

    public async hashpassword(password: string) {
        return await bcrypt.hash(password, 10);
    }

    public async generateToken(payload: any, options: any) {
        return await jwt.sign(payload, "ARBAJ", options)
    }

    public async validateuser(data: loginuserDto) {
        //check user is exist or not
        const user = await this.findByEmail(data.email);

        //if user is not found
        if (!user) {
            throw new UnauthorizedException("Invalid credintials")
        }

        //comopair
        const checkpassword = await bcrypt.compare(data.password, user.password);
        if (!checkpassword) {
            throw new UnauthorizedException("Invalid credintials")
        }

        const { password, ...result } = user;

        return result;
    }

    async findByEmail(email: string) {
        return await this.prisma.user.findUnique({ where: { email } })
    }
    async createuser(data: createUserDto) {
        const checkuser = await this.prisma.user.findUnique({
            where: {
                email: data.email
            }
        })
        if (checkuser) {
            throw new ConflictException("user with this email already exit")
        }

        //hash password......
        const hashpassword = await this.hashpassword(data.password);
        const payload = {
            name: data.name,
            email: data.email,
            password: hashpassword
        }

        const newUser = await this.prisma.user.create({
            data: payload
        })

        return newUser;
    }

    async loginuser(data: loginuserDto) {
        try {
            const user = await this.validateuser(data);
            const payload = {
                userId: user.id,
                email: user.email
            }

            const token = await this.generateToken(payload, { expiresIn: "10s" })
            return {
                ...payload,
                token
            };
        } catch (error) {
            return error;
        }
    }

    async getuserprofile(id: number) {
        try {
            const user = await this.prisma.user.findFirst({
                where: { id: Number(id) }
            })
            const payload = { ...user };
            delete payload.password;
            return payload;
        } catch (error) {
            console.log(error)
            return error;
        }
    }

    async refreshToken(user: any) {

    }

}

import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prismaservice';
import { Response } from 'express';
import { json } from 'stream/consumers';
@Injectable()
export class RoleService {

    constructor(private readonly prisma: PrismaService) { }
    async getAllRoles(res: Response) {
        try {
            const roles = await this.prisma.roles.findMany({
                select: {
                    id: true,
                    name: true
                }
            });
            return res.status(HttpStatus.OK).json({ success: true, roles })
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({ success: false, error: error.message })
        }
    }

    async addrole(res: Response, data: any) {
        try {
            if (!data.role) {
                return res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: "please enter role" })
            }
            //check role alredy exist...
            const role = await this.prisma.roles.findFirst({
                where: {
                    name: data.role
                }
            })
            if (role) {
                return res.status(HttpStatus.CONFLICT).json({ success: false, message: "role alredy exist." })
            }
            //add role....
            const newrole = await this.prisma.roles.create({
                data: {
                    name: data.role
                }
            })
            return res.status(HttpStatus.OK).json({success:true,data:newrole});
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: error.message });
        }
    }
}
